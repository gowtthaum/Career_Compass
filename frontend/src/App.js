import React, { useState, useEffect } from "react";

import UploadPage from "./UploadPage";
import AnalysisPage from "./AnalysisPage";
import ResultPage from "./ResultPage";
import CareerAssistant from "./CareerAssistant";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ResultsHistoryModal from "./ResultsHistoryModal";

import "./App2.css";
import "./App.css";

// MUI Icons
import HomeIcon from "@mui/icons-material/Home";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionIcon from "@mui/icons-material/Description";
import BarChartIcon from "@mui/icons-material/BarChart";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function App() {
  const [page, setPage] = useState("login");
  const [resumeFile, setResumeFile] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [resultsHistory, setResultsHistory] = useState([]);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = (p) => setPage(p);

  /* ===============================
     LOAD LAST RESULT (OPTIONAL)
  =============================== */
  useEffect(() => {
    const saved = localStorage.getItem("atsResult");
    if (saved) {
      setResultData(JSON.parse(saved));
    }
  }, []);

  /* ===============================
     AUTH HANDLERS
  =============================== */
  const handleLoginSuccess = (userData) => {
    setUser({
      name: userData.name || "User",
      email: userData.email,
    });
    setPage("home");
  };

  const handleRegisterSuccess = () => {
    alert("Account created successfully! Please login.");
    setPage("login");
  };

  const logout = () => {
    localStorage.removeItem("atsResult");
    setUser(null);
    setResultData(null);
    setResultsHistory([]);
    setPage("login");
  };

  /* ===============================
     NOT LOGGED IN
  =============================== */
  if (!user) {
    return (
      <>
        {page === "login" && (
          <LoginPage onLoginSuccess={handleLoginSuccess} onSwitch={setPage} />
        )}

        {page === "register" && (
          <RegisterPage
            onRegisterSuccess={handleRegisterSuccess}
            onSwitch={setPage}
          />
        )}
      </>
    );
  }

  /* ===============================
     DASHBOARD
  =============================== */
  return (
    <div className="app-container">

      {/* SIDEBAR */}
      {page === "home" && (
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
              <DescriptionIcon className="icon" /> Job Description
            </div>

            {/* RESULTS */}
            <div
              className="menu-item"
              onClick={() => {
                if (resultsHistory.length > 0) {
                  setShowResultsModal(true);
                } else {
                  alert(
                    "No analysis results yet. Please upload a resume and analyze first."
                  );
                  navigate("upload");
                }
              }}
            >
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
      )}

      {/* MAIN */}
      <div className={`main ${page !== "home" ? "no-sidebar" : ""}`}>
        <div className="topbar">
          {page === "home" && (
            <input className="search-box" placeholder="Search anything..." />
          )}

          <div className="topbar-right">
            <span>Welcome, {user.name}</span>
            <NotificationsIcon className="top-icon" />
            <img
              className="avatar"
              src="https://i.pravatar.cc/40"
              alt="user"
            />
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
              onBack={() => navigate("home")}
            />
          )}

          {page === "analysis" && (
            <AnalysisPage
              resumeFile={resumeFile}
              onPrev={() => navigate("upload")}
              onNext={(data) => {
                const newResult = {
                  id: Date.now(),
                  date: new Date().toLocaleString(),
                  final_score: data.final_score,
                  data,
                };

                setResultsHistory((prev) => [newResult, ...prev]);
                setResultData(data);
                localStorage.setItem("atsResult", JSON.stringify(data));
                navigate("results");
              }}
            />
          )}

          {page === "results" && (
            <ResultPage
              result={resultData}
              onBack={() => navigate("analysis")}
              onCareerQA={() => navigate("assistant")}
            />
          )}

          {page === "assistant" && <CareerAssistant />}
        </div>
      </div>

      {/* RESULTS HISTORY MODAL */}
      {showResultsModal && (
        <ResultsHistoryModal
          results={resultsHistory}
          onClose={() => setShowResultsModal(false)}
          onView={(item) => {
            setResultData(item.data);
            setShowResultsModal(false);
            navigate("results");
          }}
          onDelete={(id) =>
            setResultsHistory((prev) => prev.filter((r) => r.id !== id))
          }
        />
      )}
    </div>
  );
}
