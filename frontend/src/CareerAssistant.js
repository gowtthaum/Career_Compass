import React, { useState, useRef, useEffect } from "react";

export default function CareerAssistant({ onBackHome }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I’m your Career Assistant. You can upload your resume and ask questions about it."
    }
  ]);

  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

 
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    let updatedMessages = [...messages];

    if (editIndex !== null) {
      updatedMessages = messages.slice(0, editIndex);
    }

    updatedMessages.push({ role: "user", content: input });
    setMessages(updatedMessages);
    setInput("");
    setEditIndex(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", input);
      if (file) formData.append("file", file);

      const res = await fetch("http://127.0.0.1:8000/ask_career_ai", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "How can I help further?"
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Something went wrong." }
      ]);
    }

    setFile(null);
    setLoading(false);
  };

  return (
    <div className="career-page">
      {/* HEADER */}
      <div className="career-header">
        <button className="back-btn" onClick={onBackHome}>
          ← Back to Home
        </button>
        <h3>Career Assistant</h3>
      </div>

      {/* CHAT CARD */}
      <div className="chat-card">
        {/* MESSAGES */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-line ${msg.role}`}>
              <span className="chat-role">
                {msg.role === "user" ? "You:" : "Assistant:"}
              </span>
              <span className="chat-text">{msg.content}</span>

              {msg.role === "user" && i === messages.length - 2 && (
                <button
                  className="edit-btn"
                  onClick={() => {
                    setInput(msg.content);
                    setEditIndex(i);
                  }}
                >
                  ✏️
                </button>
              )}
            </div>
          ))}

          {loading && (
            <div className="chat-line assistant typing">
              Assistant: Typing…
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT */}
        <div className="chat-input">
          <button
            type="button"
            className="attach-btn"
            onClick={() => fileInputRef.current.click()}
          >
            +
          </button>

          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept=".pdf,.docx,.png,.jpg,.jpeg"
            onChange={e => setFile(e.target.files[0])}
          />

          <input
            type="text"
            placeholder="Ask a career question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />

          <button type="button" onClick={sendMessage} disabled={loading}>
            Send
          </button>
        </div>

        {file && <div className="file-preview">Attached: {file.name}</div>}
      </div>
    </div>
  );
}
