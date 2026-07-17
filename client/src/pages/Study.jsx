import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Cards, ListChecks, House,
  ClockCounterClockwise, ArrowLeft,
} from "@phosphor-icons/react";
import { useAI } from "../hooks/useAI";
import { useSession } from "../hooks/useSession";
import { useHistory } from "../hooks/useHistory";
import InputPanel from "../components/InputPanel";
import Flashcard from "../components/Flashcard";
import QuizMode from "../components/QuizMode";
import QuizResults from "../components/QuizResults";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import HistoryPanel from "../components/HistoryPanel";

export default function Study() {
  const { status, error, rawError, generate, reset: resetAI } = useAI();
  const {
    state, currentCards, currentQuiz,
    loadSession, setView, nextCard, prevCard,
    markKnown, markLearning,
    answerQuestion, nextQuestion, finishQuiz,
    startRetest, reset: resetSession,
  } = useSession();
  const { history, saveSession, removeSession, clearAll } = useHistory();

  const [historyOpen, setHistoryOpen] = useState(false);
  const { view, currentIndex, score, answered, wrong, isRetest, topic, retestIds } = state;

  function handleGenerate(text, mode) {
    generate(text, mode, (data) => {
      loadSession(data);
      saveSession(data); // persist to localStorage
    });
  }

  function handleLoadHistory(data) {
    resetAI();
    loadSession(data);
  }

  function handleReset() {
    resetAI();
    resetSession();
  }

  // Centered onboarding layout (for input, loading, and error states)
  const isOnboarding = view === "input" || status === "loading" || status === "error";

  if (isOnboarding) {
    return (
      <div style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
        position: "relative"
      }}>
        {/* Onboarding Nav matching bot aesthetic */}
        <nav className="onboarding-nav">
          <div className="landing-logo">
            <img src="/pig_logo.png" alt="Punch AI" className="pig-logo" />
            Punch AI
          </div>
          <button
            className="btn-secondary"
            style={{ padding: "6px 14px", fontSize: "0.78rem", borderRadius: "var(--radius-md)" }}
            onClick={() => setHistoryOpen(true)}
          >
            History
          </button>
        </nav>

        {/* History Panel (can drawer-in over the centered onboarding prompt) */}
        <HistoryPanel
          open={historyOpen}
          onClose={() => setHistoryOpen(false)}
          history={history}
          onLoad={handleLoadHistory}
          onDelete={removeSession}
          onClearAll={clearAll}
          noSidebar={true}
        />

        <div style={{ width: "100%", maxWidth: "500px" }}>
          {status === "idle" && view === "input" && (
            <InputPanel
              onGenerate={handleGenerate}
              isLoading={false}
              onOpenHistory={() => setHistoryOpen(true)}
            />
          )}

          {status === "loading" && <LoadingState />}

          {status === "error" && (
            <ErrorState message={error} raw={rawError} onRetry={handleReset} />
          )}
        </div>
      </div>
    );
  }

  // Study workspace layout (for active study session)
  return (
    <div className="app-layout">
      {/* History Panel */}
      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onLoad={handleLoadHistory}
        onDelete={removeSession}
        onClearAll={clearAll}
        noSidebar={false}
      />

      {/* Sidebar */}
      <aside className="sidebar">
        <Link to="/" className="sidebar-logo" title="Home">
          <img src="/pig_logo.png" alt="Punch AI" className="pig-logo" />
        </Link>

        <button
          className={`sidebar-btn ${view === "flashcard" ? "active" : ""}`}
          onClick={() => state.cards.length && setView("flashcard")}
          title="Flashcards"
          disabled={!state.cards.length}
        >
          <Cards size={19} weight="duotone" />
        </button>

        <button
          className={`sidebar-btn ${view === "quiz" ? "active" : ""}`}
          onClick={() => state.quiz.length && setView("quiz")}
          title="Quiz"
          disabled={!state.quiz.length}
        >
          <ListChecks size={19} weight="duotone" />
        </button>

        <div className="sidebar-bottom">
          <button
            className={`sidebar-btn ${historyOpen ? "accent-active" : ""}`}
            onClick={() => setHistoryOpen((o) => !o)}
            title="Session History"
          >
            <ClockCounterClockwise size={19} weight="duotone" />
          </button>
          <Link to="/" className="sidebar-btn" title="Home">
            <House size={19} weight="duotone" />
          </Link>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="main-content">
        {/* Header */}
        <div className="app-header">
          <div>
            {topic && (
              <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 2, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Studying
              </p>
            )}
            <h2 className="app-header-title">{topic || "Punch AI"}</h2>
          </div>

          <div className="header-actions">
            {state.cards.length > 0 && view !== "results" && (
              <div className="view-toggle">
                <button
                  className={`view-toggle-btn ${view === "flashcard" ? "active" : ""}`}
                  onClick={() => setView("flashcard")}
                >
                  <Cards size={12} weight="duotone" /> Cards
                </button>
                <button
                  className={`view-toggle-btn ${view === "quiz" ? "active" : ""}`}
                  onClick={() => setView("quiz")}
                >
                  <ListChecks size={12} weight="duotone" /> Quiz
                </button>
              </div>
            )}
            {state.cards.length > 0 && (
              <button className="btn-ghost" onClick={handleReset} style={{ fontSize: "0.8rem" }}>
                <ArrowLeft size={13} weight="bold" /> New deck
              </button>
            )}
          </div>
        </div>

        {/* Content Card container */}
        <div className="glass-card noise-card" style={{ padding: "32px", maxWidth: 680, margin: "0 auto" }}>
          {/* Flashcards */}
          {view === "flashcard" && currentCards.length > 0 && (
            <Flashcard
              card={currentCards[currentIndex]}
              index={currentIndex}
              total={currentCards.length}
              onKnown={markKnown}
              onLearning={markLearning}
              onNext={nextCard}
              onPrev={prevCard}
            />
          )}

          {/* Quiz */}
          {view === "quiz" && currentQuiz.length > 0 && (
            <QuizMode
              question={currentQuiz[currentIndex]}
              index={currentIndex}
              total={currentQuiz.length}
              score={score}
              answered={answered}
              onAnswer={answerQuestion}
              onNext={nextQuestion}
              isLast={currentIndex === currentQuiz.length - 1}
              onFinish={finishQuiz}
            />
          )}

          {/* Results */}
          {view === "results" && (
            <QuizResults
              score={score}
              total={isRetest ? retestIds.length : currentQuiz.length}
              wrongCount={wrong.size}
              onRetest={startRetest}
              onReset={handleReset}
              onFlashcards={() => setView("flashcard")}
              isRetest={isRetest}
            />
          )}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav">
        <Link to="/" className="mobile-nav-btn">
          <House size={20} weight="duotone" />
          Home
        </Link>
        <button
          className={`mobile-nav-btn ${view === "flashcard" ? "active" : ""}`}
          onClick={() => state.cards.length && setView("flashcard")}
        >
          <Cards size={20} weight="duotone" />
          Cards
        </button>
        <button
          className={`mobile-nav-btn ${view === "quiz" ? "active" : ""}`}
          onClick={() => state.quiz.length && setView("quiz")}
        >
          <ListChecks size={20} weight="duotone" />
          Quiz
        </button>
        <button
          className={`mobile-nav-btn ${historyOpen ? "active" : ""}`}
          onClick={() => setHistoryOpen((o) => !o)}
        >
          <ClockCounterClockwise size={20} weight="duotone" />
          History
        </button>
      </nav>
    </div>
  );
}
