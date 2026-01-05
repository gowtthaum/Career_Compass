import { useEffect, useState } from "react";

export default function JobRecommendations({ resumeText, onBack }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!resumeText) return;

    setLoading(true);

    fetch("http://127.0.0.1:8000/job-recommendation/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume_text: resumeText }),
    })
      .then((res) => res.json())
      .then((data) => setJobs(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Job recommendation error:", err))
      .finally(() => setLoading(false));
  }, [resumeText]);

  return (
    <div className="jobs-page">
      <h2 className="jobs-title">AI Recommended Jobs</h2>

      {loading && <p className="jobs-empty">Loading recommendations...</p>}

      {!loading && jobs.length === 0 && (
        <p className="jobs-empty">No matching jobs found.</p>
      )}

      <div className="jobs-grid">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-header">
              <h4>{job.title}</h4>

              <span
                className={`job-match ${
                  job.match_score >= 70
                    ? "high"
                    : job.match_score >= 40
                    ? "medium"
                    : "low"
                }`}
              >
                {job.match_score}% Match
              </span>
            </div>

            <p className="job-company">
              {job.company} • {job.location}
            </p>

            <a
              className="apply-link"
              href={job.apply_url}
              target="_blank"
              rel="noreferrer"
            >
              Apply →
            </a>
          </div>
        ))}
      </div>

      <div className="jobs-actions">
        <button className="secondary-btn" onClick={onBack}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
