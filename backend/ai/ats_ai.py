import json
from ai.groq import groq_chat

def generate_ats_ai_suggestions(resume_text: str, jd_text: str):
    prompt = f"""
You are an ATS expert and interview coach.

Job Description:
{jd_text}

Candidate Resume:
{resume_text}

TASK:
1. Recommend 5–8 important skills the candidate should learn or improve.
2. Generate 6–10 interview questions strictly based on the Job Description.
3. Keep answers concise and practical.
4. Respond ONLY in valid JSON format like below:

{{
  "recommended_skills": ["skill1", "skill2"],
  "interview_questions": ["question1", "question2"]
}}
"""

    response = groq_chat(prompt)

    try:
        return json.loads(response)
    except Exception:
        return {
            "recommended_skills": [],
            "interview_questions": []
        }
