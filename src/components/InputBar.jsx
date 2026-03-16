import { useState, useRef } from "react";

export default function InputBar({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  return (
    <>
      <style>{`
        .inputbar-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #1c1c24;
          border: 1.5px solid rgba(255,255,255,0.85);
          border-radius: 28px;
          padding: 10px 12px 10px 18px;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
        }
        .inputbar-wrap:focus-within {
          border-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.08);
        }
        .inputbar-textarea {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          resize: none;
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
          line-height: 1.55;
          max-height: 120px;
          overflow-y: auto;
          scrollbar-width: none;
          padding: 0;
          align-self: center;
        }
        .inputbar-textarea::placeholder { color: rgba(255,255,255,0.4); }
        .inputbar-textarea::-webkit-scrollbar { display: none; }
        .inputbar-textarea:disabled { opacity: 0.4; cursor: not-allowed; }
        .inputbar-mic {
          background: none;
          border: none;
          cursor: pointer;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
          transition: color 0.15s, background 0.15s;
        }
        .inputbar-mic:hover { background: rgba(255,255,255,0.1); }
        .inputbar-mic:disabled { opacity: 0.35; cursor: not-allowed; }
        .inputbar-send {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c026d3, #f472b6);
          border: none;
          cursor: pointer;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 14px rgba(192,38,211,0.45);
          transition: transform 0.15s, opacity 0.15s;
        }
        .inputbar-send:hover:not(:disabled) { transform: scale(1.1); }
        .inputbar-send:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          box-shadow: none;
        }
        .inputbar-hint {
          text-align: center;
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          margin-top: 8px;
          letter-spacing: 0.02em;
          font-family: 'Nunito', sans-serif;
        }
      `}</style>

      <div className="inputbar-wrap">
        <textarea
          ref={textareaRef}
          className="inputbar-textarea"
          rows={1}
          placeholder="Send message..."
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />

        {/* Mic */}
        <button className="inputbar-mic" title="Voice input" disabled={disabled}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10a7 7 0 0014 0" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
        </button>

        {/* Send */}
        <button
          className="inputbar-send"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          title="Send"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 5 5 12" />
          </svg>
        </button>
      </div>

      <p className="inputbar-hint">Enter to send · Shift+Enter for new line</p>
    </>
  );
}