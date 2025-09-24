import React, { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Heart, Lock, Calendar, MessageSquare, Sparkles, User, Book, Gamepad2, Bot, Settings, LogOut } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: any;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [brandName, setBrandName] = useState('Our Private Space');

  useEffect(() => {
    // Load brand name from settings
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

  const navigation: NavItem[] = [
    { id: 'dashboard', href: '/dashboard', label: 'Home', icon: Heart },
    { id: 'appointments', href: '/appointments', label: 'Appointments', icon: Calendar },
    { id: 'chat', href: '/chat', label: 'Private Chat', icon: MessageSquare },
    { id: 'fantasy', href: '/fantasy-journal', label: 'Fantasy Space', icon: Sparkles },
    { id: 'scenes', href: '/scene-builder', label: 'Scene Builder', icon: User },
    { id: 'positions', href: '/positions', label: 'Intimacy Guide', icon: Heart },
    { id: 'stories', href: '/stories', label: 'Story Library', icon: Book },
    { id: 'toys', href: '/toys', label: 'Toy Control', icon: Gamepad2 },
    { id: 'ai', href: '/ask-ai', label: 'AI Companion', icon: Bot },
    { id: 'profile', href: '/admin', label: 'Profile', icon: Settings },
  ];

  const isActive = (href: string) => router.pathname === href;

  const handleSignOut = () => {
    // Clear auth cookie and redirect to login
    document.cookie = 'uiw_jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-rose-500" />
              <span className="text-2xl font-serif text-gray-800">{brandName}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-rose-400" />
                <span className="text-sm text-gray-600">Secure & Private</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 text-gray-600 hover:text-rose-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/60 backdrop-blur-sm border-r border-rose-200 min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-rose-100 text-rose-700 shadow-sm'
                        : 'text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}