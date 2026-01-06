// AnalysisPage.js
import React, { useEffect, useState } from "react";

export default function AnalysisPage({ resumeFile, onPrev, onNext }) {
  const backend = "http://127.0.0.1:8000";


  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewScore, setPreviewScore] = useState(null);


  const JD_SAMPLES = {
    "Full Stack Developer": `We are looking for a highly skilled Full Stack Developer to join our engineering team.
Responsibilities:
• Develop and maintain scalable web applications using React, Node.js, and Express.
• Build RESTful APIs and integrate third-party services.
• Work with SQL & NoSQL databases (MySQL, MongoDB).
• Write reusable, maintainable, and testable code.
• Collaborate with UI/UX designers and back-end developers.

Required Skills:
• JavaScript, React.js, Node.js
• HTML, CSS, Bootstrap/Tailwind
• REST APIs, Git, CI/CD
• Database knowledge – MySQL / MongoDB
• Cloud deployment (AWS / Azure) is a plus.`,

    "Data Scientist": `We are hiring a Data Scientist to work on predictive analytics, machine learning, and business intelligence solutions.
Responsibilities:
• Clean, preprocess, and analyze large datasets.
• Build machine learning models and deploy them in production.
• Perform statistical analysis and generate insights for stakeholders.
• Create dashboards and visualizations for business teams.

Required Skills:
• Python, Pandas, NumPy, Scikit-Learn
• Machine Learning, Deep Learning basics
• SQL, Data Visualization (Tableau/Power BI)
• Feature engineering & model evaluation`,

    "Data Analyst": `We are seeking a Data Analyst who can turn raw data into meaningful insights that support business decisions.
Responsibilities:
• Perform data cleaning, validation, and transformation.
• Develop dashboards and reports using Power BI or Tableau.
• Use SQL to query and analyze datasets.
• Identify business trends and present insights.

Required Skills:
• Excel, Power BI/Tableau
• SQL queries and data extraction
• Data cleaning & reporting`,

    "Cloud Engineer": `We are looking for a Cloud Engineer to design, deploy, and maintain cloud infrastructure.
Responsibilities:
• Deploy and manage cloud resources on AWS/Azure.
• Implement CI/CD pipelines and automated infrastructure.
• Manage Docker & Kubernetes-based deployments.
• Monitor cloud usage, performance, and security.

Required Skills:
• AWS / Azure / GCP
• Linux administration
• Docker, Kubernetes, Terraform`,

    "DevOps Engineer": `We are hiring a DevOps Engineer to automate systems and streamline deployments.
Responsibilities:
• Build and maintain CI/CD pipelines.
• Manage containerized applications with Docker & Kubernetes.
• Implement automation scripts using Bash/Python.
• Monitor logs and system performance.

Required Skills:
• CI/CD – Jenkins, GitHub Actions
• Docker, Kubernetes
• Linux & networking basics`,

    "UI/UX Designer": `We are looking for a creative UI/UX Designer to design user-friendly and visually appealing digital experiences.
Responsibilities:
• Create wireframes, prototypes, and UI layouts.
• Conduct user research and usability testing.
• Collaborate closely with developers and product teams.

Required Skills:
• Figma, Adobe XD
• Wireframing & prototyping
• Visual design principles`,

    "Machine Learning Engineer": `We are hiring an ML Engineer to build and deploy AI-driven solutions.
Responsibilities:
• Develop, train, and optimize machine learning models.
• Build scalable data pipelines and ML workflows.
• Deploy models using cloud or container-based environments.

Required Skills:
• Python, TensorFlow/PyTorch
• ML Ops workflows, APIs
• Data preprocessing & feature engineering`,

    "Software Tester": `We are looking for a QA Tester to ensure product quality through manual and automated testing.
Responsibilities:
• Write and execute test cases.
• Perform manual, functional, and regression testing.
• Automate test scenarios using Selenium (optional).

Required Skills:
• Manual testing fundamentals
• Test case design & bug reporting
• API testing with Postman`,
  };

  const analyzeATS = async (resume, jd) => {
    const fd = new FormData();
    fd.append("resume_text", resume);
    fd.append("jd_text", jd);

    const res = await fetch(`${backend}/analyze_resume`, {
      method: "POST",
      body: fd
    });

    const data = await res.json();

    if (!res.ok || data.final_score === undefined) {
      throw new Error("ATS analysis failed");
    }

    return data;
  };


  const extractResume = async () => {
    if (!resumeFile) {
      alert("Please upload a resume first");
      return;
    }

    const fd = new FormData();
    fd.append("file", resumeFile);

    try {
      const res = await fetch(`${backend}/upload_resume`, {
        method: "POST",
        body: fd
      });

      const data = await res.json();
      setResumeText(data.resume_text || "");
    } catch {
      alert("Resume extraction failed");
    }
  };

  /* 
     LIVE PREVIEW SCORE
   */
  useEffect(() => {
    if (!resumeText || !jdText) return;

    const timer = setTimeout(async () => {
      try {
        const data = await analyzeATS(resumeText, jdText);
        setPreviewScore(data.final_score);
      } catch {
        setPreviewScore(null);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [resumeText, jdText]);

  /* 
     FINAL ANALYZE → SEND UP
   */
  const analyze = async () => {
    if (!resumeText || !jdText) {
      alert("Resume and Job Description required");
      return;
    }

    setLoading(true);
    try {
      const data = await analyzeATS(resumeText, jdText);
      onNext(data); // ✅ SEND TO APP.JS
    } catch {
      alert("ATS analysis failed");
    } finally {
      setLoading(false);
    }
  };

  /* 
     UI
  */
  return (
    <div className="page">
      <div className="analysis-container">

        {/* LEFT PANEL */}
        <div className="left-panel">
          <h3>Resume Extract</h3>

          <textarea
            value={resumeText}
            readOnly
            placeholder="Extracted resume appears here..."
          />

          <button onClick={extractResume}>Extract Resume</button>

          <h3 style={{ marginTop: 20 }}>Paste Job Description</h3>

          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste job description here..."
          />

          {previewScore !== null && (
            <p>Live Resume Score: <b>{previewScore}%</b></p>
          )}

          <div className="action-row">
            <button onClick={onPrev}>← Back</button>
            <button onClick={analyze}>
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <h3>Job Description Samples</h3>
          {Object.keys(JD_SAMPLES).map((role) => (
            <div
              key={role}
              className="sample-item"
              onClick={() => setJdText(JD_SAMPLES[role])}
            >
              {role}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
