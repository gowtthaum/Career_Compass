// ResultsHistoryModal.js
import React from "react";


export default function ResultsHistoryModal({
  results,
  onClose,
  onView,
  onDelete
}) {
  return (
    <div className="results-modal-overlay">
      <div className="results-modal">
        <div className="results-modal-header">
          <h3> Resume Results History</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="results-modal-body">
          {results.length === 0 ? (
            <p className="empty-text">No  results found.</p>
          ) : (
            results.map((item) => (
              <div key={item.id} className="result-card">
                <div className="result-info">
                  <p><strong>Date:</strong> {item.date}</p>
                  <p>
                    <strong>Final ATS Score:</strong>{" "}
                    <span className="score">{item.final_score}%</span>
                  </p>
                </div>

                <div className="result-actions">
                  <button
                    className="view-btn"
                    onClick={() => onView(item)}
                  >
                    View
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => onDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="results-modal-footer">
          <button className="close-footer-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
