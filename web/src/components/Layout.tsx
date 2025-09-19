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

// Modern SVG icons as components
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v6m0 12v6m11-7h-6m-12 0H1m15.5-6.5l-4.24 4.24m-8.48 0L2.76 5.76m0 12.48l4.24-4.24m8.48 0l4.24 4.24"/>
  </svg>
);

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  // Only show functional features with elegant icons
  const mainNavItems: NavItem[] = [
    { href: '/dashboard', label: 'Sanctuary', icon: 'home' },
    { href: '/ask-ai', label: 'Whispered Secrets', icon: 'heart' },
    { href: '/appointments', label: 'Sacred Moments', icon: 'calendar' },
  ];

  const secondaryNavItems: NavItem[] = [
    { href: '/admin', label: 'Preferences', icon: 'settings' },
  ];

  const renderIcon = (iconType: string) => {
    switch(iconType) {
      case 'home': return <HomeIcon />;
      case 'heart': return <HeartIcon />;
      case 'calendar': return <CalendarIcon />;
      case 'sparkle': return <SparkleIcon />;
      case 'moon': return <MoonIcon />;
      case 'settings': return <SettingsIcon />;
      default: return <SparkleIcon />;
    }
  };

  const isActive = (href: string) => router.pathname === href;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-title">Midnights Afterglow</div>
          <div className="brand-sub">Where dreams become whispered realities</div>
        </div>

        <nav className="nav">
          <div className="nav-group">
            <div className="nav-group-label">Your Sacred Spaces</div>
            {mainNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
              >
                <span className="nav-icon">{renderIcon(item.icon)}</span>
                <span className="nav-label">{item.label}</span>
              </a>
            ))}
          </div>

          <div className="nav-group">
            <div className="nav-group-label">Sanctuary Settings</div>
            {secondaryNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
              >
                <span className="nav-icon">{renderIcon(item.icon)}</span>
                <span className="nav-label">{item.label}</span>
              </a>
            ))}
          </div>
        </nav>

        <div className="coming-soon-note">
          <div className="coming-soon-title">✨ Enchantments Await</div>
          <div className="coming-soon-text">
            New intimate experiences are being lovingly crafted in the velvet darkness of creation.
          </div>
        </div>
      </aside>

      <main className="content">
        {children}
      </main>
    </div>
  );
}