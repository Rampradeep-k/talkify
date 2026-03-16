import { useState } from "react";

export default function MessageBubble({ role, content, isLast, onRetry }) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSpeak = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(content);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  return (
    <>
      <style>{`
        .mb-row {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          animation: fadeUp 0.22s ease forwards;
        }
        .mb-row--user { flex-direction: row-reverse; }
        .mb-row--ai   { flex-direction: row; }

        .mb-av {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          flex-shrink: 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mb-av--ai {
          background: linear-gradient(135deg, #c026d3, #f472b6);
          font-size: 13px;
          color: #fff;
          box-shadow: 0 0 8px rgba(192,38,211,0.35);
        }
        .mb-av--user { background: #2a2a2e; }
        .mb-av--user img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          display: block;
        }

        .mb-bubble {
          max-width: min(72%, 620px);
          padding: 13px 17px;
          border-radius: 20px;
          font-size: 14.5px;
          font-weight: 500;
          line-height: 1.65;
          word-break: break-word;
        }
        .mb-bubble--user {
          background: linear-gradient(135deg, #c026d3 0%, #e879f9 45%, #f472b6 100%);
          color: #fff;
          border-bottom-right-radius: 4px;
        }
        .mb-bubble--ai {
          background: #22222c;
          color: #e8e8ec;
          border: 1px solid rgba(255,255,255,0.09);
          border-bottom-left-radius: 4px;
        }
        .mb-text { line-height: 1.65; color: inherit; }

        /* ── Action row ── */
        .mb-actions {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.08);
          flex-wrap: wrap;
        }
        .mb-action-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-family: 'Nunito', sans-serif;
          font-weight: 600;
          color: #666;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
        }
        .mb-action-btn:hover {
          color: #ddd;
          background: rgba(255,255,255,0.07);
        }
        .mb-action-btn.active {
          color: #e879f9;
          background: rgba(192,38,211,0.12);
        }
        .mb-action-btn.copied {
          color: #4ade80;
          background: rgba(74,222,128,0.1);
        }
        .mb-action-btn--right { margin-left: auto; }

        @media (max-width: 639px) {
          .mb-bubble { font-size: 14px; max-width: 82%; }
          .mb-av { width: 28px; height: 28px; }
        }
        @media (min-width: 1024px) {
          .mb-av { width: 34px; height: 34px; }
          .mb-bubble { font-size: 15px; }
        }
      `}</style>

      <div className={`mb-row ${isUser ? "mb-row--user" : "mb-row--ai"}`}>

        {/* AI avatar */}
        {!isUser && (
          <div className="mb-av mb-av--ai">✦</div>
        )}

        {/* Bubble */}
        <div className={`mb-bubble ${isUser ? "mb-bubble--user" : "mb-bubble--ai"}`}>
          <p className="mb-text">{content}</p>

          {/* Action row — AI messages only */}
          {!isUser && (
            <div className="mb-actions">

              {/* Copy */}
              <button
                className={`mb-action-btn ${copied ? "copied" : ""}`}
                onClick={handleCopy}
                title="Copy"
              >
                {copied ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    Copy
                  </>
                )}
              </button>

              {/* Speak */}
              <button
                className={`mb-action-btn ${speaking ? "active" : ""}`}
                onClick={handleSpeak}
                title={speaking ? "Stop speaking" : "Read aloud"}
              >
                {speaking ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                    Stop
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 010 7.07" />
                      <path d="M19.07 4.93a10 10 0 010 14.14" />
                    </svg>
                    Speak
                  </>
                )}
              </button>

              {/* Retry — rightmost, only on last AI message */}
              {isLast && onRetry && (
                <button
                  className="mb-action-btn mb-action-btn--right"
                  onClick={onRetry}
                  title="Retry"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                  </svg>
                  Retry
                </button>
              )}

            </div>
          )}
        </div>

        {/* User avatar */}
        {isUser && (
          <div className="mb-av mb-av--user">
            <img src="https://i.pravatar.cc/40?img=12" alt="You" />
          </div>
        )}

      </div>
    </>
  );
}