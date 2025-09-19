import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pkg from "pg";
import fetch from "node-fetch";
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

/** Appointments (stubs) */
app.get("/appointments", async (_req,res)=>{
  const q = await pool.query("SELECT * FROM appointments ORDER BY start_time DESC LIMIT 50");
  res.json(q.rows);
});
app.post("/appointments", async (req,res)=>{
  const { title, start_time, end_time } = req.body || {};
  const q = await pool.query("INSERT INTO appointments (title,start_time,end_time) VALUES ($1,$2,$3) RETURNING *", [title, start_time, end_time]);
  res.json(q.rows[0]);
});

/** Exercise Content (placeholder for wellness content) */
app.get("/exercise/content", async (req,res)=>{
  try{
    // This replaces the adult content API with wellness/exercise content
    res.status(200).json({
      items: [], 
      note: "Exercise and wellness content coming soon. This replaces the previous adult content integration."
    });
  }catch(e){
    console.error(e);
    res.status(500).json({message:"Exercise content error"});
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
    
    // Add system prompt for supportive conversations
    const systemPrompt = {
      role: "system", 
      content: "You are a warm, caring AI assistant focused on healthy relationships and personal wellness. You provide judgment-free support for personal conversations, relationship advice, and general wellness discussions. You are empathetic, understanding, and always prioritize healthy communication and well-being. Keep responses thoughtful and helpful."
    };
    
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

/** Wellness tracking (placeholder) */
app.post("/wellness/track", async (req,res)=>{
  // This replaces the adult toy integration with general wellness tracking
  res.json({ ok:true, note:"Wellness tracking feature placeholder" });
});

app.use("/settings", settingsRouter);
app.use("/luxury", luxuryRouter);

const PORT = 4000;
app.listen(PORT, ()=> console.log(`Gateway on :${PORT}`));
