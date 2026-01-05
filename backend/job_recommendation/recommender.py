import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
JOB_FILE = BASE_DIR / "data" / "jobs.json"

KNOWN_SKILLS = [
    "python", "sql", "react", "fastapi",
    "javascript", "html", "css", "git",
    "excel", "power bi"
]

def extract_skills(text: str):
    text = text.lower()
    return [skill for skill in KNOWN_SKILLS if skill in text]

def recommend_jobs(resume_text: str):
    with open(JOB_FILE, "r", encoding="utf-8") as f:
        jobs = json.load(f)

    resume_skills = extract_skills(resume_text)
    print("RESUME SKILLS:", resume_skills)

    results = []

    for job in jobs:
        job_skills = [s.lower() for s in job.get("skills", [])]
        matched = set(resume_skills) & set(job_skills)

        if not job_skills:
            continue

        score = int((len(matched) / len(job_skills)) * 100)

        if score >= 20:  # fresher-friendly threshold
            results.append({
                **job,
                "match_score": score,
                "matched_skills": list(matched)
            })

    return results
