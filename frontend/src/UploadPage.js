import React, { useState } from "react";

export default function UploadPage({ onNext, onBack }) {

  const [dragging, setDragging] = useState(false);

const handleDrop = (e) => {
  e.preventDefault();
  setDragging(false);

  const droppedFile = e.dataTransfer.files[0];
  if (droppedFile) {
    onNext(droppedFile); // directly pass
  }
};

const handleFileSelect = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    onNext(selectedFile);
  }
};


  return (
    <div className="upload-page">

      {/* Back */}
      <div className="upload-back" onClick={onBack}>
        ← Back
      </div>

      <div className="upload-card">

        {/* Steps */}
        <div className="steps-row">
          <div className="step active">
            <span className="circle">1</span>
            <p>Upload Resume</p>
          </div>
          <div className="step">
            <span className="circle">2</span>
            <p>Add Job</p>
          </div>
          <div className="step">
            <span className="circle">3</span>
            <p>View Results</p>
          </div>
        </div>

        {/* Upload Box */}
        <div
          className={`upload-box ${dragging ? "drag-active" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            hidden
            id="resume-upload"
            onChange={handleFileSelect}
          />

          <p>
            Drag & Drop or{" "}
            <label htmlFor="resume-upload" className="link">
              Choose file
            </label>{" "}
            to upload
          </p>

          <small>.pdf or .docx file</small>
        </div>

        <div className="paste-text">Or paste resume text</div>
      </div>
    </div>
  );
}
