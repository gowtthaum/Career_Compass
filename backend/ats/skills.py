import re

STOPWORDS = {
    "and", "or", "the", "a", "an", "to", "for", "with", "are", "is", "of"
}

SKILL_SYNONYMS = {
    "api": ["apis", "rest api", "restful api"],
    "aws": ["amazon web services"],
    "ml": ["machine learning"],
    "ai": ["artificial intelligence"],
    "sql": ["mysql", "postgresql"],
}

def normalize_skill(word: str) -> str:
    word = word.lower().strip()

    for base, variants in SKILL_SYNONYMS.items():
        if word == base or word in variants:
            return base

    return word


def extract_skills(text: str):
    words = re.findall(r"[a-zA-Z+#]+", text.lower())

    skills = set()
    for w in words:
        if len(w) < 3 or w in STOPWORDS:
            continue
        skills.add(normalize_skill(w))

    return skills


def compare_skills(resume_text: str, jd_text: str):
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(jd_text)

    matched = sorted(resume_skills & jd_skills)
    missing = sorted(jd_skills - resume_skills)

    match_score = int((len(matched) / max(len(jd_skills), 1)) * 100)

    return match_score, matched, missing
