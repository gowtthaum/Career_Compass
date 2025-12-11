# ===============================
#  Career Compass Backend (FIXED)
# ===============================

from fastapi import FastAPI, UploadFile, File, Form, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from passlib.context import CryptContext
from pydantic import BaseModel
from pypdf import PdfReader
from docx import Document
import re


# ===============================
# DATABASE (SQLite)
# ===============================
DATABASE_URL = "sqlite:///./users.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ===============================
# PASSWORD HASHING (FIXED)
# ===============================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")  # Using correct bcrypt backend


def hash_password(password: str):
    password = password[:72]  # bcrypt max length fix
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str):
    plain = plain[:72]  # ensure safe length
    return pwd_context.verify(plain, hashed)


# ===============================
# USER TABLE
# ===============================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)


Base.metadata.create_all(bind=engine)


# ===============================
# FASTAPI + CORS
# ===============================
app = FastAPI(title="Career Compass Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===============================
# DB DEPENDENCY
# ===============================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ===============================
# MODELS
# ===============================
class RegisterModel(BaseModel):
    name: str
    email: str
    password: str


class LoginModel(BaseModel):
    email: str
    password: str


# ===============================
# REGISTER ENDPOINT (FIXED)
# ===============================
@app.post("/register")
def register(user: RegisterModel, db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.email == user.email).first()
    if exists:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed
    )

    db.add(new_user)
    db.commit()

    return {"message": "Account created successfully"}


# ===============================
# LOGIN ENDPOINT (FIXED)
# ===============================
@app.post("/login")
def login(user: LoginModel, db: Session = Depends(get_db)):
    found = db.query(User).filter(User.email == user.email).first()

    if not found:
        raise HTTPException(status_code=400, detail="Email not found")

    if not verify_password(user.password, found.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect password")

    return {
        "message": "Login successful",
        "name": found.name,
        "email": found.email
    }


# ===============================
# HOME ROUTE
# ===============================
@app.get("/")
def home():
    return {"message": "Career Compass backend running!"}


# ===============================
# RESUME PROCESSING
# ===============================
MASTER_SKILLS = [
    "python","java","javascript","react","node","html","css","sql","mysql","mongodb",
    "docker","kubernetes","aws","azure","linux","api","git","github","testing","selenium",
    "tensorflow","pytorch","tableau","power bi","devops","ci/cd"
]


def extract_text_from_file(file: UploadFile) -> str:
    filename = file.filename.lower()

    try:
        if filename.endswith(".pdf"):
            reader = PdfReader(file.file)
            return "\n".join([p.extract_text() or "" for p in reader.pages])

        elif filename.endswith(".docx") or filename.endswith(".doc"):
            doc = Document(file.file)
            return "\n".join([p.text for p in doc.paragraphs])

        return ""

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"File processing failed: {e}")


def extract_skills(text: str):
    t = (text or "").lower()
    return sorted({skill for skill in MASTER_SKILLS if skill in t})


@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):
    text = extract_text_from_file(file)
    skills = extract_skills(text)
    return {"status": "success", "resume_text": text, "resume_skills": skills}


# ===============================
# MATCH RESUME & JD
# ===============================
def fast_match(resume_text: str, jd_text: str):
    r = (resume_text or "").lower()
    j = (jd_text or "").lower()

    resume_words = set(re.findall(r"\b[a-z0-9\+\-\.\_#]+\b", r))
    jd_words = set(re.findall(r"\b[a-z0-9\+\-\.\_#]+\b", j))

    overlap = sorted(list(resume_words & jd_words))
    missing_words = sorted(list(jd_words - resume_words))

    score = int((len(overlap) / max(1, len(jd_words))) * 100)

    rating = (
        "Excellent Match" if score >= 80 else
        "Good Match" if score >= 60 else
        "Average Match" if score >= 40 else
        "Weak Match"
    )

    resume_skills = extract_skills(r)
    jd_skills = extract_skills(j)
    overlap_skills = sorted(set(resume_skills) & set(jd_skills))
    missing_skills = sorted(set(jd_skills) - set(resume_skills))

    return {
        "match_score": score,
        "rating": rating,
        "similarity": f"{score}%",
        "missing_words": missing_words[:50],
        "overlap_words": overlap[:50],
        "resume_skills": resume_skills,
        "jd_skills": jd_skills,
        "overlap_skills": overlap_skills,
        "missing_skills": missing_skills
    }


@app.post("/match")
async def match(resume_text: str = Form(...), jd_text: str = Form(...)):
    return fast_match(resume_text, jd_text)


# ===============================
# AI SUGGESTIONS
# ===============================
@app.post("/ai_suggest")
async def ai_suggest(req: Request):
    body = await req.json()
    resume_text = body.get("resume_text", "")
    jd_text = body.get("jd_text", "")

    r_skills = extract_skills(resume_text)
    j_skills = extract_skills(jd_text)
    missing = [s for s in j_skills if s not in r_skills]

    if not j_skills:
        return {"ai_suggestion": "Cannot detect skills in JD — add skill sections."}

    if not missing:
        return {"ai_suggestion": "Great! Your resume covers all essential JD skills."}

    return {"ai_suggestion": f"Missing important skills: {', '.join(missing)}"}


# ===============================
# CAREER AI BOT
# ===============================
@app.post("/ask_career_ai")
async def ask_ai(req: Request):
    q = (await req.json()).get("question", "").lower()

    if not q.strip():
        return {"reply": "Please enter a question."}

    if "improve" in q:
        return {"reply": "Use measurable achievements and JD keywords to improve your resume."}

    if "skills" in q:
        return {"reply": "Focus on hands-on projects and JD-specific tools."}

    return {"reply": "Provide resume + JD for more accurate advice."}
