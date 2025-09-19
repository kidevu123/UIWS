export default function Page(){
  return (
    <div className="container">
      <div className="greeting">Stories & Creative Writing</div>
      <div className="card" style={{ marginTop: 12 }}>
        <p>Generate inspirational stories and creative content via AI, plus 'Read to me' with text-to-speech. (Connected to /api/stories & /api/tts)</p>
      </div>
    <div className="card" style={{marginTop:12}}><strong>Demo mode</strong><div className="sub">Set keys in <a href="/admin">Admin</a> for the full experience. Everything is private and safe here.</div></div>
      </div>
  );
}
