import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Heart, Calendar, MessageSquare, Sparkles, User, Book, Gamepad2, Bot } from 'lucide-react';

export default function Dashboard(){
  const [ob,setOb] = useState<any>(null);
  useEffect(()=>{ 
    fetch('/api/onboarding/state').then(r=>r.json()).then(s=>{ 
      if(!s?.completed){ 
        location.href='/onboarding'; 
      } else { 
        setOb(s);
      } 
    });
    // First-login welcome
    if(!localStorage.getItem('uiw_welcome_done')){ 
      location.href='/welcome'; 
    }
  },[]);

  const [me,setMe] = useState<any>(null);

  useEffect(()=>{
    fetch("/api/me").then(r=>r.json()).then(setMe).catch(()=>{});
  },[]);

  const quickActions = [
    { id: 'chat', name: 'Send Message', href: '/chat', icon: MessageSquare, color: 'from-rose-400 to-pink-400' },
    { id: 'appointments', name: 'Book Time', href: '/appointments', icon: Calendar, color: 'from-purple-400 to-indigo-400' },
    { id: 'fantasy', name: 'Share Fantasy', href: '/fantasy-journal', icon: Sparkles, color: 'from-amber-400 to-orange-400' },
    { id: 'ai', name: 'Ask AI', href: '/ask-ai', icon: Bot, color: 'from-emerald-400 to-teal-400' },
  ];

  const features = [
    { id: 'scenes', name: 'Scene Builder', href: '/scene-builder', icon: User, description: 'Build intimate scenarios based on mood' },
    { id: 'positions', name: 'Intimacy Guide', href: '/positions', icon: Heart, description: 'Explore new ways to connect' },
    { id: 'stories', name: 'Story Library', href: '/stories', icon: Book, description: 'Curated intimate stories' },
    { id: 'toys', name: 'Toy Control', href: '/toys', icon: Gamepad2, description: 'Remote toy integration' },
  ];

  const userRole = me?.role || 'partner1';

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-rose-200">
          <div className="text-center">
            <Heart className="h-12 w-12 text-rose-500 mx-auto mb-4" />
            <h1 className="text-3xl font-serif text-gray-800 mb-2">
              Welcome to Your Private Space
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              This is your intimate, secure space to connect, explore, and share together. 
              Everything here is private, safe, and just for the two of you.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.id}
                href={action.href}
                className="group relative overflow-hidden bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-rose-200 hover:shadow-xl transition-all duration-300 hover:scale-105 block text-center"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <Icon className="h-8 w-8 text-gray-600 group-hover:text-rose-600 transition-colors mb-3 mx-auto" />
                <h3 className="font-medium text-gray-800 group-hover:text-gray-900">{action.name}</h3>
              </a>
            );
          })}
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <a
                key={feature.id}
                href={feature.href}
                className="group text-left bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-rose-200 hover:shadow-xl transition-all duration-300 hover:scale-102 block"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-rose-100 rounded-xl p-3 group-hover:bg-rose-200 transition-colors">
                    <Icon className="h-6 w-6 text-rose-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-rose-700 transition-colors">
                      {feature.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-rose-200">
            <h3 className="font-semibold text-gray-800 mb-2">Connection Status</h3>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">Secure & Connected</span>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-rose-200">
            <h3 className="font-semibold text-gray-800 mb-2">Your Role</h3>
            <p className="text-sm text-gray-600 capitalize">{userRole.replace('partner', 'Partner ')}</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-rose-200">
            <h3 className="font-semibold text-gray-800 mb-2">Privacy</h3>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-blue-400 rounded-full" />
              <span className="text-sm text-gray-600">Fully Private</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}