import { useState } from "react";

export default function Home(){
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e:any)=>{
    e.preventDefault();
    setErr(null);
    setLoading(true);
    
    try {
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
    } catch (error) {
      setErr("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <div className="header">
          <div>
            <div className="greeting">Welcome Back</div>
            <div className="sub">Your personal wellness journey awaits</div>
          </div>
        </div>
        <form onSubmit={submit} className="grid" style={{marginTop:0}}>
          <input 
            placeholder="Email address" 
            type="email"
            value={email} 
            onChange={e=>setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input 
            placeholder="Password" 
            type="password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button 
            className="btn btn-large" 
            type="submit"
            disabled={loading}
            style={{marginTop: '8px'}}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          {err && (
            <div style={{
              color: "var(--accent)", 
              fontSize: "14px", 
              textAlign: "center",
              padding: "12px",
              background: "rgba(255,107,157,0.1)",
              borderRadius: "12px",
              border: "1px solid rgba(255,107,157,0.2)"
            }}>
              {err}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
