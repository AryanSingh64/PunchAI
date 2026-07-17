import { useState } from "react";
import { ArrowsCounterClockwise, CheckCircle, XCircle, ArrowLeft, ArrowRight } from "@phosphor-icons/react";

export default function Flashcard({ card, index, total, onKnown, onLearning, onNext, onPrev }) {
  const [flipped, setFlipped] = useState(false);

  function handleFlip() {
    setFlipped((f) => !f);
  }

  function handleKnown() {
    onKnown(card.id);
    setFlipped(false);
    onNext();
  }

  function handleLearning() {
    onLearning(card.id);
    setFlipped(false);
    onNext();
  }

  return (
    <div>
      {/* Progress */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Card {index + 1} of {total}
        </span>
        <div className="chip">
          <ArrowsCounterClockwise size={12} weight="bold" />
          Tap to flip
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-wrap" style={{ marginBottom: 24 }}>
        <div
          className="progress-bar-fill"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div className="card-scene" onClick={handleFlip}>
        <div className={`card-3d ${flipped ? "flipped" : ""}`}>
          <div className="card-face card-front">
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
              Question
            </div>
            <p className="card-question">{card.question}</p>
            <div className="card-hint">
              <ArrowsCounterClockwise size={12} weight="bold" />
              Tap anywhere to reveal answer
            </div>
          </div>

          <div className="card-face card-back">
            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16, opacity: 0.7 }}>
              Answer
            </div>
            <p className="card-answer">{card.answer}</p>
            {card.explanation && (
              <p className="card-explanation">{card.explanation}</p>
            )}
            <div className="card-hint">
              <ArrowsCounterClockwise size={12} weight="bold" />
              Tap to flip back
            </div>
          </div>
        </div>
      </div>

      {/* Mark buttons */}
      <div className="mark-btns">
        <button className="mark-btn still-learning" onClick={handleLearning}>
          <XCircle size={16} weight="fill" />
          Still learning
        </button>
        <button className="mark-btn got-it" onClick={handleKnown}>
          <CheckCircle size={16} weight="fill" />
          Got it!
        </button>
      </div>

      {/* Nav arrows */}
      <div className="card-nav">
        <button className="card-nav-btn" onClick={() => { setFlipped(false); onPrev(); }} disabled={index === 0} aria-label="Previous card">
          <ArrowLeft size={18} weight="bold" />
        </button>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", minWidth: 80, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
          {index + 1} / {total}
        </span>
        <button className="card-nav-btn" onClick={() => { setFlipped(false); onNext(); }} disabled={index === total - 1} aria-label="Next card">
          <ArrowRight size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
}
