import { useEffect, useRef } from "react";
import { useChat } from "../hooks/UseChat.js";
import MessageBubble from "./MessageBubble.jsx";
import InputBar from "./InputBar.jsx";

/* ── Typing indicator ─────────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="msg-row msg-row--ai">
      <div className="av av--ai">✦</div>
      <div className="bubble bubble--ai bubble--typing">
        {[0, 1, 2].map((i) => (
          <span key={i} className="dot" style={{ animationDelay: `${i * 0.18}s` }} />
        ))}
      </div>
    </div>
  );
}

/* ── Empty state ──────────────────────────────────────────────────── */
function EmptyState({ onSuggestion }) {
  const chips = [
    "Explain quantum computing",
    "Write a short poem",
    "Debug my code",
    "Summarize a topic",
  ];
  return (
    <div className="empty-state">
      <div className="empty-logo">✦</div>
      <h2 className="empty-title">Talkify</h2>
      <p className="empty-sub">Ask me anything to get started</p>
      <div className="chip-row">
        {chips.map((c) => (
          <button key={c} className="chip" onClick={() => onSuggestion(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Main ChatWindow ──────────────────────────────────────────────── */
export default function ChatWindow() {
  const { messages, loading, error, sendMessage, clearChat } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Retry: re-send the last user message
  const handleRetry = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) sendMessage(lastUserMsg.content);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body, #root {
          height: 100%;
          width: 100%;
          background: #111114;
          overflow: hidden;
        }

        /* ── Full-screen page — uses 100dvh so mobile browser chrome is excluded ── */
        .chat-page {
          display: flex;
          height: 100dvh;
          width: 100%;
          background: #111114;
          font-family: 'Nunito', sans-serif;
          color: #f0f0f0;
          overflow: hidden;
        }

        /* ── Sidebar ── */
        .sidebar {
          display: none;
          flex-direction: column;
          width: 240px;
          min-width: 240px;
          height: 100%;
          background: #0e0e11;
          border-right: 1px solid rgba(255,255,255,0.07);
          padding: 18px 12px;
          gap: 4px;
          overflow-y: auto;
          flex-shrink: 0;
        }
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 6px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          margin-bottom: 10px;
          flex-shrink: 0;
        }
        .sidebar-logo-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, #c026d3, #f472b6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          color: #fff;
          box-shadow: 0 0 12px rgba(192,38,211,0.4);
          flex-shrink: 0;
        }
        .sidebar-logo-text { font-size: 14px; font-weight: 700; color: #fff; line-height: 1.2; }
        .sidebar-logo-sub  { font-size: 10px; color: #666; margin-top: 1px; }
        .new-chat-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 9px 12px;
          border-radius: 10px;
          background: linear-gradient(135deg, #c026d3, #f472b6);
          border: none;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          margin-bottom: 10px;
          box-shadow: 0 0 14px rgba(192,38,211,0.35);
          transition: opacity 0.15s, transform 0.15s;
          flex-shrink: 0;
        }
        .new-chat-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .sidebar-section {
          font-size: 10px;
          color: #555;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 8px 8px 4px;
          flex-shrink: 0;
        }
        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 8px;
          color: #888;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: 'Nunito', sans-serif;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex-shrink: 0;
        }
        .sidebar-item:hover  { background: rgba(255,255,255,0.05); color: #ddd; }
        .sidebar-item.active { background: rgba(192,38,211,0.15); color: #e879f9; }
        .sidebar-item-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: linear-gradient(135deg, #c026d3, #f472b6);
          flex-shrink: 0;
        }

        /* ── Main chat column ── */
        .chat-main {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
          min-height: 0;
          height: 100%;
          background: #111114;
          overflow: hidden;
        }

        /* ── Header ── */
        .chat-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          height: 58px;
          min-height: 58px;
          background: #111114;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
        }
        .header-back {
          background: none; border: none; color: #aaa;
          font-size: 24px; cursor: pointer;
          padding: 4px 6px 4px 0; flex-shrink: 0; line-height: 1;
        }
        .header-back:hover { color: #fff; }
        .header-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #c026d3, #f472b6);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; flex-shrink: 0;
          box-shadow: 0 0 14px rgba(192,38,211,0.45);
        }
        .header-info { flex: 1; min-width: 0; }
        .header-name {
          font-size: 15px; font-weight: 700; color: #fff;
          line-height: 1.2; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
        }
        .header-sub { font-size: 11px; color: #888; line-height: 1.3; }
        .header-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
        .header-new-chat-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 6px 11px; border-radius: 20px;
          background: linear-gradient(135deg, #c026d3, #f472b6);
          border: none; color: #fff;
          font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 700;
          cursor: pointer; box-shadow: 0 0 10px rgba(192,38,211,0.4);
          transition: opacity 0.15s; flex-shrink: 0; white-space: nowrap;
        }
        .header-new-chat-btn:hover { opacity: 0.88; }
        .header-icon-btn {
          background: none; border: none; color: #777; cursor: pointer;
          padding: 7px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.15s, background 0.15s;
        }
        .header-icon-btn:hover { color: #ddd; background: rgba(255,255,255,0.07); }

        /* ── Messages scroll ── */
        .messages-scroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .messages-scroll::-webkit-scrollbar { width: 4px; }
        .messages-scroll::-webkit-scrollbar-track { background: transparent; }
        .messages-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1); border-radius: 4px;
        }
        .messages-inner {
          width: 100%;
          max-width: 820px;
          margin: 0 auto;
          padding: 16px 14px 10px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }
        .date-divider {
          text-align: center; font-size: 11px; color: #555;
          padding: 2px 0 6px; letter-spacing: 0.04em;
        }

        /* ── Typing indicator ── */
        .msg-row {
          display: flex; align-items: flex-end; gap: 10px;
          animation: fadeUp 0.22s ease forwards;
        }
        .msg-row--user { flex-direction: row-reverse; }
        .msg-row--ai   { flex-direction: row; }
        .av {
          width: 32px; height: 32px; border-radius: 50%;
          flex-shrink: 0; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .av--ai {
          background: linear-gradient(135deg, #c026d3, #f472b6);
          font-size: 13px; color: #fff;
          box-shadow: 0 0 8px rgba(192,38,211,0.35);
        }
        .bubble {
          max-width: min(72%, 620px); padding: 13px 17px;
          border-radius: 20px; font-size: 14.5px;
          font-weight: 500; line-height: 1.65; word-break: break-word;
        }
        .bubble--ai {
          background: #22222c; color: #e8e8ec;
          border: 1px solid rgba(255,255,255,0.09);
          border-bottom-left-radius: 4px;
        }
        .bubble--typing { display: flex; align-items: center; gap: 5px; padding: 14px 18px; }
        .dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: linear-gradient(135deg, #c026d3, #f472b6);
          display: inline-block;
          animation: dotBounce 1.3s ease-in-out infinite;
        }

        /* ── Error ── */
        .error-msg {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 12px; color: #fca5a5;
          padding: 10px 14px; font-size: 13.5px;
        }

        /* ── Empty state ── */
        .empty-state {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          flex: 1; padding: 40px 20px; text-align: center;
        }
        .empty-logo {
          width: 68px; height: 68px; border-radius: 50%;
          background: linear-gradient(135deg, #c026d3, #f472b6);
          display: flex; align-items: center; justify-content: center;
          font-size: 28px; color: #fff; margin-bottom: 18px;
          box-shadow: 0 0 36px rgba(192,38,211,0.45);
        }
        .empty-title {
          font-size: clamp(20px, 2vw, 28px); font-weight: 700;
          color: #fff; margin-bottom: 8px; letter-spacing: -0.01em;
        }
        .empty-sub {
          font-size: 14px; color: #777; margin-bottom: 28px;
          max-width: 340px; line-height: 1.6;
        }
        .chip-row { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; max-width: 480px; }
        .chip {
          padding: 9px 16px; border-radius: 100px;
          background: #1e1e28; border: 1px solid rgba(255,255,255,0.1);
          color: #aaa; font-size: 13px;
          font-family: 'Nunito', sans-serif; cursor: pointer;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .chip:hover {
          border-color: #c026d3; color: #fff;
          background: rgba(192,38,211,0.08);
        }

        /* ── Input footer — always sticks to bottom ── */
        .input-footer {
          flex-shrink: 0;
          background: #111114;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 10px 14px;
          padding-bottom: max(14px, env(safe-area-inset-bottom));
          position: relative;
          z-index: 10;
        }
        .input-footer-inner { max-width: 820px; margin: 0 auto; }

        /* ── Animations ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%           { transform: scale(1);   opacity: 1; }
        }

        /* ── Responsive ── */
        @media (min-width: 640px) {
          .chat-header   { padding: 0 20px; height: 62px; min-height: 62px; }
          .messages-inner { padding: 20px 20px 10px; }
          .input-footer  { padding: 12px 20px max(16px, env(safe-area-inset-bottom)); }
        }
        @media (min-width: 1024px) {
          .sidebar { display: flex; }
          .header-back { display: none; }
          .header-new-chat-btn { display: none; }
          .chat-header { height: 64px; min-height: 64px; padding: 0 28px; }
          .header-name { font-size: 16px; }
          .header-avatar { width: 40px; height: 40px; }
          .messages-inner { padding: 24px 32px 12px; }
          .input-footer { padding: 12px 32px 20px; }
          .bubble { font-size: 15px; }
          .av { width: 34px; height: 34px; }
        }
        @media (min-width: 1280px) {
          .sidebar { width: 260px; min-width: 260px; }
        }
        @media (min-width: 1536px) {
          .sidebar { width: 280px; min-width: 280px; }
          .messages-inner { padding: 28px 40px 12px; max-width: 920px; }
          .input-footer-inner { max-width: 920px; }
        }
      `}</style>

      <div className="chat-page">

        {/* Sidebar — desktop only */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">✦</div>
            <div>
              <div className="sidebar-logo-text">Talkify</div>
              <div className="sidebar-logo-sub">Groq · Llama 3.3</div>
            </div>
          </div>
          <button className="new-chat-btn" onClick={clearChat}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Chat
          </button>
          <div className="sidebar-section">Recent</div>
          {["Healthy eating tips", "Quantum computing", "Python debugging"].map((item, i) => (
            <button key={i} className={`sidebar-item ${i === 0 ? "active" : ""}`}>
              <span className="sidebar-item-dot" />{item}
            </button>
          ))}
        </aside>

        {/* Main */}
        <div className="chat-main">

          {/* Header */}
          <header className="chat-header">
            <button className="header-back" onClick={clearChat}>‹</button>
            <div className="header-avatar">✦</div>
            <div className="header-info">
              <div className="header-name">Talkify</div>
              <div className="header-sub">Powered by Groq · Llama 3.3</div>
            </div>
            <div className="header-actions">
              <button className="header-new-chat-btn" onClick={clearChat}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Chat
              </button>
              <button className="header-icon-btn" title="More options">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="1.2" fill="currentColor" />
                  <circle cx="12" cy="12" r="1.2" fill="currentColor" />
                  <circle cx="12" cy="19" r="1.2" fill="currentColor" />
                </svg>
              </button>
            </div>
          </header>

          {/* Messages */}
          <div className="messages-scroll">
            <div className="messages-inner">
              {messages.length === 0 && !loading ? (
                <EmptyState onSuggestion={sendMessage} />
              ) : (
                <>
                  <div className="date-divider">Today</div>
                  {messages.map((msg, i) => (
                    <MessageBubble
                      key={i}
                      role={msg.role}
                      content={msg.content}
                      isLast={i === messages.length - 1 && msg.role === "assistant"}
                      onRetry={handleRetry}
                    />
                  ))}
                </>
              )}
              {loading && <TypingIndicator />}
              {error && <div className="error-msg">⚠ {error}</div>}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input */}
          <div className="input-footer">
            <div className="input-footer-inner">
              <InputBar onSend={sendMessage} disabled={loading} />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}