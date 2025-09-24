import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Icon from '@/components/Icon';

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

      <div className="welcome-card">
        <h2>Welcome to Your Personal Wellness Hub</h2>
        <p>Everything here is private and secure, designed to support your personal growth and healthy relationships.</p>
      </div>
        
      <div className="dashboard-grid">
        <div className="feature-card">
          <div className="feature-header">
            <Icon name="brain" size={24} />
            <h3>AI Assistant</h3>
          </div>
          <p className="feature-description">
            Your personal AI companion for wellness conversations, relationship guidance, and personal development.
          </p>
          <a href="/ask-ai" className="btn btn-primary">Start Conversation</a>
        </div>

        <div className="feature-card">
          <div className="feature-header">
            <Icon name="chat" size={24} />
            <h3>Private Chat</h3>
          </div>
          <p className="feature-description">
            Secure, encrypted messaging for your private conversations and communications.
          </p>
          <a href="/chat" className="btn btn-primary">Enter Chat</a>
        </div>

        <div className="feature-card">
          <div className="feature-header">
            <Icon name="edit" size={24} />
            <h3>Story Builder</h3>
          </div>
          <p className="feature-description">
            Create personalized romantic stories with AI assistance. Build from concept to completion.
          </p>
          <a href="/stories/create" className="btn btn-primary">Create Story</a>
        </div>

        <div className="feature-card">
          <div className="feature-header">
            <Icon name="flower" size={24} />
            <h3>Wellness Explorer</h3>
          </div>
          <p className="feature-description">
            Explore wellness practices, exercises, and mindfulness techniques for better health.
          </p>
          <a href="/positions" className="btn btn-primary">Explore Wellness</a>
        </div>

        <div className="feature-card">
          <div className="feature-header">
            <Icon name="calendar" size={24} />
            <h3>Calendar</h3>
          </div>
          <p className="feature-description">
            Schedule and manage your wellness appointments, sessions, and personal time.
          </p>
          <a href="/appointments" className="btn btn-primary">View Calendar</a>
        </div>

        <div className="feature-card feature-card-disabled">
          <div className="feature-header">
            <Icon name="search" size={24} />
            <h3>Interest Explorer</h3>
          </div>
          <p className="feature-description">
            Discover and explore personal interests, hobbies, and activities for personal growth.
          </p>
          <div className="coming-soon">Coming Soon</div>
        </div>
      </div>

      <div className="privacy-card">
        <Icon name="lock" size={32} />
        <div className="privacy-content">
          <p>Your data is protected by the highest standards of privacy and encryption.</p>
          <p className="privacy-sub">All content is curated for positive personal development and healthy relationships.</p>
        </div>
      </div>
    </Layout>
  )
}