import { Trophy, ArrowClockwise, House, Cards } from "@phosphor-icons/react";

function getEmoji(pct) {
  if (pct === 100) return "🏆";
  if (pct >= 80) return "🎉";
  if (pct >= 60) return "💪";
  if (pct >= 40) return "📚";
  return "🔄";
}

function getLabel(pct) {
  if (pct === 100) return "Perfect score! You're a genius.";
  if (pct >= 80) return "Great job! Almost there.";
  if (pct >= 60) return "Good progress. Keep going!";
  if (pct >= 40) return "Getting there — review and retry.";
  return "Time to hit the books again.";
}

export default function QuizResults({ score, total, wrongCount, onRetest, onReset, onFlashcards, isRetest }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="results-screen">
      <span className="results-emoji">{getEmoji(pct)}</span>
      <div className="results-score">{pct}%</div>
      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
        {score} / {total} correct
      </p>
      <p className="results-label">{getLabel(pct)}</p>

      <div className="results-actions">
        {wrongCount > 0 && !isRetest && (
          <button className="btn-primary" onClick={onRetest}>
            <ArrowClockwise size={16} weight="bold" />
            Retake {wrongCount} Wrong Answer{wrongCount !== 1 ? "s" : ""}
          </button>
        )}
        <button className="btn-secondary" onClick={onFlashcards} style={{ justifyContent: "center" }}>
          <Cards size={16} weight="duotone" />
          Back to Flashcards
        </button>
        <button className="btn-ghost" onClick={onReset} style={{ justifyContent: "center" }}>
          <House size={16} weight="duotone" />
          Start Over
        </button>
      </div>
    </div>
  );
}
