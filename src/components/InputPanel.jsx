import { useState } from "react";
import { Paperclip, Globe, Sliders, Folder, PaperPlaneRight } from "@phosphor-icons/react";

const MODES = [
  { id: "quick", label: "Quick (6 cards)", desc: "Fast review" },
  { id: "deep", label: "Deep (10 cards)", desc: "Thorough study" },
  { id: "exam", label: "Exam (15 cards)", desc: "Intensive test" },
];

export default function InputPanel({ onGenerate, isLoading, onOpenHistory }) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("deep");
  const [showSettings, setShowSettings] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onGenerate(text, mode);
  }

  const isReady = text.trim().length >= 5 && !isLoading;

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isReady && !isLoading) {
        onGenerate(text, mode);
      }
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center" }}>
      <form onSubmit={handleSubmit} className="prompt-box">
        {/* Input Textarea */}
        <textarea
          className="prompt-textarea"
          placeholder="What do you want to study? Paste your notes or type a topic here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={3}
        />

        {/* Settings Toggle Drawer */}
        {showSettings && (
          <div className="prompt-settings">
            {/* Study Mode selector */}
            <div className="prompt-settings-section">
              <span className="prompt-settings-label">Study Mode</span>
              <div className="prompt-mode-select" style={{ marginTop: 2 }}>
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`prompt-mode-btn ${mode === m.id ? "active" : ""}`}
                    onClick={() => setMode(m.id)}
                    disabled={isLoading}
                    title={m.desc}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="prompt-toolbar">
          <div className="prompt-actions-left">
            <button
              type="button"
              className="prompt-action-btn"
              title="Upload file (Text)"
              onClick={() => alert("Paste your notes directly in the box to begin studying!")}
            >
              <Paperclip size={18} />
            </button>
            <button
              type="button"
              className="prompt-action-btn"
              title="Include web search references"
            >
              <Globe size={18} />
            </button>
            <button
              type="button"
              className={`prompt-action-btn ${showSettings ? "active" : ""}`}
              onClick={() => setShowSettings(!showSettings)}
              title="Adjust study mode"
            >
              <Sliders size={18} />
            </button>
            <button
              type="button"
              className="prompt-action-btn"
              onClick={onOpenHistory}
              title="Session History"
            >
              <Folder size={18} />
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            className="prompt-send-btn"
            disabled={!isReady || isLoading}
            title="Generate Study Deck"
          >
            {isLoading ? (
              <span className="spinner" style={{ width: 14, height: 14, borderWidth: 1.5, borderColor: "#fff", borderTopColor: "transparent" }} />
            ) : (
              <PaperPlaneRight size={16} weight="bold" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
