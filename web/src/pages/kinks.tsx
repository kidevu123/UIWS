export default function Page(){
  return (
    <div className="container">
      <div className="greeting">Kinks Explorer</div>
      <div className="card" style={{ marginTop: 12 }}>
        <p>Browse tags and take a consent‑first quiz. (wired to /api/kinks)</p>
      </div>
    <div className="card" style={{marginTop:12}}><strong>Demo mode</strong><div className="sub">Set keys in <a href="/admin">Admin</a> for the full experience. Everything is private and safe here.</div></div>
      </div>
  );
}
