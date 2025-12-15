from ats.skills import compare_skills

def score_resume(resume_text, jd_text):
    skills_match, matched, missing = compare_skills(resume_text, jd_text)

    return {
    "final_score": final_score,
    "impact": impact_score,
    "brevity": brevity_score,
    "style": style_score,
    "skills_match": skills_match_score,
    "matched_skills": matched_skills,
    "missing_skills": missing_skills
}
