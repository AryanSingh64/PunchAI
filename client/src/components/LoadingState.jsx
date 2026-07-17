export default function LoadingState() {
  return (
    <div className="loading-wrap">
      <div className="spinner" />
      <p className="loading-text">Building your study deck…</p>
      <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: 6 }}>
        The AI is generating flashcards and quiz questions
      </p>
      <div className="skeleton-cards">
        <div className="skeleton tall" />
        <div className="skeleton" />
        <div className="skeleton short" />
      </div>
    </div>
  );
}
