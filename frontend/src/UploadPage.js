// UploadPage.js
import React, { useState } from "react";

export default function UploadPage({ onNext }) {
  const [file, setFile] = useState(null);

  return (
    <div className="upload-wrapper">
      <div className="upload-card">
        <div className="title">Upload Your Resume</div>
        <div className="subtitle">PDF & DOCX only • Max 5MB</div>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input"
        />

        <button
          className="primary-btn"
          onClick={() => {
            if (!file) return alert("Please select a resume file.");
            onNext(file);
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
