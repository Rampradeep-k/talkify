import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble.jsx";
import InputBar from "./InputBar.jsx";
import { useChat } from "../hooks/UseChat.js";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4 pb-3">
      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
        AI
      </div>
      <div className="flex gap-1 bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-gray-400 inline-block"
            style={{
              animation: "bounce 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ onSuggestion }) {
  const suggestions = [
    "Explain quantum computing",
    "Write a short poem",
    "Debug my code",
    "Summarize a topic",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-16 text-center">
      <div className="text-5xl mb-5">✨</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Start a conversation
      </h2>
      <p className="text-sm text-gray-500 mb-8 max-w-sm">
        Ask me anything — I'm here to help with coding, writing, analysis, and more.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-150"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ChatWindow() {
  const { messages, loading, error, sendMessage, clearChat } = useChat();
  const bottomRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const handleScroll = () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollBtn(distFromBottom > 120);
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-white relative">

      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold text-base shadow-md">
            G
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">
              GPT Assistant
            </p>
            <p className="text-xs text-gray-400 leading-tight">
              Powered by Groq • Llama 3.3
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-500 border border-gray-200 rounded-full hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300 transition-all duration-150"
        >
          New chat
        </button>
      </header>

      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto bg-gray-50"
      >
        <div className="max-w-3xl mx-auto w-full px-3 sm:px-6 py-4">
          {messages.length === 0 && !loading && (
            <EmptyState onSuggestion={sendMessage} />
          )}

          {messages.map((msg, i) => (
            <MessageBubble key={i} role={msg.role} content={msg.content} />
          ))}

          {loading && <TypingIndicator />}

          {error && (
            <div className="mx-2 my-2 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollBtn && messages.length > 0 && (
        <button
          onClick={() => bottomRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="absolute bottom-24 right-4 sm:right-8 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:shadow-lg transition-all duration-150 z-10"
        >
          ↓
        </button>
      )}

      {/* Input bar */}
      <div className="shrink-0 bg-white border-t border-gray-100 px-3 sm:px-6 py-3 pb-4">
        <div className="max-w-3xl mx-auto w-full">
          <InputBar onSend={sendMessage} disabled={loading} />
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
