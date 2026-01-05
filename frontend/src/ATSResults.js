  import React, { useEffect, useState } from "react";
 
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
  function getSuggestion(section, score) {
    if (section === "IMPACT") {
      if (score < 40) return "Add measurable results and strong action verbs.";
      if (score < 70) return "Quantify more achievements.";
      return "Good impact. Add 1–2 more metrics.";
    }

    if (section === "BREVITY") {
      if (score < 40) return "Reduce resume length.";
      if (score < 70) return "Shorten bullet points.";
      return "Length is well balanced.";
    }

    if (section === "STYLE") {
      if (score < 40) return "Improve formatting consistency.";
      if (score < 70) return "Use clearer headings.";
      return "ATS-friendly style.";
    }

  if (section === "SKILLS MATCH") {
    return `
  Add missing skills through hands-on projects.
  Even a small real-world project or internship example can significantly improve your ATS score.
  `;
  }

  }
  function ScoreCard({ title, score, items, delay }) {
    const animatedScore = useCountUp(score, 900, delay);

    const ringColor =
      score < 30 ? "#ef4444" : score <= 60 ? "#f97316" : "#10b981";

    const labelText =
      score < 30 ? "NEEDS WORK" : score <= 60 ? "AVERAGE" : "GOOD";

    return (
      <div className="ats-card" style={{ animationDelay: `${delay}ms` }}>
        <h4>{title}</h4>

        <div className="score-circle solid" style={{ "--ring-color": ringColor }}>
          <span>{animatedScore}</span>
        </div>

        <span className="label">{labelText}</span>

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
  export default function ATSResults({ data, onBack, onCareerQA,onApplyJobs
  }) {

    

    const animatedFinal = useCountUp(
      Math.round(data?.final_score || 0),
      1200,
      300
    );

if (!data) {
  return (
    <div className="ats-empty">
      <h3>No ATS Results Available</h3>
      <p>Please upload your resume and analyze a job description.</p>
    </div>
  );
}


    const {
      impact = 0,
      brevity = 0,
      style = 0,
      skills_match = 0,
      missing_skills = []
    } = data;

    const hasMissingSkills = missing_skills.length > 0;

    const skillsMatchItems = hasMissingSkills
      ? missing_skills.map(skill => ({
          name: `Missing: ${skill.toUpperCase()}`,
          value: "✕",
          type: "missing"
        }))
      : [
          {
            name: "All required skills matched",
            value: "✓",
            type: "matched"
          }
        ];

  
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
        items: skillsMatchItems
      }
    ];

   
    const recommendedSkills = hasMissingSkills
      ? missing_skills.map(
          skill =>
            `${skill.toUpperCase()} – Learn fundamentals and build a mini project using it`
        )
      : [
          "Strengthen advanced concepts",
          "Build 1–2 real-world projects",
          "Improve system design knowledge",
          "Practice explaining projects clearly"
        ];

    const interviewQuestions = hasMissingSkills
      ? missing_skills.flatMap(skill => [
          `What is ${skill}?`,
          `Where have you used ${skill}?`,
          `Explain a real-world use case of ${skill}.`
        ])
      : [
          "Explain your most challenging project.",
          "How do you debug production issues?",
          "Describe a performance optimization you implemented.",
          "How do you keep your technical skills updated?"
        ];

  
    const downloadPDF = async () => {
    const payload = {
      ...data,
      recommended_skills: recommendedSkills,
      interview_questions: interviewQuestions
    };

    const res = await fetch("http://127.0.0.1:8000/export-ats-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
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

<div className="ats-ai-section">

  <h3>Recommended Skills & Interview Questions</h3>
  <p className="ai-subtitle">
    {hasMissingSkills
      ? "Based on missing skills from your resume analysis"
      : "Your profile is strong. Here’s how to stand out further."}
  </p>

  {/* CARDS */}
  <div className="ats-ai-cards">

    <div className="ats-info-card">
      <h4>Recommended Skills to Learn</h4>
      <ul>
        {recommendedSkills.map((skill, i) => (
          <li key={i}>{skill}</li>
        ))}
      </ul>
    </div>

    <div className="ats-info-card">
      <h4>Interview Questions</h4>
      <ul>
        {interviewQuestions.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ul>
    </div>

  </div>
=
  <div className="ats-bottom-actions">
    <button className="secondary-btn" onClick={onCareerQA}>
      Career Q / A →
    </button>

    <button className="apply-jobs-btn" onClick={onApplyJobs}>
      Apply Jobs →
    </button>
  </div>
</div>

      </div>
    );
  }
