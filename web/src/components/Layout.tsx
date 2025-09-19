import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Icon from './Icon';

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
    { href: '/ask-ai', label: 'Ask Anything', icon: 'brain' },
    { href: '/chat', label: 'Private Chat', icon: 'chat' },
    { href: '/positions', label: 'Positions', icon: 'flower' },
    { href: '/kinks', label: 'Kink Explorer', icon: 'search' },
    { href: '/appointments', label: 'Appointments', icon: 'calendar' },
  ];

  const secondaryNavItems: NavItem[] = [
    { href: '/admin', label: 'Settings', icon: 'settings' },
  ];

  const isActive = (href: string) => router.pathname === href;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-title">Midnight Embrace</div>
          <div className="brand-sub">Where hearts meet in golden twilight</div>
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

        <div className="coming-soon-note">
          <div className="coming-soon-title">More magical features</div>
          <div className="coming-soon-text">
            New intimate experiences are being lovingly crafted for you both.
          </div>
        </div>
      </aside>

      <main className="content">
        {children}
      </main>
    </div>
  );
}