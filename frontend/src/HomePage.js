// src/HomePage.js
import React from "react";
//import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function HomePage({ onNavigate }) {
  return (
    <div className="home-wrapper">

      {/* HERO SECTION */}
      <section className="home-hero">
        <h1>AI-Powered Career Compass</h1>
        <p>
          Analyze your resume, match it with job descriptions,
          and improve your chances of getting shortlisted by ATS systems.
        </p>

        <div className="home-actions">
          <button onClick={() => onNavigate("upload")}>Upload Resume</button>
          <button onClick={() => onNavigate("analysis")}>Add Job Description</button>
          <button onClick={() => onNavigate("assistant")}>Ask Career Assistant</button>
        </div>
      </section>

      {/* HOW IT HELPS */}
      <section className="home-section">
        <h2>How Career Compass Helps You</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Resume Analysis</h3>
            <p>
              Automatically extracts skills and experience to
              identify strengths and gaps in your resume.
            </p>
          </div>

          <div className="feature-card">
            <h3>Job Description Matching</h3>
            <p>
              Compares your resume with real job descriptions
              to check relevance and ATS compatibility.
            </p>
          </div>

          <div className="feature-card">
            <h3>Smart Suggestions</h3>
            <p>
              Provides actionable improvements to increase
              your resume’s ATS score.
            </p>
          </div>

          <div className="feature-card">
            <h3>Career Assistant</h3>
            <p>
              Get guidance on skills, roles, interviews,
              and career planning using AI.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="home-section light">
        <h2>How It Works</h2>

        <ol className="steps-list">
          <li>Upload your resume</li>
          <li>Add the job description</li>
          <li>Analyze resume vs requirements</li>
          <li>Improve and recheck</li>
        </ol>
      </section>

      {/* ATS SCORE */}
      <section className="home-section">
        <h2>What is an ATS Resume Score?</h2>

        <p className="ats-text">
          Applicant Tracking Systems (ATS) are used by companies
          to filter resumes before recruiters see them.
          Career Compass helps optimize your resume for ATS screening.
        </p>

        <div className="ats-levels">
          <span className="good">80%+ Strong Match</span>
          <span className="avg">60–79% Needs Improvement</span>
          <span className="bad">Below 60% High Risk</span>
        </div>
      </section>

      {/* TIPS */}
      <section className="home-section light">
        <h2>Tips for You</h2>

        <ul className="tips-list">
          <li>Use keywords from job descriptions</li>
          <li>Keep resume clean and structured</li>
          <li>Highlight measurable achievements</li>
          <li>Avoid heavy graphics for ATS</li>
        </ul>
      </section>

    </div>
  );
}
