import React from "react";

export default function HomePage({ onNavigate }) {
  return (
    <div className="home-wrapper">

      {/* HERO */}
      <section className="home-hero">
        <h1>AI-Powered Career Compass</h1>
        <p>
          Analyze your resume, match it with job descriptions,
          and improve your chances of getting shortlisted by
          Applicant Tracking Systems (ATS).
        </p>

        <div className="home-actions">
          <button onClick={() => onNavigate("upload")}>Upload Resume</button>
          <button onClick={() => onNavigate("analysis")}>Add Job Description</button>
          <button onClick={() => onNavigate("assistant")}>Ask Career Assistant</button>
          <button
            className="btn-primary"
            onClick={() => onNavigate("/recommended-jobs")}
          >
            Recommended Jobs
          </button>
        </div>
      </section>

     
      <section className="home-section light">
        <h2>Why Career Compass?</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>ATS-Focused Analysis</h3>
            <p>
              Designed to reflect how modern ATS systems
              scan, rank, and filter resumes.
            </p>
          </div>

          <div className="feature-card">
            <h3>Real Job Matching</h3>
            <p>
              Matches your resume with real job requirements
              and shows relevance before you apply.
            </p>
          </div>

          <div className="feature-card">
            <h3>AI Career Guidance</h3>
            <p>
              Get instant guidance on skills, roles,
              interview preparation, and career planning.
            </p>
          </div>

          <div className="feature-card">
            <h3>Time-Saving</h3>
            <p>
              Reduce manual edits and guesswork
              with clear, actionable insights.
            </p>
          </div>
        </div>
      </section>

  
      <section className="home-section">
        <h2>How Career Compass Helps You</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Resume Analysis</h3>
            <p>
              Extracts skills and experience to identify
              strengths and improvement areas.
            </p>
          </div>

          <div className="feature-card">
            <h3>Job Description Matching</h3>
            <p>
              Compares your resume with job descriptions
              for better ATS compatibility.
            </p>
          </div>

          <div className="feature-card">
            <h3>Smart Suggestions</h3>
            <p>
              Improves resume impact with keyword-based
              and role-specific recommendations.
            </p>
          </div>

          <div className="feature-card">
            <h3>Career Assistant</h3>
            <p>
              Get AI-powered help on roles, skills,
              and interview preparation.
            </p>
          </div>
        </div>
      </section>

      <section className="home-section light">
        <h2>Who Can Use Career Compass?</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Fresh Graduates</h3>
            <p>
              Identify skill gaps and prepare for
              entry-level opportunities confidently.
            </p>
          </div>

          <div className="feature-card">
            <h3>Job Switchers</h3>
            <p>
              Tailor resumes for new roles and
              improve shortlisting chances.
            </p>
          </div>

          <div className="feature-card">
            <h3>Career Explorers</h3>
            <p>
              Explore suitable roles, skills,
              and career paths using AI.
            </p>
          </div>

          <div className="feature-card">
            <h3>Interview Preparers</h3>
            <p>
              Get role-specific interview
              preparation guidance.
            </p>
          </div>
        </div>
      </section>

      <section className="home-section">
        <h2>How It Works</h2>

        <ol className="steps-list">
          <li>Upload your resume</li>
          <li>Add the job description</li>
          <li>Analyze resume vs requirements</li>
          <li>Improve and re-check</li>
        </ol>
      </section>

      {/* ATS */}
      <section className="home-section light">
        <h2>What Is a Resume Score?</h2>

        <p className="ats-text">
          Applicant Tracking Systems (ATS) are used by companies
          to filter resumes before recruiters review them.
          Career Compass helps optimize your resume for ATS screening.
        </p>

        <div className="ats-levels">
          <span className="good">80%+ Strong Match</span>
          <span className="avg">60–79% Needs Improvement</span>
          <span className="bad">Below 60% High Risk</span>
        </div>
      </section>

      <section className="home-section">
        <h2>What Makes Career Compass Different?</h2>

        <ul className="tips-list">
          <li>No generic advice — everything is resume-specific</li>
          <li>ATS-friendly analysis instead of visual scoring</li>
          <li>AI-powered career assistant support</li>
          <li>Real job recommendations with apply links</li>
          <li>Built for both beginners and professionals</li>
        </ul>
      </section>

   
      <section className="home-section home-cta light">
        <h2>Start Improving Your Career Today</h2>
        <p>
          Upload your resume, analyze it against job requirements,
          and get personalized career guidance in minutes.
        </p>

        <div className="home-actions">
          <button onClick={() => onNavigate("upload")}>Get Started</button>
          <button onClick={() => onNavigate("/recommended-jobs")}>
            View Recommended Jobs
          </button>
        </div>
      </section>

      <section className="home-footer">
        <p>
          Career Compass helps candidates understand how recruiters
          and ATS systems evaluate resumes in real hiring processes.
        </p>
      </section>

    </div>
  );
}
