import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Icon from "@/components/Icon";

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

  const greeting = me?.greeting || "Welcome to your wellness journey";

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">{greeting}</h1>
        <p className="page-subtitle">Your personal wellness and communication platform</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Welcome to Your Personal Wellness Hub</h2>
          <p className="card-subtitle">Everything here is private and secure, designed to support your personal growth and healthy relationships.</p>
        </div>
        
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div style={{ 
            padding: '24px', 
            borderRadius: '20px', 
            background: 'linear-gradient(135deg, rgba(192,132,252,0.15), rgba(168,85,247,0.12))',
            border: '1px solid rgba(192,132,252,0.25)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Icon name="brain" size={24} color="var(--accent)" />
              <h3 className="h3" style={{ margin: 0 }}>AI Assistant</h3>
            </div>
            <p className="sub" style={{ marginBottom: '16px' }}>
              Your personal AI companion for wellness conversations, relationship guidance, and personal development.
            </p>
            <a href="/ask-ai" className="btn btn-small">Start Conversation</a>
          </div>

          <div style={{ 
            padding: '24px', 
            borderRadius: '20px', 
            background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(88,28,135,0.12))',
            border: '1px solid rgba(236,72,153,0.25)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Icon name="chat" size={24} color="var(--rose)" />
              <h3 className="h3" style={{ margin: 0 }}>Private Chat</h3>
            </div>
            <p className="sub" style={{ marginBottom: '16px' }}>
              Secure, encrypted messaging for your private conversations and communications.
            </p>
            <a href="/chat" className="btn btn-small">Enter Chat</a>
          </div>

          <div style={{ 
            padding: '24px', 
            borderRadius: '20px', 
            background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(147,51,234,0.12))',
            border: '1px solid rgba(168,85,247,0.25)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Icon name="flower" size={24} color="var(--accent-secondary)" />
              <h3 className="h3" style={{ margin: 0 }}>Wellness Explorer</h3>
            </div>
            <p className="sub" style={{ marginBottom: '16px' }}>
              Explore wellness practices, exercises, and mindfulness techniques for better health.
            </p>
            <a href="/positions" className="btn btn-small">Explore Wellness</a>
          </div>

          <div style={{ 
            padding: '24px', 
            borderRadius: '20px', 
            background: 'linear-gradient(135deg, rgba(88,28,135,0.15), rgba(30,27,75,0.12))',
            border: '1px solid rgba(88,28,135,0.25)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Icon name="search" size={24} color="var(--plum)" />
              <h3 className="h3" style={{ margin: 0 }}>Interest Explorer</h3>
            </div>
            <p className="sub" style={{ marginBottom: '16px' }}>
              Discover and explore personal interests, hobbies, and activities for personal growth.
            </p>
            <a href="/interests" className="btn btn-small">Discover Interests</a>
          </div>

          <div style={{ 
            padding: '24px', 
            borderRadius: '20px', 
            background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(6,255,165,0.12))',
            border: '1px solid rgba(251,191,36,0.25)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Icon name="calendar" size={24} color="var(--gold)" />
              <h3 className="h3" style={{ margin: 0 }}>Schedule & Planning</h3>
            </div>
            <p className="sub" style={{ marginBottom: '16px' }}>
              Schedule and plan your activities with intelligent calendar coordination.
            </p>
            <a href="/appointments" className="btn btn-small">Plan Activities</a>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Icon name="lock" size={32} color="var(--accent)" style={{ marginBottom: '16px', opacity: 0.7 }} />
          <p style={{ opacity: 0.85, fontStyle: 'italic', marginBottom: '8px' }}>
            Your data is protected by the highest standards of privacy and encryption.
          </p>
          <p style={{ opacity: 0.7, fontSize: '14px' }}>
            All content is curated for positive personal development and healthy relationships.
          </p>
        </div>
      </div>
    </Layout>
  )
}
