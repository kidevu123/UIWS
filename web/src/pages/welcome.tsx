import { useEffect, useRef, useState } from "react";

export default function Welcome(){
  const [text, setText] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<BlobPart[]>([]);

  useEffect(()=>{
    // Tooltips: very light first-tour hints
    setTimeout(()=>{
      const el = document.querySelector(".greeting");
      if(el) el.classList.add("pulse");
    }, 500);
  },[]);

  const startRec = async ()=>{
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream);
    mediaRef.current = rec;
    chunks.current = [];
    rec.ondataavailable = e => chunks.current.push(e.data);
    rec.onstop = async ()=>{
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      const fd = new FormData();
      fd.append("audio", blob, "message.webm");
      fd.append("text", text);
      await fetch("/api/luxury/partner-message", { method: "POST", body: fd });
      setStatus("Saved with audio ✓");
    };
    rec.start();
    setStatus("Recording…");
  };

  const stopRec = ()=> mediaRef.current?.stop();

  const saveText = async ()=>{
    const fd = new FormData();
    fd.append("text", text);
    await fetch("/api/luxury/partner-message", { method: "POST", body: fd });
    setStatus("Saved ✓");
  };

  return (
    <div className="container">
      <div className="greeting">Welcome</div>
      <div className="sub">A gentle beginning for your personal wellness platform.</div>

      <div className="card" style={{marginTop:12}}>
        <h3>Why I wanted us to have this wellness space</h3>
        <textarea rows={6} placeholder="Share your thoughts about health and wellness…" value={text} onChange={e=>setText(e.target.value)} />
        <div style={{display:"flex", gap:8, marginTop:10}}>
          <button className="btn" onClick={saveText}>Save</button>
          <button className="btn" onClick={startRec}>Record audio</button>
          <button className="btn" onClick={stopRec}>Stop</button>
        </div>
        {status && <div className="sub">{status}</div>}
      </div>

      <div className="card" style={{marginTop:12}}>
        <h3>First-use prompts</h3>
        <ul>
          <li>What wellness practices make you feel your best?</li>
          <li>Your favorite way to relax and unwind?</li>
          <li>A health goal you're curious about exploring?</li>
        </ul>
      </div>

      <div className="card" style={{marginTop:12}}>
        <h3>Getting Started</h3>
        <p>As you explore each feature, you'll find helpful tips. This is your safe space for personal growth.</p>
        <button className="btn" onClick={() => { localStorage.setItem('uiw_welcome_done', '1'); location.href='/dashboard'; }}>Begin</button>
      </div>
    </div>
  );
}
