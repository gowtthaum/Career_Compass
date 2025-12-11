// ResultPage.js
import React from "react";

export default function ResultPage({ result, onBack, openAssistant }) {
  if (!result) return <div style={{ padding: 20 }}>No results found.</div>;

  const pct = result.match_score || 0; // 0-100

  return (
    <div className="result-container">
      <div className="score-panel">
        <div style={{ height: 12 }} />
        <div className="score-circle" style={{ "--percent": pct }}>
          <div className="score-text">{pct}/100</div>
        </div>

        <div className="match-rating">{result.rating}</div>
        <div className="similarity">Similarity: {result.similarity}</div>

        <div className="score-points">
          <ul>
            <li>✓ ATS Keyword Match</li>
            <li>✓ Skill Match</li>
            <li>✓ Job Relevance</li>
          </ul>
        </div>

        <button className="unlock-btn">Unlock Full Report →</button>
      </div>

      <div className="details-panel">
        <h1>Analysis Result</h1>

        <div className="result-box">
          <h3>Missing Skills</h3>
          {result.missing_skills && result.missing_skills.length > 0 ? (
            <ul>{result.missing_skills.map((s,i) => <li key={i}>⚠ {s}</li>)}</ul>
          ) : <p>No missing skills detected.</p>}
        </div>

        <div className="result-box">
          <h3>Matching Skills</h3>
          {result.overlap_skills && result.overlap_skills.length > 0 ? (
            <ul>{result.overlap_skills.map((s,i) => <li key={i}>✓ {s}</li>)}</ul>
          ) : <p>No exact skill keywords matched from master list.</p>}
        </div>

        <div className="result-box">
          <h3>AI Suggestion</h3>
          <p>{result.ai_suggestion || "AI could not generate suggestion."}</p>
        </div>

        <button className="assistant-btn" onClick={openAssistant}>💬 Ask Career Assistant</button>
        <button className="back-btn-large" onClick={onBack}>← Back</button>
      </div>
    </div>
  );
}
