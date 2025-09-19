import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function Dashboard(){
  const [ob,setOb] = useState<any>(null);
  useEffect(()=>{ fetch('/api/onboarding/state').then(r=>r.json()).then(s=>{ if(!s?.completed){ location.href='/onboarding'; } else { setOb(s);} });
    // First-login welcome
    if(!localStorage.getItem('uiw_welcome_done')){ location.href='/welcome'; }
  },[]);

  const [me,setMe] = useState<any>(null);

  useEffect(()=>{
    fetch("/api/me").then(r=>r.json()).then(setMe).catch(()=>{});
  },[]);

  const greeting = me?.greeting || "Hello, Beautiful";

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">{greeting}</h1>
        <p className="page-subtitle">Your intimate sanctuary awaits</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Welcome to Your Private Space</h2>
          <p className="card-subtitle">Everything here is private and sacred, just for the two of you.</p>
        </div>
        
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div style={{ 
            padding: '24px', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, rgba(104,232,237,0.1), rgba(133,102,162,0.1))',
            border: '1px solid rgba(104,232,237,0.2)'
          }}>
            <h3 className="h3">🤖 Ask Anything</h3>
            <p className="sub" style={{ marginBottom: '16px' }}>
              Your private AI companion for intimate conversations, questions, and journaling.
            </p>
            <a href="/ask-ai" className="btn btn-small">Start Chatting</a>
          </div>

          <div style={{ 
            padding: '24px', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, rgba(214,139,176,0.1), rgba(98,41,100,0.1))',
            border: '1px solid rgba(214,139,176,0.2)'
          }}>
            <h3 className="h3">📅 Appointments</h3>
            <p className="sub" style={{ marginBottom: '16px' }}>
              Schedule and manage your private moments together.
            </p>
            <a href="/appointments" className="btn btn-small">View Schedule</a>
          </div>
        </div>
      </div>

      <div className="card">
        <p style={{ textAlign: 'center', opacity: 0.8, fontStyle: 'italic' }}>
          Explicit content is thoughtfully blurred until you choose to reveal it. 
          Your privacy and comfort are paramount.
        </p>
      </div>
    </Layout>
  )
}
