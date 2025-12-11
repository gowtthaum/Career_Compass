// src/App.js
import React, { useState } from "react";


import UploadPage from "./UploadPage";
import AnalysisPage from "./AnalysisPage";
import ResultPage from "./ResultPage";
import CareerAssistant from "./CareerAssistant";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import "./App.css";

// ICONS
import HomeIcon from "@mui/icons-material/Home";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionIcon from "@mui/icons-material/Description";
import BarChartIcon from "@mui/icons-material/BarChart";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function App() {
  const [page, setPage] = useState("login");  // Login is first page
  const [resumeFile, setResumeFile] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [user, setUser] = useState(null);  // NULL = not logged in

  const navigate = (p) => setPage(p);

  const handleLoginSuccess = (userData) => {
    setUser({
      name: userData.name,
      email: userData.email,
    });
    setPage("home"); // Redirect to dashboard home
  };

  const handleRegisterSuccess = () => {
    alert("Account created successfully! Please login.");
    setPage("login");
  };

  const logout = () => {
    setUser(null);
    setPage("login");
  };

  // ⭐ IF USER IS NOT LOGGED IN → SHOW ONLY LOGIN OR REGISTER PAGE
  if (!user) {
  return (
    <div className="auth-wrapper">
      {page === "login" && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onSwitch={setPage}
        />
      )}

      {page === "register" && (
        <RegisterPage
          onRegisterSuccess={handleRegisterSuccess}
          onSwitch={setPage}
        />
      )}
    

        <div className="auth-switch">
          {page === "login" ? (
            <p>
              Don’t have an account?{" "}
              <span onClick={() => setPage("register")}>Register</span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => setPage("login")}>Login</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  // ⭐ AFTER LOGIN → SHOW FULL DASHBOARD
  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">Career Compass</h2>

        <div className="menu">
          <div className="menu-item" onClick={() => navigate("home")}>
            <HomeIcon className="icon" /> Home
          </div>

          <div className="menu-item" onClick={() => navigate("upload")}>
            <UploadFileIcon className="icon" /> Upload Resume
          </div>

          <div className="menu-item" onClick={() => navigate("analysis")}>
            <DescriptionIcon className="icon" /> Add Job Description
          </div>

          <div className="menu-item" onClick={() => navigate("results")}>
            <BarChartIcon className="icon" /> Results
          </div>

          <div className="menu-item" onClick={() => navigate("assistant")}>
            <SmartToyIcon className="icon" /> Career Assistant
          </div>
        </div>

        <div className="menu-footer">
          <div className="menu-item">
            <SettingsIcon className="icon" /> Settings
          </div>
          <div className="menu-item" onClick={logout}>
            <LogoutIcon className="icon" /> Logout
          </div>
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="main">
        <div className="topbar">
          <input className="search-box" placeholder="Search anything..." />

          <div className="topbar-right">
            <span>Welcome, {user.name}</span>
            <NotificationsIcon className="top-icon" />
            <img className="avatar" src="https://i.pravatar.cc/40" alt="user" />
          </div>
        </div>

        <div className="page-content">
          {page === "home" && <HomePage onNavigate={navigate} />}
          {page === "upload" && (
            <UploadPage
              onNext={(file) => {
                setResumeFile(file);
                navigate("analysis");
              }}
            />
          )}
          {page === "analysis" && (
            <AnalysisPage
              resumeFile={resumeFile}
              onPrev={() => navigate("upload")}
              onNext={(data) => {
                setResultData(data);
                navigate("results");
              }}
            />
          )}
          {page === "results" && (
            <ResultPage result={resultData} onBack={() => navigate("analysis")} />
          )}
          {page === "assistant" && <CareerAssistant />}
        </div>
      </div>
    </div>
  );
}
