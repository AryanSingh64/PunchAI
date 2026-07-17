import { WarningCircle, ArrowClockwise } from "@phosphor-icons/react";

export default function ErrorState({ message, raw, onRetry }) {
  return (
    <div className="error-card">
      <WarningCircle size={36} weight="duotone" color="var(--danger)" />
      <p className="error-title">Something went wrong</p>
      <p className="error-message">{message}</p>
      {raw && (
        <div className="error-raw">
          <strong>Raw response:</strong>
          <br />
          {raw}
        </div>
      )}
      <button className="btn-primary" onClick={onRetry} style={{ margin: "0 auto" }}>
        <ArrowClockwise size={16} weight="bold" />
        Try Again
      </button>
    </div>
  );
}
