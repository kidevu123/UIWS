import { useEffect, useState } from "react";

export default function AvatarGuide({ text }: { text: string }){
  const [speaking, setSpeaking] = useState(false);
  useEffect(()=>{
    if('speechSynthesis' in window){
      const u = new SpeechSynthesisUtterance(text);
      setSpeaking(true);
      u.onend = ()=> setSpeaking(false);
      window.speechSynthesis.speak(u);
    }
  }, [text]);

  return (
    <div style={{position:"fixed", right:16, bottom:16, zIndex: 50}}>
      <div style={{width:64, height:64, borderRadius:32, boxShadow:"var(--shadow)", background:"linear-gradient(180deg,var(--accent),var(--accent-2))", display:"grid", placeItems:"center", animation: speaking ? "pulse 1.2s infinite" : "none"}}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
          <circle cx="12" cy="8" r="4"/><path d="M4 20c2-4 14-4 16 0" stroke="white" strokeWidth="2" fill="none"/>
        </svg>
      </div>
      <style jsx>{`
        @keyframes pulse { 0%{transform:scale(1)} 50%{transform:scale(1.05)} 100%{transform:scale(1)} }
      `}</style>
    </div>
  );
}
