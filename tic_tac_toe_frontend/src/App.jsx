import React, { useState } from "react";
import ChatWidget from "./components/ChatWidget";

// PUBLIC_INTERFACE
export default function App() {
  /**
   * This is the main application component providing a minimal board shell
   * and integrating the ChatWidget. The game board is a placeholder here
   * as the focus of this task is the chatbot integration.
   */
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (idx) => {
    setBoard((prev) => {
      if (prev[idx]) return prev;
      const next = [...prev];
      next[idx] = xIsNext ? "X" : "O";
      setXIsNext(!xIsNext);
      return next;
    });
  };

  return (
    <div className="container">
      <header style={{ marginBottom: 16 }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <h1 style={{ margin: 0, fontSize: 24 }}>
            Tic Tac Toe
          </h1>
          <span className="badge">
            Ocean Professional
          </span>
        </div>
        <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>
          Centralized 3x3 board layout with minimal controls.
        </p>
      </header>

      <main className="card" style={{ padding: 24 }}>
        <section style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, maxWidth: 360, margin: "0 auto" }}>
          {board.map((cell, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              style={{
                height: 100,
                fontSize: 28,
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                boxShadow: "var(--shadow)",
                cursor: "pointer"
              }}
            >
              {cell}
            </button>
          ))}
        </section>
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button className="button" onClick={() => { setBoard(Array(9).fill(null)); setXIsNext(true); }}>
            Reset Game
          </button>
        </div>
      </main>

      <ChatWidget />
    </div>
  );
}
