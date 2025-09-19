import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { useEffect, useState } from "react";
import { THEME_PACKS } from "@/lib/themes";

function applyTheme(themeKey: string){
  const pack = (THEME_PACKS as any)[themeKey] || (THEME_PACKS as any)["soft-blush"];
  const r = document.documentElement;
  r.style.setProperty("--bg", pack.vars.bg);
  r.style.setProperty("--card", pack.vars.card);
  r.style.setProperty("--ink", pack.vars.ink);
  r.style.setProperty("--accent", pack.vars.accent);
  r.style.setProperty("--accent-2", pack.vars.accent2);
  (document.body.style as any).fontFamily = pack.font;
}

export default function App({ Component, pageProps }: AppProps) {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(()=>{
    // Apply default theme immediately
    applyTheme("sultry-velvet");
    
    // Try to fetch settings but don't fail if backend is not available
    fetch("/api/settings")
      .then(r=>r.json())
      .then(s=>{
        setSettings(s || {});
        if(s?.theme) {
          applyTheme(s.theme);
        }
      })
      .catch(()=>{
        // Backend not available - use defaults
        setSettings({});
        console.warn("Backend not available - using default settings");
      })
      .finally(() => {
        setIsLoading(false);
      });
  },[]);

  // Don't render until we've tried to load settings
  if (isLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #141419 50%, #1a1a23 100%)',
        color: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid rgba(255,107,157,0.3)',
            borderRadius: '50%',
            borderTopColor: '#ff6b9d',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return <>
    {/* Seasonal/Anniversary banners */}
    {settings?.anniversary && new Date().toISOString().slice(5,10) === String(settings.anniversary).slice(5,10) && (
      <div style={{position:'fixed',top:10,left:'50%',transform:'translateX(-50%)',background:'rgba(255,107,157,0.2)',color:'white',padding:'8px 12px',borderRadius:12,zIndex:60, border: '1px solid rgba(255,107,157,0.4)'}}>Happy Anniversary! 💕</div>
    )}
    <Component {...pageProps} />
    
    <style jsx global>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </>;
}
