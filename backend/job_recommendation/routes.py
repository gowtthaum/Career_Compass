import sqlite3
import os
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/job-recommendation", tags=["Job Recommendation"])


def calculate_match_score(resume_text, skills):
    resume_words = set(resume_text.lower().split())
    skill_words = set(s.strip() for s in skills.lower().split(","))

    if not skill_words:
        return 0

    matched = resume_words.intersection(skill_words)
    return int((len(matched) / len(skill_words)) * 100)


@router.post("/recommend")
def recommend_jobs(payload: dict):
    try:
        resume_text = payload.get("resume_text", "").lower()

        DB_PATH = r"D:\CareerCompass\backend\jobs.db"


        print("📂 Using DB:", DB_PATH)

        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # 🔍 DEBUG: list tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        print("📋 Tables found:", tables)

        cursor.execute(
            "SELECT id, title, company, location, skills, apply_url FROM jobs"
        )
        rows = cursor.fetchall()
        conn.close()

        print("📊 Jobs fetched:", len(rows))

        results = []
        for row in rows:
            score = calculate_match_score(resume_text, row["skills"])
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
        return results

    except Exception as e:
        print("❌ JOB RECOMMEND ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))
