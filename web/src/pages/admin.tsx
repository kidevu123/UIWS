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
        <p className="page-subtitle">Configure your personal wellness platform</p>
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
        <h3>AI & Persona Configuration</h3>
        <p className="sub">Configure your AI assistant's personality and behavior</p>
        
        <label style={{display:'block', marginBottom:8}}>
          Model:
          <input 
            placeholder="e.g., llama3.1:8b-instruct" 
            value={settings.defaultModel || ""} 
            onChange={e=>setSettings({...settings, defaultModel:e.target.value})} 
          />
        </label>

        <label style={{display:'block', marginBottom:8}}>
          Explicitness Level:
          <select value={settings.aiExplicitness || "moderate"} onChange={e=>setSettings({...settings, aiExplicitness: e.target.value})}>
            <option value="low">Low - Romantic and suggestive</option>
            <option value="moderate">Moderate - Tasteful intimacy</option>
            <option value="high">High - Open and direct</option>
          </select>
        </label>

        <label style={{display:'block', marginBottom:8}}>
          AI Tone:
          <select value={settings.aiTone || "romantic"} onChange={e=>setSettings({...settings, aiTone: e.target.value})}>
            <option value="romantic">Romantic - Tender and loving</option>
            <option value="playful">Playful - Flirty and fun</option>
            <option value="passionate">Passionate - Intense and sensual</option>
          </select>
        </label>

        <label style={{display:'block', marginBottom:8}}>
          Custom System Prompt:
          <textarea 
            placeholder="Override default AI personality with custom instructions..."
            value={settings.aiSystemPrompt || ""} 
            onChange={e=>setSettings({...settings, aiSystemPrompt: e.target.value})}
            rows={3}
            style={{width: '100%', marginTop: 4}}
          />
        </label>
      </div>

      <div className="card" style={{marginTop:12}}>
        <h3>API Integrations</h3>
        <p className="sub">Manage external service API keys and tokens</p>
        
        <label style={{display:'block', marginBottom:8}}>
          RedGifs API Token:
          <input 
            type="password"
            placeholder="Enter RedGifs OAuth token for positions content" 
            value={settings.redgifsToken || ""} 
            onChange={e=>setSettings({...settings, redgifsToken:e.target.value})} 
          />
        </label>

        <label style={{display:'block', marginBottom:8}}>
          Lovense Developer Token:
          <input 
            type="password"
            placeholder="Enter Lovense developer token for toy control" 
            value={settings.lovenseToken || ""} 
            onChange={e=>setSettings({...settings, lovenseToken:e.target.value})} 
          />
        </label>

        <label style={{display:'block', marginBottom:8}}>
          Lovense User ID:
          <input 
            placeholder="Your Lovense user identifier" 
            value={settings.lovenseUid || ""} 
            onChange={e=>setSettings({...settings, lovenseUid:e.target.value})} 
          />
        </label>

        <div style={{marginTop:12}}>
          <label style={{display:'block'}}>
            <input 
              type="checkbox" 
              checked={!!settings.enableRedGifs} 
              onChange={e=>setSettings({...settings, enableRedGifs: e.target.checked})} 
            /> Enable RedGifs content integration
          </label>
          <label style={{display:'block'}}>
            <input 
              type="checkbox" 
              checked={!!settings.enableLovense} 
              onChange={e=>setSettings({...settings, enableLovense: e.target.checked})} 
            /> Enable Lovense toy control
          </label>
        </div>
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
