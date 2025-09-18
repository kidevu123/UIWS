import { useEffect, useState } from "react";

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
    <div className="container">
      <div className="greeting">Admin & Settings</div>
      <div className="card" style={{marginTop:12}}>
        <h3>Model</h3>
        <input placeholder="defaultModel" value={settings.defaultModel || ""} onChange={e=>setSettings({...settings, defaultModel:e.target.value})} />
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
    </div>
  );
}
