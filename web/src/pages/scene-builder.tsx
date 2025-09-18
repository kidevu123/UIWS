export default function Page(){
  return (
    <div className="container">
      <div className="greeting">Scene Builder</div>
      <div className="card" style={marginTop:12}>
        <p>Describe your mood and generate a scene using your local LLM. (wired to /api/scene)</p>
      </div>
    </div>
  );
}
