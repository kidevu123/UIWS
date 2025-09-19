import { useState } from "react";

export default function Home(){
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState<string | null>(null);

  const submit = async (e:any)=>{
    e.preventDefault();
    setErr(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({email, password})
    });
    if(res.ok){
      location.href = "/dashboard";
    } else {
      const j = await res.json().catch(()=>({message:"Login failed"}));
      setErr(j.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <div className="login-header">
          <div className="greeting">Midnights Afterglow</div>
          <div className="sub">Where private passions dance in the hour of wildest dreams</div>
          <div className="sub">✨ Step into your intimate sanctuary ✨</div>
        </div>
        
        {/* Star motifs */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '30px',
          fontSize: '24px',
          opacity: 0.6,
          animation: 'twinkle 3s ease-in-out infinite'
        }}>
          ✨
        </div>
        <div style={{
          position: 'absolute',
          top: '60px',
          left: '40px',
          fontSize: '18px',
          opacity: 0.4,
          animation: 'twinkle 4s ease-in-out infinite 1s'
        }}>
          🌙
        </div>
        <div style={{
          position: 'absolute',
          bottom: '40px',
          right: '50px',
          fontSize: '16px',
          opacity: 0.5,
          animation: 'twinkle 2.5s ease-in-out infinite 0.5s'
        }}>
          ⭐
        </div>
        
        <form onSubmit={submit} className="login-form">
          <input 
            placeholder="✉️  Your email, beautiful" 
            value={email} 
            onChange={e=>setEmail(e.target.value)}
            type="email"
          />
          <input 
            placeholder="🔐  Your secret whisper" 
            type="password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
          />
          <button className="login-btn" type="submit">
            Enter Your Sanctuary
          </button>
          {err && (
            <div style={{
              color: "var(--rose)", 
              textAlign: 'center', 
              fontSize: '14px',
              padding: '8px',
              background: 'rgba(255,20,147,0.1)',
              border: '1px solid rgba(255,20,147,0.2)',
              borderRadius: '12px'
            }}>
              {err}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
