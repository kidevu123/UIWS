import { useEffect, useState } from "react";

type Health = { ok: boolean, checks: Record<string, {ok:boolean, message?:string}> };

export default function Onboarding(){
  const [criticalOk, setCriticalOk] = useState(false);

  const [health, setHealth] = useState<Health | null>(null);
  const [emails, setEmails] = useState({ user1:"", user2:"" });
  const [model, setModel] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(()=>{
    fetch("/api/onboarding/state").then(r=>r.json()).then(s=>{
      if (s?.completed) location.href = "/dashboard";
    });
    fetch("/api/health/all").then(r=>r.json()).then(h=>{ setHealth(h); setCriticalOk(Boolean(h?.checks?.postgres?.ok && h?.checks?.minio?.ok)); });
    fetch("/api/settings").then(r=>r.json()).then(s=>{
      if(s?.defaultModel) setModel(s.defaultModel);
    });
  },[]);

  const save = async () => {
    await fetch("/api/settings", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ defaultModel: model }) });
    await fetch("/api/onboarding/complete", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ emails, model }) });
    setSaved(true);
    setTimeout(()=>location.href="/dashboard", 600);
  };

  const Badge = ({ok}:{ok:boolean}) => <span style={{padding:"4px 8px", borderRadius:12, background: ok ? "#d7f5df":"#ffe2e2", color: ok ? "#135d26":"#7a1212"}}>{ok ? "OK":"Issue"}</span>;

  return (
    <div className="container">
      <div className="greeting">Welcome to Midnights Afterglow</div>
      <div className="sub">Let’s finish a few steps and you’ll be in.</div>

      <div className="card" style={{marginTop:12}}>
        <h3>1) System checks</h3>
        {!health && <p>Checking services…</p>}
        {health && (
          <div className="grid">
            {Object.entries(health.checks).map(([k,v])=> (
              <div key={k} className="card">
                <strong>{k}</strong><br/>
                <Badge ok={v.ok} /> <div className="sub">{v.message || ""}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{marginTop:12}}>
        <h3>2) Partner accounts</h3>
        <p>Confirm or change the two account emails. Passwords were generated during setup and can be reset later.</p>
        <div className="grid">
          <input placeholder="Partner email (User One)" value={emails.user1} onChange={e=>setEmails({...emails, user1:e.target.value})} />
          <input placeholder="Your email (User Two)" value={emails.user2} onChange={e=>setEmails({...emails, user2:e.target.value})} />
        </div>
      </div>

      <div className="card" style={{marginTop:12}}>
        <h3>3) Choose your model</h3>
        <p>Pick the local model to use for scenes and stories. You can change this later in Admin.</p>
        <input placeholder="e.g. llama3.1:8b-instruct or mythomax:Q4_K_M" value={model} onChange={e=>setModel(e.target.value)} />
      </div>

      <div className="card" style={{marginTop:12}}>
        <h3>4) Optional keys</h3>
        <p>Add RedGifs and Lovense tokens in Admin later. For now we will run in local-only mode.</p>
      </div>

      {!criticalOk && <div className="sub" style={{color:"crimson"}}>We need Postgres and storage healthy before continuing.</div>}
      <button className="btn" onClick={save} disabled={!criticalOk}>Finish setup</button>
      {saved && <div className="sub">Saving… redirecting.</div>}
    </div>
  );
}
