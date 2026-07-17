import { BookOpen, Trash, X, ClockCounterClockwise } from "@phosphor-icons/react";

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD < 7) return `${diffD}d ago`;
  return d.toLocaleDateString();
}

export default function HistoryPanel({ open, onClose, history, onLoad, onDelete, onClearAll, noSidebar }) {
  return (
    <div className={`history-panel ${open ? "open" : ""} ${noSidebar ? "no-sidebar" : ""}`}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 8 }}>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
          History
        </p>
        <div style={{ display: "flex", gap: 4 }}>
          {history.length > 0 && (
            <button className="btn-ghost" onClick={onClearAll} style={{ fontSize: "0.72rem", padding: "4px 8px", color: "var(--danger)" }}>
              Clear all
            </button>
          )}
          <button className="btn-icon" onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8 }}>
            <X size={14} weight="bold" color="var(--text-muted)" />
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <ClockCounterClockwise size={32} weight="duotone" color="var(--text-muted)" style={{ margin: "0 auto 10px" }} />
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            No sessions yet.<br />Generate a deck to get started.
          </p>
        </div>
      ) : (
        history.map((session) => (
          <div key={session.id} className="history-item" onClick={() => { onLoad(session.data); onClose(); }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="history-item-title">{session.topic}</p>
                <p className="history-item-meta">
                  {session.cardCount} cards · {formatDate(session.createdAt)}
                </p>
              </div>
              <button
                className="history-item-delete"
                onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
                title="Delete"
              >
                <Trash size={13} weight="bold" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
