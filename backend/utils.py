COMMON_SKILLS = [
    "python", "java", "sql", "react", "javascript",
    "html", "css", "fastapi", "flask", "django",
    "api", "git", "testing", "manual testing"
]

def extract_skills(resume_text: str):
    resume_text = resume_text.lower()
    return [skill for skill in COMMON_SKILLS if skill in resume_text]
