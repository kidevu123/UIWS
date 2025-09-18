import { useEffect, useState } from "react";

export default function Dashboard(){
  const [ob,setOb] = useState<any>(null);
  useEffect(()=>{ fetch('/api/onboarding/state').then(r=>r.json()).then(s=>{ if(!s?.completed){ location.href='/onboarding'; } else { setOb(s);} }); },[]);

  const [me,setMe] = useState<any>(null);

  useEffect(()=>{
    fetch("/api/me").then(r=>r.json()).then(setMe).catch(()=>{});
  },[]);

  const greeting = me?.greeting || "Hello, Beautiful";

  return (
    <div className="container">
      <div className="header">
        <div className="greeting">{greeting}</div>
        <div className="sub">Your private dashboard</div>
      </div>

      <div className="nav">
        <a className="btn" href="/appointments">Shave Appointments</a>
        <a className="btn" href="/chat">Private Chat</a>
        <a className="btn" href="/gallery">Media Gallery</a>
        <a className="btn" href="/kinks">Kinks Explorer</a>
        <a className="btn" href="/fantasy-journal">My Fantasy Space</a>
        <a className="btn" href="/scene-builder">Scene Builder</a>
        <a className="btn" href="/positions">Positions</a>
        <a className="btn" href="/stories">Stories</a>
        <a className="btn" href="/toys">Toy Control</a>
        <a className="btn" href="/ask-ai">Ask Anything</a>
        <a className="btn" href="/admin">Admin</a>
      </div>

      <div className="card">
        <p>Everything here is private and for the two of us only. Explicit media is blurred until you tap to reveal.</p>
      </div>
    </div>
  )
}
