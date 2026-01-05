import sqlite3
from fastapi import APIRouter


router = APIRouter(prefix="/job-recommendation", tags=["Job Recommendation"])


def calculate_match_score(resume_text, required_skills):
    resume_words = set(resume_text.lower().split())
    skills = set(skill.strip() for skill in required_skills.lower().split(","))

    if not skills:
        return 0

    matched = resume_words.intersection(skills)
    return int((len(matched) / len(skills)) * 100)


@router.post("/recommend")
def recommend_jobs(payload: dict):
    resume_text = payload.get("resume_text", "")

    conn = sqlite3.connect("user.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM jobs")
    rows = cursor.fetchall()

    results = []
    for row in rows:
        score = calculate_match_score(resume_text, row["required_skills"])
        if score > 0:
            results.append({
                "id": row["id"],
                "title": row["title"],
                "company": row["company"],
                "location": row["location"],
                "match_score": score,
                "apply_url": row["apply_url"]
            })

    results.sort(key=lambda x: x["match_score"], reverse=True)
    conn.close()

    return results
