import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pkg from "pg";
import fetch from "node-fetch";
import multer from "multer";
import { Client as MinioClient } from "minio";
const { Pool } = pkg;
import settingsRouter from "./settings.js";
import luxuryRouter from "./luxury.js";

const app = express();

// SETTINGS LOOKUP
async function appSettings(pool){
  const r = await pool.query("SELECT value FROM settings WHERE key='app_settings'");
  return r.rowCount ? r.rows[0].value : {};
}

app.use(express.json({limit:"5mb"}));

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// MinIO configuration
const minioClient = new MinioClient({
  endPoint: (process.env.S3_ENDPOINT || 'http://minio:9000').replace('http://','').replace('https://','').split(':')[0],
  port: parseInt((process.env.S3_ENDPOINT || 'http://minio:9000').split(':').pop()) || 9000,
  useSSL: (process.env.S3_ENDPOINT || '').startsWith('https://'),
  accessKey: process.env.S3_ACCESS_KEY || process.env.MINIO_ROOT_USER,
  secretKey: process.env.S3_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD,
});

const bucketName = process.env.S3_BUCKET || 'uiw-media';

// Multer configuration for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

function sign(user){
  return jwt.sign({ id: user.id, email: user.email, role: user.role, greeting: user.greeting }, JWT_SECRET, { expiresIn: "7d" });
}

app.get("/health", (_req, res)=> res.json({ ok:true }));

/** Auth */
app.post("/auth/login", async (req,res)=>{
  const { email, password } = req.body || {};
  if(!email || !password) return res.status(400).json({message:"Missing email or password"});
  try{
    const q = await pool.query("SELECT id,email,password_hash,role,greeting FROM users WHERE email=$1", [email.toLowerCase()]);
    if(!q.rowCount) return res.status(401).json({message:"Invalid credentials"});
    const u = q.rows[0];
    const ok = await bcrypt.compare(password, u.password_hash);
    if(!ok) return res.status(401).json({message:"Invalid credentials"});
    const token = sign(u);
    res.json({ token, user: { id:u.id, email:u.email, role:u.role, greeting:u.greeting } });
  }catch(e){
    console.error(e);
    res.status(500).json({message:"Auth error"});
  }
});

app.get("/auth/me", async (req,res)=>{
  // In a real build, verify cookie. For now, return first user basics to unblock UI.
  try{
    const q = await pool.query("SELECT id,email,role,greeting FROM users ORDER BY created_at ASC LIMIT 1");
    res.json(q.rows[0] || {});
  }catch(e){ res.status(500).json({}); }
});

/** Appointments (full CRUD) */
app.get("/appointments", async (_req,res)=>{
  const q = await pool.query("SELECT * FROM appointments ORDER BY start_time DESC LIMIT 50");
  res.json(q.rows);
});

app.post("/appointments", async (req,res)=>{
  const { title, start_time, end_time, description } = req.body || {};
  if (!title || !start_time) {
    return res.status(400).json({ message: "Title and start_time are required" });
  }
  const q = await pool.query(
    "INSERT INTO appointments (title, start_time, end_time, description) VALUES ($1,$2,$3,$4) RETURNING *", 
    [title, start_time, end_time, description]
  );
  res.json(q.rows[0]);
});

app.put("/appointments/:id", async (req,res)=>{
  const { id } = req.params;
  const { title, start_time, end_time, description } = req.body || {};
  
  try {
    const q = await pool.query(
      "UPDATE appointments SET title=$1, start_time=$2, end_time=$3, description=$4 WHERE id=$5 RETURNING *",
      [title, start_time, end_time, description, id]
    );
    
    if (q.rowCount === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    
    res.json(q.rows[0]);
  } catch(e) {
    console.error(e);
    res.status(500).json({ message: "Failed to update appointment" });
  }
});

app.delete("/appointments/:id", async (req,res)=>{
  const { id } = req.params;
  
  try {
    const q = await pool.query("DELETE FROM appointments WHERE id=$1 RETURNING *", [id]);
    
    if (q.rowCount === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    
    res.json({ message: "Appointment deleted successfully", appointment: q.rows[0] });
  } catch(e) {
    console.error(e);
    res.status(500).json({ message: "Failed to delete appointment" });
  }
});

/** RedGifs API Integration for Positions */
app.get("/positions/redgifs", async (req,res)=>{
  try{
    const cfg = await appSettings(pool);
    const redgifsToken = cfg.redgifsToken || process.env.REDGIFS_TOKEN;
    
    if (!redgifsToken) {
      return res.status(200).json({
        items: [],
        error: "RedGifs API token not configured. Please set token in Admin panel."
      });
    }

    const tag = req.query.tag || "romantic";
    const count = Math.min(parseInt(req.query.count) || 20, 50);
    
    // Fetch from RedGifs API
    const response = await fetch(`https://api.redgifs.com/v2/gifs/search?search_text=${encodeURIComponent(tag)}&order=trending&count=${count}`, {
      headers: {
        'Authorization': `Bearer ${redgifsToken}`,
        'User-Agent': 'UIWApp/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`RedGifs API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform data for our frontend
    const items = (data.gifs || []).map(gif => ({
      id: gif.id,
      title: gif.tags?.[0] || tag,
      url: gif.urls?.hd || gif.urls?.sd || gif.urls?.thumbnail,
      thumbnail: gif.urls?.thumbnail,
      tags: gif.tags || [tag],
      duration: gif.duration,
      views: gif.views
    }));

    res.json({ items, count: items.length });
    
  }catch(e){
    console.error('RedGifs API error:', e);
    res.status(500).json({
      items: [],
      error: "Failed to fetch content. Check API token and connectivity."
    });
  }
});

/** Stories via local LLM (OpenWebUI OpenAI-compatible) */
app.post("/stories/generate", async (req,res)=>{
  try{
    const base = process.env.OPENWEBUI_BASE || "http://openwebui:8080";
    const cfg = await appSettings(pool);
    const model = cfg.defaultModel || process.env.DEFAULT_MODEL || "llama3.1:8b-instruct";
    const prompt = (req.body && req.body.prompt) || "Write a positive, uplifting story about personal growth.";
    const r = await fetch(`${base}/v1/chat/completions`, {
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        model,
        messages: [
          { role:"system", content:"You are a supportive writing assistant. Keep content positive, uplifting, and appropriate for all audiences."},
          { role:"user", content: prompt }
        ]
      })
    });
    const j = await r.json();
    const text = j.choices?.[0]?.message?.content || "";
    res.json({ text });
  }catch(e){
    console.error(e);
    res.status(500).json({message:"LLM error"});
  }
});

/** AI Chat via local LLM (OpenWebUI OpenAI-compatible) */
app.post("/ai/chat", async (req,res)=>{
  try{
    const base = process.env.OPENWEBUI_BASE || "http://openwebui:8080";
    const cfg = await appSettings(pool);
    const model = cfg.defaultModel || process.env.DEFAULT_MODEL || "llama3.1:8b-instruct";
    const messages = req.body?.messages || [];
    
    // Use admin-configurable system prompt and persona
    const defaultPrompt = "You are a warm, understanding AI companion designed for intimate conversations between partners. You support mature, adult discussions about relationships, desires, and fantasies. You are judgment-free, encouraging, and help facilitate open communication. You adapt your tone and explicitness based on the conversation context while remaining respectful and consensual.";
    
    const systemPrompt = {
      role: "system", 
      content: cfg.aiSystemPrompt || cfg.aiPersona || defaultPrompt
    };
    
    // Apply explicitness settings
    if (cfg.aiExplicitness === 'high') {
      systemPrompt.content += " You are comfortable discussing intimate and explicit topics openly and directly.";
    } else if (cfg.aiExplicitness === 'moderate') {
      systemPrompt.content += " You can discuss intimate topics but keep language tasteful and elegant.";
    } else if (cfg.aiExplicitness === 'low') {
      systemPrompt.content += " You keep conversations romantic and suggestive but not explicitly graphic.";
    }
    
    // Add tone modifiers
    if (cfg.aiTone === 'playful') {
      systemPrompt.content += " Your tone is playful, flirty, and fun.";
    } else if (cfg.aiTone === 'romantic') {
      systemPrompt.content += " Your tone is romantic, tender, and loving.";
    } else if (cfg.aiTone === 'passionate') {
      systemPrompt.content += " Your tone is passionate, intense, and sensual.";
    }
    
    const fullMessages = [systemPrompt, ...messages];
    
    const r = await fetch(`${base}/v1/chat/completions`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        model,
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    if (!r.ok) {
      throw new Error(`OpenWebUI error: ${r.status}`);
    }
    
    const j = await r.json();
    const content = j.choices?.[0]?.message?.content || "I apologize, but I'm having trouble responding right now.";
    res.json({ content });
  }catch(e){
    console.error(e);
    res.status(500).json({message:"AI Chat error", error: e.message});
  }
});

/** TTS relay to Piper HTTP */
app.post("/tts", async (req,res)=>{
  try{
    const text = (req.body && req.body.text) || "Hello";
    const voice = process.env.DEFAULT_TTS_VOICE || "en_US-lessac-medium";
    const tts = process.env.TTS_HTTP || "http://tts:5000";
    const r = await fetch(`${tts}/api/tts?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(voice)}`);
    res.setHeader("Content-Type", "audio/wav");
    res.send(Buffer.from(await r.arrayBuffer()));
  }catch(e){
    console.error(e);
    res.status(500).json({message:"TTS error"});
  }
});

/** Toy Control Endpoints */
app.post("/toys/lovense/connect", async (req,res)=>{
  try{
    const cfg = await appSettings(pool);
    const lovenseToken = cfg.lovenseToken || process.env.LOVENSE_TOKEN;
    
    if (!lovenseToken) {
      return res.status(400).json({ 
        error: "Lovense token not configured. Please set token in Admin panel." 
      });
    }

    // Test connection to Lovense API
    const response = await fetch('https://api.lovense.com/api/lan/getToys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: lovenseToken,
        uid: cfg.lovenseUid || 'user1'
      })
    });

    const data = await response.json();
    res.json({ connected: response.ok, toys: data.toys || [], response: data });
    
  }catch(e){
    console.error('Lovense connection error:', e);
    res.status(500).json({ error: "Connection failed", message: e.message });
  }
});

app.post("/toys/lovense/control", async (req,res)=>{
  try{
    const { action, intensity, duration } = req.body;
    const cfg = await appSettings(pool);
    const lovenseToken = cfg.lovenseToken || process.env.LOVENSE_TOKEN;
    
    if (!lovenseToken) {
      return res.status(400).json({ 
        error: "Lovense token not configured" 
      });
    }

    const response = await fetch('https://api.lovense.com/api/lan/command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: lovenseToken,
        uid: cfg.lovenseUid || 'user1',
        command: action,
        v: intensity || 1,
        sec: duration || 1
      })
    });

    const data = await response.json();
    res.json({ success: response.ok, response: data });
    
  }catch(e){
    console.error('Lovense control error:', e);
    res.status(500).json({ error: "Control failed", message: e.message });
  }
});

/** Media Upload and Storage */
app.post("/media/upload", upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`;
    const { category = 'gallery', isPrivate = false } = req.body;

    // Upload to MinIO
    await minioClient.putObject(bucketName, fileName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
      'X-Category': category,
      'X-Private': isPrivate.toString()
    });

    // Store metadata in database
    const q = await pool.query(
      "INSERT INTO media (filename, original_name, mimetype, size, category, is_private, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *",
      [fileName, file.originalname, file.mimetype, file.size, category, isPrivate]
    );

    res.json({
      id: q.rows[0].id,
      filename: fileName,
      url: `/media/file/${fileName}`,
      thumbnail: file.mimetype.startsWith('image/') ? `/media/thumbnail/${fileName}` : null,
      category,
      isPrivate
    });

  } catch (e) {
    console.error('Media upload error:', e);
    res.status(500).json({ error: "Upload failed", message: e.message });
  }
});

app.get("/media/file/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Check if file exists and get metadata
    const stat = await minioClient.statObject(bucketName, filename);
    
    // Stream file from MinIO
    const stream = await minioClient.getObject(bucketName, filename);
    
    res.setHeader('Content-Type', stat.metaData['content-type'] || 'application/octet-stream');
    res.setHeader('Content-Length', stat.size);
    
    stream.pipe(res);
    
  } catch (e) {
    console.error('Media serve error:', e);
    res.status(404).json({ error: "File not found" });
  }
});

app.get("/media/list", async (req, res) => {
  try {
    const { category = 'all' } = req.query;
    
    let query = "SELECT * FROM media WHERE 1=1";
    const params = [];
    
    if (category !== 'all') {
      query += " AND category = $1";
      params.push(category);
    }
    
    query += " ORDER BY created_at DESC LIMIT 50";
    
    const result = await pool.query(query, params);
    
    const media = result.rows.map(item => ({
      ...item,
      url: `/media/file/${item.filename}`,
      thumbnail: item.mimetype.startsWith('image/') ? `/media/thumbnail/${item.filename}` : null
    }));
    
    res.json(media);
    
  } catch (e) {
    console.error('Media list error:', e);
    res.status(500).json({ error: "Failed to list media" });
  }
});

/** Chat Messages System */
app.get("/chat/messages", async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const q = await pool.query(`
      SELECT cm.*, 
             s.email as sender_email, s.role as sender_role,
             r.email as recipient_email, r.role as recipient_role
      FROM chat_messages cm
      LEFT JOIN users s ON cm.sender_id = s.id
      LEFT JOIN users r ON cm.recipient_id = r.id
      ORDER BY cm.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    
    res.json(q.rows);
  } catch (e) {
    console.error('Chat messages error:', e);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.post("/chat/messages", async (req, res) => {
  try {
    const { recipient_id, content, message_type = 'text', media_filename = null } = req.body;
    
    // For now, we'll use the first user as sender (in real app, get from JWT token)
    const senderQuery = await pool.query("SELECT id FROM users ORDER BY created_at ASC LIMIT 1");
    const sender_id = senderQuery.rows[0]?.id;
    
    if (!sender_id) {
      return res.status(400).json({ error: "No sender found" });
    }

    const q = await pool.query(`
      INSERT INTO chat_messages (sender_id, recipient_id, content, message_type, media_filename)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [sender_id, recipient_id, content, message_type, media_filename]);
    
    res.json(q.rows[0]);
  } catch (e) {
    console.error('Send message error:', e);
    res.status(500).json({ error: "Failed to send message", message: e.message });
  }
});

app.put("/chat/messages/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    
    const q = await pool.query(`
      UPDATE chat_messages 
      SET read_at = NOW() 
      WHERE id = $1 AND read_at IS NULL
      RETURNING *
    `, [id]);
    
    res.json({ success: true, updated: q.rowCount > 0 });
  } catch (e) {
    console.error('Mark read error:', e);
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

app.use("/settings", settingsRouter);
app.use("/luxury", luxuryRouter);

const PORT = 4000;
app.listen(PORT, ()=> console.log(`Gateway on :${PORT}`));
