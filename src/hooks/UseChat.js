import { useState, useEffect, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import * as api from "../api/chatApi.js";

// Persist session ID across page reloads
function getSessionId() {
  let id = localStorage.getItem("chatSessionId");
  if (!id) {
    id = uuidv4();
    localStorage.setItem("chatSessionId", id);
  }
  return id;
}

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const sessionId = useRef(getSessionId());

  // Load history on mount
  useEffect(() => {
    api.loadHistory(sessionId.current).then(({ messages }) => {
      if (messages?.length) setMessages(messages);
    });
  }, []);

  const sendMessage = useCallback(async (content) => {
    if (!content.trim()) return;
    setError(null);

    // Optimistic user message
    setMessages((prev) => [...prev, { role: "user", content }]);
    setLoading(true);

    try {
      const data = await api.sendMessage(content, sessionId.current);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setError(err.message);
      // Remove the optimistic message on failure
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }, []);

  const clearChat = useCallback(async () => {
    await api.clearHistory(sessionId.current);
    // Issue a new session ID
    const newId = uuidv4();
    localStorage.setItem("chatSessionId", newId);
    sessionId.current = newId;
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, clearChat };
}