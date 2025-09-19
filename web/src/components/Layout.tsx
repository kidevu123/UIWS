import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon?: string;
  isActive?: boolean;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  // Only show functional features - remove all placeholders
  const mainNavItems: NavItem[] = [
    { href: '/dashboard', label: 'Home', icon: '🏠' },
    { href: '/ask-ai', label: 'Ask Anything', icon: '💭' },
    { href: '/chat', label: 'Private Chat', icon: '💬' },
    { href: '/positions', label: 'Positions', icon: '🌸' },
    { href: '/kinks', label: 'Kink Explorer', icon: '🔍' },
    { href: '/appointments', label: 'Appointments', icon: '📅' },
  ];

  const secondaryNavItems: NavItem[] = [
    { href: '/admin', label: 'Settings', icon: '⚙️' },
  ];

  const isActive = (href: string) => router.pathname === href;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-title">Intimate Sanctuary</div>
          <div className="brand-sub">Private space for two hearts</div>
        </div>

        <nav className="nav">
          <div className="nav-group">
            {mainNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
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
                <span className="nav-icon">{item.icon}</span>
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