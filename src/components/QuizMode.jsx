import { useState, useCallback } from "react";
import { CheckCircle, XCircle } from "@phosphor-icons/react";

const LETTERS = ["A", "B", "C", "D"];

export default function QuizMode({ question, index, total, score, answered, onAnswer, onNext, isLast, onFinish }) {
  const selectedAnswer = answered[question.id];
  const hasAnswered = selectedAnswer !== undefined;

  function handleSelect(optionIndex) {
    if (hasAnswered) return;
    onAnswer(question.id, optionIndex, question.correct);
  }

  function getOptionState(i) {
    if (!hasAnswered) return "";
    if (i === question.correct) return "correct";
    if (i === selectedAnswer && selectedAnswer !== question.correct) return "wrong";
    return "revealed";
  }

  return (
    <div>
      {/* Score bar */}
      <div className="score-bar">
        <span style={{ fontSize: "0.85rem", fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", color: "var(--text-muted)" }}>
          Question {index + 1} of {total}
        </span>
        <span className="score-badge">Score: {score}/{total}</span>
      </div>

      {/* Progress */}
      <div className="progress-bar-wrap" style={{ marginBottom: 28 }}>
        <div className="progress-bar-fill" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      {/* Question */}
      <p className="quiz-question-text">{question.question}</p>

      {/* Options */}
      <div className="quiz-options">
        {question.options.map((opt, i) => {
          const state = getOptionState(i);
          return (
            <button
              key={i}
              className={`quiz-option ${state}`}
              onClick={() => handleSelect(i)}
              disabled={hasAnswered}
            >
              <span className="option-letter">{LETTERS[i]}</span>
              <span style={{ flex: 1 }}>{opt}</span>
              {hasAnswered && i === question.correct && (
                <CheckCircle size={18} weight="fill" color="var(--success)" />
              )}
              {hasAnswered && i === selectedAnswer && selectedAnswer !== question.correct && (
                <XCircle size={18} weight="fill" color="var(--danger)" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {hasAnswered && question.explanation && (
        <div className="quiz-explanation">
          💡 {question.explanation}
        </div>
      )}

      {/* Next / Finish */}
      {hasAnswered && (
        <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
          {isLast ? (
            <button className="btn-primary" onClick={onFinish}>
              See Results →
            </button>
          ) : (
            <button className="btn-primary" onClick={onNext}>
              Next Question →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
