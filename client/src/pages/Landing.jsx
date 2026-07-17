import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Brain, Cards, ListChecks, Trophy, Sparkle, ArrowRight, ShieldCheck } from "@phosphor-icons/react";

/* ── Interactive Step Preview Component ── */
function StepPreview({ activeIndex }) {
  return (
    <div className="step-preview-panel">
      {/* Step 1: Input Preview */}
      <div className={`preview-layer ${activeIndex === 0 ? "visible" : "hidden"}`}>
        <div className="preview-topbar">
          <span className="preview-dot" style={{ background: "#FF5F56" }} />
          <span className="preview-dot" style={{ background: "#FFBD2E" }} />
          <span className="preview-dot" style={{ background: "#27C93F" }} />
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: 6 }}>notes.txt</span>
        </div>
        <div className="preview-textarea">
          Mitosis is a process of cell duplication, or reproduction, during which one cell gives rise to two genetically identical daughter cells. The phases are Prophase, Metaphase, Anaphase, and Telophase.
        </div>
        <button className="preview-btn" disabled>
          Generate Deck
        </button>
      </div>

      {/* Step 2: AI Generation / Loading Preview */}
      <div className={`preview-layer ${activeIndex === 1 ? "visible" : "hidden"}`} style={{ justifyContent: "center" }}>
        <div className="preview-loading-row">
          <span className="preview-spinner" />
          <span className="preview-loading-text">Gemini is structuring your cards...</span>
        </div>
        <div className="preview-card-skeleton" style={{ height: 48, width: "90%" }} />
        <div className="preview-card-skeleton" style={{ height: 48, width: "75%" }} />
        <div className="preview-card-skeleton" style={{ height: 48, width: "85%" }} />
      </div>

      {/* Step 3: Flashcard Mode Preview */}
      <div className={`preview-layer ${activeIndex === 2 ? "visible" : "hidden"}`}>
        <div className="preview-card">
          <div className="preview-card-label">Flashcard 2 of 8</div>
          <div className="preview-card-q">What happens during the Metaphase stage of Mitosis?</div>
          <div style={{ marginTop: 12, fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic" }}>
            Tap card to flip and reveal answer...
          </div>
        </div>
        <div className="preview-nav">
          <button className="preview-nav-btn" disabled>←</button>
          <button className="preview-nav-btn" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>✓</button>
          <button className="preview-nav-btn" disabled>→</button>
        </div>
      </div>

      {/* Step 4: Quiz Mode Preview */}
      <div className={`preview-layer ${activeIndex === 3 ? "visible" : "hidden"}`}>
        <div className="preview-quiz-q">
          <span style={{ color: "var(--accent)", marginRight: 6 }}>Q1.</span>
          Which phase involves chromosomes lining up in the center of the cell?
        </div>
        <div className="preview-option">A. Prophase</div>
        <div className="preview-option correct">
          <span>B. Metaphase</span>
          <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--success)" }}>Correct ✓</span>
        </div>
        <div className="preview-option">C. Anaphase</div>
        <div className="preview-option">D. Telophase</div>
      </div>
    </div>
  );
}

const STEPS = [
  {
    title: "Paste your notes",
    content: "Drop in anything — lecture slides, notes, or a complex scientific topic. StudyAI reads it instantly."
  },
  {
    title: "AI structures concepts",
    content: "Our system extracts core concepts and generates structured flashcards and quiz questions."
  },
  {
    title: "Study with active recall",
    content: "Flip cards and mark items as 'Got it' or 'Still learning' to focus on your weak points."
  },
  {
    title: "Retest your mistakes",
    content: "Take the multiple-choice quiz and instantly re-run the questions you missed until you get 100%."
  }
];

const TIMER_DURATION = 8000;

function AnimatedFeatures() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t + 10), 10);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer >= TIMER_DURATION) {
      setActiveIndex((i) => (i + 1) % STEPS.length);
      setTimer(0);
    }
  }, [timer]);

  function handleClick(index) {
    setActiveIndex(index);
    setTimer(0);
  }

  return (
    <section className="steps-section">
      <div style={{ marginBottom: 32 }}>
        <p className="section-eyebrow">Methodology</p>
        <h2 className="section-title">How it works</h2>
        <p className="section-sub" style={{ maxWidth: 440 }}>
          Four steps to convert raw notes into interactive, structured active recall decks.
        </p>
      </div>

      <div className="steps-grid">
        <div className="steps-list">
          {STEPS.map((step, i) => (
            <button
              key={step.title}
              className={`step-item ${activeIndex === i ? "active" : ""}`}
              onClick={() => handleClick(i)}
              type="button"
            >
              <div className="step-header">
                <span className="step-num">{i + 1}</span>
                <span className="step-title">{step.title}</span>
              </div>
              <div className="step-body">
                <p className="step-content">{step.content}</p>
                {activeIndex === i && (
                  <div className="step-bar">
                    <div className="step-bar-track">
                      <div
                        className="step-bar-fill"
                        style={{ width: `${(timer / TIMER_DURATION) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <StepPreview activeIndex={activeIndex} />
      </div>
    </section>
  );
}

/* ── Hero Interactive Demo Card ── */
function HeroDemoCard() {
  const [flipped, setFlipped] = useState(false);
  
  return (
    <div className="hero-demo" onClick={() => setFlipped(!flipped)} style={{ cursor: "pointer" }}>
      <div className="demo-topbar">
        <span className="demo-dot" style={{ background: "#FF5F56" }} />
        <span className="demo-dot" style={{ background: "#FFBD2E" }} />
        <span className="demo-dot" style={{ background: "#27C93F" }} />
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: 6 }}>Interactive Demo</span>
      </div>
      <div className="demo-card-area">
        <div className="demo-label">
          <Sparkle size={11} weight="duotone" />
          Active Recall Card
        </div>
        {flipped ? (
          <div className="demo-answer">
            <strong>Mitochondria.</strong> It generates most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy.
          </div>
        ) : (
          <div className="demo-answer-hidden">
            "What organelle is known as the powerhouse of the cell?"
          </div>
        )}
        <div className="demo-progress-row">
          <span className="demo-counter">1 of 10</span>
          <span className="demo-flip-hint" style={{ color: flipped ? "var(--text-muted)" : "var(--accent)", fontWeight: 500 }}>
            {flipped ? "Click to flip back" : "Click to reveal answer →"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <nav className="landing-nav" style={{ padding: "18px 48px" }}>
        <div className="landing-logo">
          Punch AI
        </div>
        <Link to="/app" className="btn-primary" style={{ padding: "9px 20px", fontSize: "0.85rem" }}>
          Open App <ArrowRight size={13} weight="bold" />
        </Link>
      </nav>

      {/* Hero */}
      <section className="hero-section" style={{ padding: "72px 48px 96px" }}>
        <div>
          <div className="hero-eyebrow">
            <span /> Free study assistant
          </div>
          <h1 className="hero-h1">
            Study smarter,<br />
            <em>not harder.</em>
          </h1>
          <p className="hero-sub">
            Paste notes or a topic. Our AI builds interactive flashcards and multiple-choice quizzes to help you learn faster.
          </p>
          
          <div className="hero-actions">
            <Link to="/app" className="btn-primary" style={{ fontSize: "0.9rem", padding: "12px 24px" }}>
              Start Studying Free
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              View on GitHub
            </a>
          </div>

          <div className="trust-badges">
            <span className="trust-badge">100% Free</span>
            <span className="trust-badge">No Sign-up</span>
            <span className="trust-badge">Gemini-Powered</span>
          </div>
        </div>

        {/* Hero Interactive Card */}
        <div>
          <HeroDemoCard />
        </div>
      </section>

      {/* Product Workspace Preview */}
      <section style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 48px 96px" }}>
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border-hover)",
          borderRadius: "var(--radius-xl)",
          padding: "8px",
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden"
        }}>
          <img
            src="/image.png"
            alt="Punch AI Workspace"
            style={{
              width: "100%",
              borderRadius: "var(--radius-lg)",
              display: "block",
              border: "1px solid var(--border)"
            }}
          />
        </div>
      </section>

      {/* Animated steps */}
      <AnimatedFeatures />

      {/* Feature grid */}
      <section className="features-section" style={{ paddingBottom: 96 }}>
        <div style={{ marginBottom: 32 }}>
          <p className="section-eyebrow">Features</p>
          <h2 className="section-title">Everything you need</h2>
        </div>
        
        <div className="features-grid">
          <div className="feature-card" style={{ borderLeft: "2px solid var(--accent)" }}>
            <div className="feature-icon">
              <Cards size={20} weight="duotone" color="var(--accent)" />
            </div>
            <p className="feature-title">3D Flashcards</p>
            <p className="feature-desc">Active recall cards that flip to show explanations and structured references.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Trophy size={20} weight="duotone" color="var(--accent)" />
            </div>
            <p className="feature-title">Retest System</p>
            <p className="feature-desc">Quiz mode automatically tracks wrong answers and lets you re-test just the missed questions.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <ShieldCheck size={20} weight="duotone" color="var(--accent)" />
            </div>
            <p className="feature-title">Local History</p>
            <p className="feature-desc">Sessions are saved directly in your browser. Access your generated decks anytime.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" style={{ paddingBottom: 96 }}>
        <div className="cta-card">
          <h3 className="cta-title">Ready to study smarter?</h3>
          <p className="cta-sub">Convert your lecture slides or notes into structured questions today.</p>
          <div className="cta-actions">
            <Link to="/app" className="btn-primary" style={{ padding: "12px 24px" }}>
              Open StudyAI
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-left">
          <div className="footer-name">
            Punch AI
          </div>
          <span className="footer-copy">© 2026. All rights reserved.</span>
        </div>
        <div className="footer-links">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="footer-link">GitHub</a>
          <span className="footer-divider">|</span>
          <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="footer-link">Gemini AI</a>
        </div>
      </footer>
    </div>
  );
}
