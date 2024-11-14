import "./chat-modal.module.css";

export function Typing() {
  return (
    <div className="container">
      <div className="loading">
        <div className="loading__letter">.</div>
        <div className="loading__letter">.</div>
        <div className="loading__letter">.</div>
      </div>
    </div>
  );
}
