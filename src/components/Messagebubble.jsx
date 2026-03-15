export default function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex items-end gap-2 mb-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0
          ${isUser ? "bg-blue-500" : "bg-emerald-500"}`}
      >
        {isUser ? "U" : "GROK"}
      </div>

      <div
        className={`max-w-[75%] sm:max-w-[65%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words text-left
          ${isUser
            ? "bg-blue-500 text-white rounded-2xl rounded-br-sm"
            : "bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100 shadow-sm"
          }`}
      >
        {content}
      </div>
    </div>
  );
}