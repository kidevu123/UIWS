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
      <div className="card">
        <div className="header">
          <div>
            <div className="greeting">Ultimate Intimacy World</div>
            <div className="sub">A warm, private sanctuary built for two</div>
          </div>
        </div>
        <form onSubmit={submit} className="grid" style={{marginTop:12}}>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="btn" type="submit">Sign in</button>
          {err && <div style={{color:"crimson"}}>{err}</div>}
        </form>
      </div>
    </div>
  );
}
