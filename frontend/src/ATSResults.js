import React, { useEffect, useState } from "react";

/* =========================
   COUNT-UP HOOK
========================= */
function useCountUp(target, duration = 900, delay = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let current = 0;
    let timer;

    if (!target || target <= 0) {
      setValue(0);
      return;
    }

    const step = Math.max(Math.floor(duration / target), 15);

    const start = () => {
      timer = setInterval(() => {
        current += 1;
        setValue(current);
        if (current >= target) clearInterval(timer);
      }, step);
    };

    const delayTimer = setTimeout(start, delay);

    return () => {
      clearTimeout(delayTimer);
      clearInterval(timer);
    };
  }, [target, duration, delay]);

  return value;
}

/* =========================
   SUGGESTION ENGINE
========================= */
function getSuggestion(section, score) {
  if (section === "IMPACT") {
    if (score < 40)
      return "Add measurable results (numbers, %, metrics) and strong action verbs.";
    if (score < 70)
      return "Quantify more achievements and reduce generic responsibilities.";
    return "Good impact. Add 1–2 more quantified achievements for excellence.";
  }

  if (section === "BREVITY") {
    if (score < 40)
      return "Reduce resume length and remove unnecessary details.";
    if (score < 70)
      return "Shorten bullet points and avoid long sentences.";
    return "Resume length and bullet structure are well balanced.";
  }

  if (section === "STYLE") {
    if (score < 40)
      return "Improve formatting consistency and section clarity.";
    if (score < 70)
      return "Use consistent headings and reduce buzzwords.";
    return "Resume style is clean and ATS-friendly.";
  }

  if (section === "SKILLS MATCH") {
    return "Add missing skills in Skills or Projects sections using real examples. Applying new tools relevant to your field (like AI or a new software) to boost technical expertise";
  }
}

/* =========================
   SCORE CARD
========================= */
function ScoreCard({ title, score, items, delay }) {
  const animatedScore = useCountUp(score, 900, delay);

  const ringColor =
    score < 30 ? "#ef4444" : score <= 60 ? "#f97316" : "#10b981";

  const labelText =
    score < 30 ? "NEEDS WORK" : score <= 60 ? "AVERAGE" : "GOOD";

  const labelClass =
    score < 30 ? "danger" : score <= 60 ? "average" : "excellent";

  return (
    <div className="ats-card" style={{ animationDelay: `${delay}ms` }}>
      <h4>{title}</h4>

      <div
        className="score-circle solid"
        style={{ "--ring-color": ringColor }}
      >
        <span>{animatedScore}</span>
      </div>

      <span className={`label ${labelClass}`}>{labelText}</span>

      <ul>
        {items.map((item, i) => (
          <li key={i}>
            <span>{item.name}</span>
            <span className={item.type}>{item.value}</span>
          </li>
        ))}
      </ul>

      <div className="suggestion-box">
        <strong>Suggestion:</strong>
        <p>{getSuggestion(title, score)}</p>
      </div>
      
    </div>
 
);
}


/* =========================
   MAIN COMPONENT
========================= */
export default function ATSResults({ data, onBack }) {
  const animatedFinal = useCountUp(
    Math.round(data?.final_score || 0),
    1200,
    300
  );

  if (!data) {
    return <p>Loading results...</p>;
  }

  const {
    impact = 0,
    brevity = 0,
    style = 0,
    skills_match = 0,
    matched_skills = [],
    missing_skills = []
  } = data;

  const skillsItems = [
    ...matched_skills.slice(0, 5).map(skill => ({
      name: `Matched: ${skill.toUpperCase()}`,
      value: "✓",
      type: "matched"
    })),
    ...missing_skills.slice(0, 5).map(skill => ({
      name: `Missing: ${skill.toUpperCase()}`,
      value: "✕",
      type: "missing"
    }))
  ];
  /* =========================
     PDF DOWNLOAD FUNCTION
  ========================= */
  const downloadPDF = async () => {
  const res = await fetch("http://127.0.0.1:8000/export-ats-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "CareerCompass_ATS_Report.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
};

  
  

  const cards = [
    {
      title: "IMPACT",
      score: impact,
      items: [
        { name: "Quantifying impact", value: 10, type: "positive" },
        { name: "Action verbs", value: 8, type: "positive" },
        { name: "Spelling", value: 8, type: "positive" }
      ]
    },
    {
      title: "BREVITY",
      score: brevity,
      items: [
        { name: "Resume length", value: 10, type: "positive" },
        { name: "Bullet points", value: 9, type: "positive" },
        { name: "Bullet length", value: 9, type: "positive" }
      ]
    },
    {
      title: "STYLE",
      score: style,
      items: [
        { name: "Sections", value: 10, type: "positive" },
        { name: "Buzzwords", value: 9, type: "positive" },
        { name: "Pronouns", value: 8, type: "positive" }
      ]
    },
    {
      title: "SKILLS MATCH",
      score: skills_match,
      items: skillsItems
    }
    
  ];
  

  return (
    <div className="ats-header">
  <div>
    <h2>Resume Analysis</h2>
    <h3>Final Resume Score: {animatedFinal}%</h3>
  </div>

  <button className="download-btn" onClick={downloadPDF}>
    ⬇ Download ATS Report (PDF)
  </button>
  <div className="ats-grid">
  {cards.map((card, idx) => (
    <ScoreCard key={idx} {...card} delay={600 + idx * 300} />
  ))}
</div>

<button className="back-btn" onClick={onBack}>
  ← Back to Analysis
</button>

</div>

  );
}   