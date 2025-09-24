import React, { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Icon from './Icon';
import FloatingAI from './FloatingAI';
import { Heart, Lock, LogOut } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [brandName, setBrandName] = useState('Our Private Space');

  useEffect(() => {
    // Load brand name from settings - keep "Our Private Space" as default
    fetch('/api/settings')
      .then(r => r.json())
      .then(settings => {
        if (settings?.brandName) {
          setBrandName(settings.brandName);
        }
      })
      .catch(() => {
        // Keep default if settings fail to load
      });
  }, []);

  // Navigation matching bolt repository structure
  const mainNavItems: NavItem[] = [
    { href: '/dashboard', label: 'Home', icon: 'heart' },
    { href: '/appointments', label: 'Appointments', icon: 'calendar' },
    { href: '/chat', label: 'Private Chat', icon: 'chat' },
    { href: '/fantasy-journal', label: 'Fantasy Space', icon: 'sparkles' },
    { href: '/scene-builder', label: 'Scene Builder', icon: 'user' },
    { href: '/positions', label: 'Intimacy Guide', icon: 'heart' },
    { href: '/stories', label: 'Story Library', icon: 'book' },
    { href: '/toys', label: 'Toy Control', icon: 'gamepad2' },
    { href: '/ask-ai', label: 'AI Companion', icon: 'bot' },
    { href: '/admin', label: 'Profile', icon: 'settings' },
  ];

  const isActive = (href: string) => router.pathname === href;

  const handleSignOut = () => {
    // Handle sign out logic
    window.location.href = '/';
  };

  return (
    <div className="app">
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(244, 63, 94, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '80px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={32} style={{ color: 'var(--accent)' }} />
            <span style={{ 
              fontSize: '24px', 
              fontFamily: 'var(--font-heading)', 
              color: 'var(--ink)',
              fontWeight: '600'
            }}>
              {brandName}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={16} style={{ color: 'var(--accent-secondary)' }} />
              <span style={{ fontSize: '14px', color: 'var(--ink-secondary)' }}>
                Secure & Private
              </span>
            </div>
            <button
              onClick={handleSignOut}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                color: 'var(--ink-secondary)',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'color 0.2s'
              }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <aside style={{
          width: '256px',
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(244, 63, 94, 0.2)',
          minHeight: 'calc(100vh - 80px)'
        }}>
          <nav style={{ padding: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {mainNavItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    background: isActive(item.href) 
                      ? 'rgba(244, 63, 94, 0.1)' 
                      : 'transparent',
                    color: isActive(item.href) 
                      ? 'var(--accent)' 
                      : 'var(--ink-secondary)',
                    fontWeight: isActive(item.href) ? '600' : '500'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.background = 'rgba(244, 63, 94, 0.05)';
                      e.currentTarget.style.color = 'var(--accent)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.href)) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--ink-secondary)';
                    }
                  }}
                >
                  <Icon name={item.icon} size={20} />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '24px' }}>
          {children}
        </main>
      </div>

      {/* Floating AI Assistant - always available */}
      <FloatingAI />
    </div>
  );
}