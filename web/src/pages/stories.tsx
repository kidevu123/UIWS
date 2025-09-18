export default function Page(){
  return (
    <div className="container">
      <div className="greeting">Stories & Erotica</div>
      <div className="card" style={marginTop:12}>
        <p>Pull or generate stories via local LLM, plus 'Read to me' with TTS. (wired to /api/stories & /api/tts)</p>
      </div>
    <div className="card" style={{marginTop:12}}><strong>Demo mode</strong><div className="sub">Set keys in <a href="/admin">Admin</a> for the full experience. Everything is private and safe here.</div></div>
      </div>
  );
}
