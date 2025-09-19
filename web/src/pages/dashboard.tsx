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

  const greeting = me?.greeting || "Welcome to your dreams, darling";

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">{greeting}</h1>
        <p className="page-subtitle">Where midnight whispers become passionate realities</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Your Velvet Sanctuary Awaits</h2>
          <p className="card-subtitle">Every touch, every glance, every secret—sacred and yours alone.</p>
        </div>
        
        <div style={{ display: 'grid', gap: '32px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          <div style={{ 
            padding: '32px', 
            borderRadius: '24px', 
            background: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(139,95,191,0.08))',
            border: '2px solid rgba(0,212,255,0.2)',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: '16px', 
              right: '20px', 
              fontSize: '32px', 
              opacity: 0.6 
            }}>✨</div>
            <h3 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '24px',
              fontWeight: 600,
              marginBottom: '16px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Whispered Secrets</h3>
            <p style={{ 
              marginBottom: '24px',
              fontStyle: 'italic',
              opacity: 0.9,
              lineHeight: 1.6
            }}>
              Your private AI confidant awaits—for intimate conversations, burning questions, and desires too delicate for daylight.
            </p>
            <a href="/ask-ai" className="btn btn-small">Begin Whispering</a>
          </div>

          <div style={{ 
            padding: '32px', 
            borderRadius: '24px', 
            background: 'linear-gradient(135deg, rgba(255,20,147,0.10), rgba(139,95,191,0.08))',
            border: '2px solid rgba(255,20,147,0.2)',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: '16px', 
              right: '20px', 
              fontSize: '32px', 
              opacity: 0.6 
            }}>🌙</div>
            <h3 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '24px',
              fontWeight: 600,
              marginBottom: '16px',
              background: 'linear-gradient(135deg, var(--rose), var(--accent-2))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Sacred Moments</h3>
            <p style={{ 
              marginBottom: '24px',
              fontStyle: 'italic',
              opacity: 0.9,
              lineHeight: 1.6
            }}>
              Orchestrate your most treasured times together—from stolen afternoon glances to midnight rendezvous.
            </p>
            <a href="/appointments" className="btn btn-small">Schedule Intimacy</a>
          </div>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <p style={{ 
          fontSize: '18px',
          opacity: 0.8, 
          fontStyle: 'italic',
          lineHeight: 1.6,
          fontFamily: '"Spectral", serif'
        }}>
          🌹 Every intimate moment is veiled in discretion until you choose revelation 🌹
          <br />
          <span style={{ fontSize: '16px', opacity: 0.7 }}>
            Your privacy is our sacred promise, your comfort our highest devotion.
          </span>
        </p>
      </div>
    </Layout>
  )
}
