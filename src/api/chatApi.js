const BASE = `${import.meta.env.VITE_API_URL}api/chat`;

export async function sendMessage(message, sessionId) {
  const res = await fetch(`${BASE}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export async function loadHistory(sessionId) {
  const res = await fetch(`${BASE}/history/${sessionId}`);
  if (!res.ok) throw new Error("Failed to load history");
  return res.json();
}

export async function clearHistory(sessionId) {
  await fetch(`${BASE}/history/${sessionId}`, { method: "DELETE" });
}