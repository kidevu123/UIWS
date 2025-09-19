export default function Page(){
  return (
    <div className="container">
      <div className="greeting">Private Chat</div>
      <div className="card" style={{ marginTop: 12 }}>
        <p>Chat is proxied under <a href="/chat" className="btn">/chat</a>. Use invite-only with two accounts.</p>
      </div>
    </div>
  );
}
