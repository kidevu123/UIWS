// Extra gateway APIs for onboarding, settings, and health checks.
import express from "express";
import pkg from "pg";
import dns from 'dns/promises';
import { Client as MinioClient } from 'minio';
import fetch from "node-fetch";
const { Pool } = pkg;
const router = express.Router();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function getAppSettings(){
  const r = await pool.query("SELECT value FROM settings WHERE key='app_settings'");
  return r.rowCount ? r.rows[0].value : {};
}


async function setSetting(key, value){
  await pool.query(
    "INSERT INTO settings(key,value,updated_at) VALUES ($1,$2,now()) ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=now()",
    [key, value]);
}

async function getSetting(key){
  const r = await pool.query("SELECT value FROM settings WHERE key=$1", [key]);
  return r.rowCount ? r.rows[0].value : null;
}

router.get("/onboarding/state", async (_req,res)=>{
  const ob = await getSetting("onboarding");
  res.json(ob || { completed:false });
});

router.post("/onboarding/complete", async (req,res)=>{
  const { emails, model } = req.body || {};
  await setSetting("onboarding", { completed:true, emails, model });
  res.json({ ok:true });
});

router.get("/health/all", async (_req,res)=>{
  const out = { ok:true, checks:{} };
  const push = (k, ok, msg="") => { out.checks[k] = { ok, message: msg }; if(!ok) out.ok = false; };

  // DB
  try { await pool.query("SELECT 1"); push("postgres", true); } catch(e){ push("postgres", false, String(e)); }

  // MinIO
  try {
    const s3 = new MinioClient({
      endPoint: (process.env.S3_ENDPOINT || 'http://minio:9000').replace('http://','').replace('https://','').split(':')[0],
      port: parseInt((process.env.S3_ENDPOINT || 'http://minio:9000').split(':').pop()) || 9000,
      useSSL: (process.env.S3_ENDPOINT || '').startsWith('https://'),
      accessKey: process.env.S3_ACCESS_KEY || process.env.MINIO_ROOT_USER,
      secretKey: process.env.S3_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD,
    });
    const bucket = process.env.S3_BUCKET || 'uiw-media';
    const exists = await s3.bucketExists(bucket).catch(()=>false);
    if(!exists){ try { await s3.makeBucket(bucket); } catch(_){} }
    // write test (tiny)
    const testKey = 'healthcheck.txt';
    await s3.putObject(bucket, testKey, Buffer.from('ok'));
    push("minio", true, "bucket ready: "+bucket);
  } catch(e){ push("minio", false, String(e)); }
  try {
    const endpoint = process.env.S3_ENDPOINT || "http://minio:9000";
    const r = await fetch(endpoint, { method:"HEAD" });
    push("minio", r.ok, "HEAD " + endpoint + " => " + r.status);
  } catch(e){ push("minio", false, String(e)); }

  // Redis (optional: not used in base)
  try { push("redis", true); } catch(e){ push("redis", false, String(e)); }

  // OpenWebUI
  try {
    const base = process.env.OPENWEBUI_BASE || "http://openwebui:8080";
    const r = await fetch(base+"/health");
    push("openwebui", r.ok, "GET /health => "+r.status);
  } catch(e){ push("openwebui", false, String(e)); }

  // Ollama
  try {
    const oll = process.env.OLLAMA_BASE || "http://ollama:11434";
    const r = await fetch(oll+"/api/tags");
    push("ollama", r.ok, "GET /api/tags => "+r.status);
  } catch(e){ push("ollama", false, String(e)); }

  // TTS
  try {
    const tts = process.env.TTS_HTTP || "http://tts:5000";
    const r = await fetch(tts+"/");
    push("tts", r.ok, "GET / => "+r.status);
  } catch(e){ push("tts", false, String(e)); }

  // Chat (VoceChat)
  try {
    const r = await fetch("http://vocechat:3000");
    push("chat", r.ok, "GET vocechat => "+r.status);
  } catch(e){ push("chat", false, String(e)); }

  // Proxy self-check (optional)
  push("proxy", true);

    // HTTPS / DNS via APP_DOMAIN
try {
  const domain = process.env.APP_DOMAIN || "";
  if(!domain){ push("https", false, "APP_DOMAIN not set"); }
  else{
    const ips = await dns.resolve4(domain);
    if(!ips.length) push("https", false, "No A record for domain");
    else push("https", true, "DNS OK: "+ips.join(','));
  }
} catch(e){ push("https", false, String(e)); }


  res.json(out);
});

router.post("/settings", async (req,res)=>{
  const body = req.body || {};
  await setSetting("app_settings", body);
  res.json({ ok:true });
});

router.get("/settings", async (_req,res)=>{
  const s = await getSetting("app_settings");
  res.json(s || {});
});

export default router;
