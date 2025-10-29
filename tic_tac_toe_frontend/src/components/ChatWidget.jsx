import React, { useEffect, useRef, useState } from "react";
import { openaiClient } from "../utils/openaiClient";

// PUBLIC_INTERFACE
export default function ChatWidget() {
  /**
   * ChatWidget renders a floating toggle button and a chat panel.
   * It provides a minimal client-side chat experience with:
   * - message list
   * - input box
   * - send button
   * - loading state
   * - graceful error toasts
   */
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: "sys-hello", role: "assistant", content: "Hi! I’m your Tic Tac Toe assistant. Ask me about rules, strategies, or anything else." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  const showToast = (message, type = "error") => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { id: `u-${Date.now()}`, role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await openaiClient.chat({
        messages: [
          // System prompt handled inside client utility, but include user history for better context
          ...messages.filter(m => m.role !== "system").map(m => ({ role: m.role, content: m.content })),
          { role: "user", content: trimmed }
        ]
      });
      const assistantMsg = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: (reply && reply.content) ? reply.content : "I’m here to help with Tic Tac Toe and more."
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      showToast("Unable to reach OpenAI. Check your API key in .env and try again.");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        aria-label="Toggle Chat"
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 50,
          background: "var(--primary)",
          color: "#fff",
          border: "none",
          width: 56,
          height: 56,
          borderRadius: "50%",
          boxShadow: "0 12px 28px rgba(37,99,235,0.35)",
          cursor: "pointer"
        }}
        title={open ? "Close chat" : "Open chat"}
      >
        {open ? "×" : "💬"}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="card"
          style={{
            position: "fixed",
            right: 20,
            bottom: 88,
            width: 340,
            maxHeight: 480,
            display: "flex",
            flexDirection: "column",
            background: "var(--surface)",
            borderRadius: "16px",
            boxShadow: "var(--shadow)",
            overflow: "hidden",
            zIndex: 49
          }}
        >
          <div style={{
            padding: "12px 14px",
            borderBottom: "1px solid #eef2f7",
            background: "linear-gradient(135deg, rgba(59,130,246,0.08), #ffffff)"
          }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Tic Tac Toe Assistant</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Ask about rules, openings, forks, and blocks.</div>
          </div>

          <div
            ref={listRef}
            style={{
              padding: 12,
              overflowY: "auto",
              flex: 1,
              background: "#fafafa"
            }}
          >
            {messages.map((m) => (
              <div key={m.id} style={{ marginBottom: 10, display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div
                  style={{
                    maxWidth: "80%",
                    background: m.role === "user" ? "var(--primary)" : "#fff",
                    color: m.role === "user" ? "#fff" : "var(--text)",
                    border: "1px solid #e5e7eb",
                    padding: "10px 12px",
                    borderRadius: 12,
                    boxShadow: "var(--shadow)",
                    whiteSpace: "pre-wrap"
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ color: "var(--muted)", fontSize: 12 }}>Thinking...</div>
            )}
          </div>

          <div style={{ padding: 12, borderTop: "1px solid #eef2f7", background: "#fff" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <textarea
                className="input"
                rows={1}
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                style={{ flex: 1, resize: "none" }}
              />
              <button
                className="button"
                disabled={loading || !input.trim()}
                onClick={sendMessage}
                style={{ opacity: loading || !input.trim() ? 0.7 : 1 }}
              >
                Send
              </button>
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: "var(--muted)" }}>
              Client-side prototype. Keep your API key secure.
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 20,
            background: toast.type === "error" ? "var(--error)" : "var(--secondary)",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: 12,
            boxShadow: "var(--shadow)",
            zIndex: 60,
            maxWidth: "90%",
            textAlign: "center"
          }}
        >
          {toast.message}
        </div>
      )}
    </>
  );
}
