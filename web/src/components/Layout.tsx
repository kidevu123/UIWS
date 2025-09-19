import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Icon from './Icon';
import FloatingAI from './FloatingAI';

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

  // Only show functional features - remove all placeholders
  const mainNavItems: NavItem[] = [
    { href: '/dashboard', label: 'Home', icon: 'home' },
    { href: '/ask-ai', label: 'AI Assistant', icon: 'brain' },
    { href: '/chat', label: 'Private Chat', icon: 'chat' },
    { href: '/positions', label: 'Wellness', icon: 'flower' },
    { href: '/interests', label: 'Interests', icon: 'search' },
    { href: '/appointments', label: 'Calendar', icon: 'calendar' },
  ];

  const secondaryNavItems: NavItem[] = [
    { href: '/admin', label: 'Settings', icon: 'settings' },
  ];

  const isActive = (href: string) => router.pathname === href;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-title">Luxe Wellness</div>
          <div className="brand-sub">Premium personal development</div>
        </div>

        <nav className="nav">
          <div className="nav-group">
            {mainNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
              >
                <Icon name={item.icon} size={20} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </a>
            ))}
          </div>

          <div className="nav-group">
            <div className="nav-group-label">Account</div>
            {secondaryNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
              >
                <Icon name={item.icon} size={20} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </a>
            ))}
          </div>
        </nav>
      </aside>

      <main className="content">
        {children}
      </main>

      {/* Floating AI Assistant - always available */}
      <FloatingAI />
    </div>
  );
}