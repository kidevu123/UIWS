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
  useEffect(()=>{
    fetch("/api/settings").then(r=>r.json()).then(s=>{
      setSettings(s || {});
      applyTheme("midnights");
    });
  },[]);

  return <>
    
    {/* Seasonal/Anniversary banners */}
    {settings?.anniversary && new Date().toISOString().slice(5,10) === String(settings.anniversary).slice(5,10) && (
      <div style={{position:'fixed',top:10,left:'50%',transform:'translateX(-50%)',background:'#00000055',color:'white',padding:'8px 12px',borderRadius:12,zIndex:60}}>Happy Anniversary, loves! 🥂</div>
    )}
    <Component {...pageProps} />
  </>;

}
