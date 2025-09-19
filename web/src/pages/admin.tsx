import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

import { THEME_PACKS } from "@/lib/themes";
export default function Admin(){
  const helpCard = (k:string, msg:string) => (
  <div className="card" key={"help-"+k} style={{marginTop:12}}>
    <strong>How to fix: {k}</strong>
    <div className="sub">{msg}</div>
  </div>
);

  const [settings, setSettings] = useState<any>({});
  const [health, setHealth] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  useEffect(()=>{
    fetch("/api/settings").then(r=>r.json()).then((s)=> setSettings(s || {}));
    fetch("/api/health/all").then(r=>r.json()).then(setHealth);
  },[]);

  const save = async () => {
    await fetch("/api/settings", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(settings) });
    setSaved(true);
    setTimeout(()=>setSaved(false), 1500);
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure your private sanctuary</p>
      </div>
      
      <div className="card">
  <h3>Theme & Mood</h3>
  <select value={settings.theme || "soft-blush"} onChange={e=>setSettings({...settings, theme: e.target.value})}>
    {Object.entries(THEME_PACKS).map(([k,v]:any)=>(<option value={k} key={k}>{v.name}</option>))}
  </select>
  <p className="sub">Themes change fonts, backgrounds, accents. Switch anytime.</p>
  <label style={{display:'block', marginTop:8}}>
    <input type="checkbox" checked={!!settings.bg_music} onChange={e=>setSettings({...settings, bg_music: e.target.checked})} /> Gentle background music
  </label>
  <label style={{display:'block'}}>
    Anniversary date: <input type="date" value={settings.anniversary || ''} onChange={e=>setSettings({...settings, anniversary: e.target.value})} />
  </label>
</div>


      <div className="card" style={{marginTop:12}}>
        <h3>Model</h3>
        <input placeholder="defaultModel" value={settings.defaultModel || ""} onChange={e=>setSettings({...settings, defaultModel:e.target.value})} />
      </div>
<div className="card" style={{marginTop:12}}>
  <h3>Backups & Notifications</h3>
  <a className="btn" href="/api/luxury/backup.zip">Download encrypted backup (zip)</a>
  <div className="grid" style={{marginTop:10}}>
    <input placeholder="SMTP host" value={settings.smtp_host || ""} onChange={e=>setSettings({...settings, smtp_host:e.target.value})} />
    <input placeholder="SMTP port" value={settings.smtp_port || ""} onChange={e=>setSettings({...settings, smtp_port:e.target.value})} />
    <input placeholder="SMTP user" value={settings.smtp_user || ""} onChange={e=>setSettings({...settings, smtp_user:e.target.value})} />
    <input placeholder="SMTP pass" value={settings.smtp_pass || ""} onChange={e=>setSettings({...settings, smtp_pass:e.target.value})} />
    <input placeholder="From email" value={settings.smtp_from || ""} onChange={e=>setSettings({...settings, smtp_from:e.target.value})} />
    <input placeholder="Notify email" value={settings.notify_email || ""} onChange={e=>setSettings({...settings, notify_email:e.target.value})} />
  </div>
  <label style={{display:'block', marginTop:8}}>
    <input type="checkbox" checked={!!settings.health_notifications} onChange={e=>setSettings({...settings, health_notifications: e.target.checked})} /> Periodic health notifications
  </label>
</div>


      <div className="card" style={{marginTop:12}}>
        <h3>API Keys</h3>
        <input placeholder="REDGIFS_CLIENT_ID" value={settings.REDGIFS_CLIENT_ID || ""} onChange={e=>setSettings({...settings, REDGIFS_CLIENT_ID:e.target.value})} />
        <input placeholder="REDGIFS_CLIENT_SECRET" value={settings.REDGIFS_CLIENT_SECRET || ""} onChange={e=>setSettings({...settings, REDGIFS_CLIENT_SECRET:e.target.value})} />
        <input placeholder="LOVENSE_DEVELOPER_TOKEN" value={settings.LOVENSE_DEVELOPER_TOKEN || ""} onChange={e=>setSettings({...settings, LOVENSE_DEVELOPER_TOKEN:e.target.value})} />
      </div>

      <div className="card" style={{marginTop:12}}>
        <h3>Connectivity</h3>
        {!health && <p>Checking…</p>}
        {health && (
          <div className="grid">
            {Object.entries(health.checks).map(([k,v]: any)=> (
              <div key={k} className="card">
                <strong>{k}</strong><br/>
                <span style={{padding:"4px 8px", borderRadius:12, background: v.ok ? "#d7f5df":"#ffe2e2"}}>{v.ok ? "OK":"Issue"}</span>
                <div className="sub">{v.message || ""}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="btn" onClick={save}>Save</button>
      {saved && <span style={{marginLeft:12}}>Saved ✓</span>}
    </Layout>
  );
}
