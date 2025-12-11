// CareerAssistant.js
import React, { useState, useEffect } from "react";


export default function CareerAssistant({ open, onClose }) {
  const [visible, setVisible] = useState(false);
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const backend = "http://127.0.0.1:8000";

  useEffect(() => {
    setVisible(open);
  }, [open]);

  const askAI = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${backend}/ask_career_ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setReply(data.reply);
    } catch (err) {
      setReply("Failed to reach assistant. Ensure backend is running.");
    }
    setLoading(false);
  };

  if (!visible) return (
    <div className="assistant-button" onClick={() => setVisible(true)}>💬</div>
  );

  return (
    <div className="assistant-window">
      <div className="assistant-header">
        <div>Career Assistant</div>
        <div style={{ cursor: "pointer" }} onClick={() => { setVisible(false); if (onClose) onClose(); }}>✕</div>
      </div>

      <textarea className="assistant-text" placeholder="Ask a career question..." value={question} onChange={(e) => setQuestion(e.target.value)} />

      <div style={{ display: "flex", gap: 8 }}>
        <button className="assistant-send" onClick={askAI}>{loading ? "Thinking..." : "Send"}</button>
        <button className="assistant-send" onClick={() => { setQuestion(""); setReply(""); }}>Clear</button>
      </div>

      {reply && <div className="assistant-reply">{reply}</div>}
    </div>
  );
}
