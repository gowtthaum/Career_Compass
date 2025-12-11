// src/HomePage.js
import React from "react";


export default function HomePage({ onNavigate }) {
  return (
    <div className="dashboard-container">

      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">Career Compass</h2>

        <nav className="menu">
          <div className="menu-item" onClick={() => onNavigate("home")}>🏠 Home</div>
          <div className="menu-item" onClick={() => onNavigate("upload")}>📄 Upload Resume</div>
          <div className="menu-item" onClick={() => onNavigate("addjob")}>📝 Add Job Description</div>
          <div className="menu-item" onClick={() => onNavigate("results")}>📊 Results</div>
          <div className="menu-item" onClick={() => onNavigate("assistant")}>🤖 Career Assistant</div>

          <div className="menu-footer">
            <div className="menu-item">⚙ Settings</div>
            <div className="menu-item">🚪 Logout</div>
          </div>
        </nav>
      </aside>

      {/* MAIN PAGE AREA */}
      <main className="main-content">
        
        {/* TOP NAVBAR */}
        <header className="topbar">
          <input type="text" placeholder="Search anything…" className="search-box" />
          <div className="profile-area">
            <span className="notif">🔔</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="profile-img"
            />
          </div>
        </header>

        {/* PAGE BODY */}
        <section className="content">

          <h1 className="welcome">Welcome back 👋</h1>
          <p className="subtitle">Your AI-powered Career Assistant is ready.</p>

          {/* QUICK ACTION CARDS */}
          <div className="quick-actions">
            <div className="action-card" onClick={() => onNavigate("upload")}>
              📤 Upload Resume
            </div>

            <div className="action-card" onClick={() => onNavigate("addjob")}>
              📝 Add Job Description
            </div>

            <div className="action-card" onClick={() => onNavigate("assistant")}>
              🤖 Ask Career Assistant
            </div>
          </div>

          {/* ANALYTICS SECTION */}
          <div className="grid-section">
            <div className="info-box">
              <h3>Recent Reports</h3>
              <p>No recent activity yet.</p>
            </div>

            <div className="info-box">
              <h3>Tips for You</h3>
              <ul>
                <li>Use keywords from job descriptions</li>
                <li>Keep your resume clean & structured</li>
                <li>Highlight measurable achievements</li>
              </ul>
            </div>
          </div>

        </section>
      </main>

    </div>
  );
}
