import express from "express";
import pkg from "pg";
import multer from "multer";
import { Client as MinioClient } from "minio";
import archiver from "archiver";
import nodemailer from "nodemailer";
import cron from "node-cron";

const { Pool } = pkg;
const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const upload = multer({ storage: multer.memoryStorage() });

// MinIO client
function s3Client(){
  const endpoint = (process.env.S3_ENDPOINT || "http://minio:9000");
  const host = endpoint.replace("http://","").replace("https://","").split(":")[0];
  const port = parseInt(endpoint.split(":").pop()) || 9000;
  return new MinioClient({
    endPoint: host,
    port,
    useSSL: endpoint.startsWith("https://"),
    accessKey: process.env.S3_ACCESS_KEY || process.env.MINIO_ROOT_USER,
    secretKey: process.env.S3_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD,
  });
}

// Save a loving message (text + optional audio)
router.post("/partner-message", upload.single("audio"), async (req,res)=>{
  const { text, author_id } = req.body || {};
  let audio_key = null;
  try{
    if(req.file){
      const s3 = s3Client();
      const bucket = process.env.S3_BUCKET || "uiw-media";
      audio_key = `voices/${Date.now()}-${Math.random().toString(36).slice(2)}.webm`;
      await s3.putObject(bucket, audio_key, req.file.buffer, { "Content-Type": req.file.mimetype || "audio/webm" });
    }
    await pool.query("INSERT INTO partner_messages(author_id,text,audio_key) VALUES ($1,$2,$3)", [author_id || null, text || "", audio_key]);
    res.json({ ok:true, audio_key });
  }catch(e){
    console.error(e);
    res.status(500).json({ ok:false, message: "Could not save message" });
  }
});

router.post("/feedback", async (req,res)=>{
  const { message, author_id } = req.body || {};
  try{
    await pool.query("INSERT INTO feedback(author_id,message) VALUES ($1,$2)", [author_id || null, message || ""]);
    res.json({ ok:true });
  }catch(e){ res.status(500).json({ ok:false }); }
});

router.post("/milestone/incr", async (req,res)=>{
  const { key, amount } = req.body || {};
  const inc = Number(amount || 1);
  try{
    await pool.query("INSERT INTO milestones(key,count) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET count = milestones.count + $2, updated_at = now()", [key, inc]);
    const r = await pool.query("SELECT count FROM milestones WHERE key=$1", [key]);
    res.json({ ok:true, key, count: r.rows[0].count });
  }catch(e){ res.status(500).json({ ok:false }); }
});

// Create a simple backup zip (JSON exports)
router.get("/backup.zip", async (req,res)=>{
  try{
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=uiw-backup.zip");
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    const tables = ["users","settings","appointments","fantasies","feedback","milestones","partner_messages"];
    for(const t of tables){
      const r = await pool.query(`SELECT * FROM ${t}`);
      archive.append(JSON.stringify(r.rows, null, 2), { name: `db/${t}.json` });
    }
    archive.finalize();
  }catch(e){
    console.error(e);
    res.status(500).json({ ok:false });
  }
});

// Optional: health email using SMTP settings stored in settings.app_settings
async function getAppSettings(){
  const r = await pool.query("SELECT value FROM settings WHERE key='app_settings'");
  return r.rowCount ? r.rows[0].value : {};
}

async function sendHealthEmail(subject, text){
  const s = await getAppSettings();
  if(!s.smtp_host || !s.smtp_user || !s.smtp_pass || !s.notify_email) return;
  const tx = nodemailer.createTransport({
    host: s.smtp_host, port: Number(s.smtp_port || 587), secure: false,
    auth: { user: s.smtp_user, pass: s.smtp_pass }
  });
  await tx.sendMail({ from: s.smtp_from || s.smtp_user, to: s.notify_email, subject, text });
}

// Nightly check (02:00) if enabled
cron.schedule("0 2 * * *", async ()=>{
  try{
    const s = await getAppSettings();
    if(!s.health_notifications) return;
    const out = await fetch("http://gateway:4000/settings/health/all").then(r=>r.json());
    if(!out.ok){
      await sendHealthEmail("UIW Health Issue", JSON.stringify(out, null, 2));
    }
  }catch(e){}
});

export default router;
