export default function Page(){
  return (
    <div className="container">
      <div className="greeting">Media Gallery</div>
      <div className="card" style={{ marginTop: 12 }}>
        <p>Upload, browse, and tap‑to‑reveal. (wired to S3/MinIO via /api/media)</p>
      </div>
    <div className="card" style={{marginTop:12}}><strong>Demo mode</strong><div className="sub">Set keys in <a href="/admin">Admin</a> for the full experience. Everything is private and safe here.</div></div>
      </div>
  );
}
