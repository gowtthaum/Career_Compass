# ===============================
# Career Compass Backend (FINAL – Groq Version)
# ===============================

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from passlib.context import CryptContext
from pydantic import BaseModel
from dotenv import load_dotenv
from datetime import datetime
from fastapi.responses import FileResponse

import pdfplumber
import docx
import io
import uuid
import os

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

# 🔁 GROQ (instead of Gemini)
from groq import Groq
from ai.groq import groq_chat


# Your existing router
from ai.career_ai import router as career_ai_router

# ===============================
# ENV + APP INIT
# ===============================

load_dotenv()

app = FastAPI(
    title="Career Compass API",
    description="Backend API for Resume Analysis and Career Assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================
# GROQ CLIENT
# ===============================

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ===============================
# DATABASE
# ===============================

DATABASE_URL = "sqlite:///./users.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# ===============================
# PASSWORD HASHING
# ===============================

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(p: str):
    return pwd_context.hash(p[:72])

def verify_password(p: str, h: str):
    return pwd_context.verify(p[:72], h)

# ===============================
# USER MODEL
# ===============================

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True)
    password_hash = Column(String)

Base.metadata.create_all(bind=engine)

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
# AUTH MODELS
# ===============================

class RegisterModel(BaseModel):
    name: str
    email: str
    password: str

class LoginModel(BaseModel):
    email: str
    password: str

# ===============================
# AUTH ENDPOINTS
# ===============================

@app.post("/register")
def register(user: RegisterModel, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(400, "Email already registered")

    db.add(User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password)
    ))
    db.commit()

    return {"message": "Account created"}

@app.post("/login")
def login(user: LoginModel, db: Session = Depends(get_db)):
    found = db.query(User).filter(User.email == user.email).first()
    if not found or not verify_password(user.password, found.password_hash):
        raise HTTPException(400, "Invalid credentials")

    return {"name": found.name, "email": found.email}

# ===============================
# RESUME EXTRACTION
# ===============================

@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):
    contents = await file.read()
    text = ""

    try:
        if file.filename.lower().endswith(".pdf"):
            with pdfplumber.open(io.BytesIO(contents)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"

        elif file.filename.lower().endswith(".docx"):
            doc = docx.Document(io.BytesIO(contents))
            text = "\n".join(p.text for p in doc.paragraphs)

    except Exception as e:
        print("Resume extraction skipped:", e)

    if not text.strip():
        return {
            "resume_text": "",
            "message": "Automatic extraction not available. Please paste resume text manually."
        }

    return {"resume_text": text}

# ===============================
# ATS ANALYSIS (UNCHANGED)
# ===============================

SKILLS = [
    "python","java","javascript","react","node",
    "sql","aws","docker","kubernetes","linux","ci/cd"
]

@app.post("/analyze_resume")
def analyze_resume(
    resume_text: str = Form(...),
    jd_text: str = Form(...)
):
    resume = resume_text.lower()
    jd = jd_text.lower()

    resume_skills = [s for s in SKILLS if s in resume]
    jd_skills = [s for s in SKILLS if s in jd]

    matched = list(set(resume_skills) & set(jd_skills))
    missing = list(set(jd_skills) - set(resume_skills))

    skills_score = int(len(matched) / max(len(jd_skills), 1) * 100)

    breakdown = {
        "impact": 70,
        "brevity": 85,
        "style": 80,
        "skills_match": skills_score
    }

    final_score = int(
        breakdown["impact"] * 0.2 +
        breakdown["brevity"] * 0.2 +
        breakdown["style"] * 0.2 +
        breakdown["skills_match"] * 0.4
    )

    return {
        "final_score": final_score,
        "impact": breakdown["impact"],
        "brevity": breakdown["brevity"],
        "style": breakdown["style"],
        "skills_match": breakdown["skills_match"],
        "matched_skills": matched,
        "missing_skills": missing
    }

# ===============================
# ATS PDF EXPORT (UNCHANGED)
# ===============================

@app.post("/export-ats-pdf")
def export_ats_pdf(data: dict):
    file_name = f"ATS_Report_{uuid.uuid4().hex}.pdf"
    file_path = os.path.join(os.getcwd(), file_name)

    c = canvas.Canvas(file_path, pagesize=A4)
    y = A4[1] - 40

    def draw(text, size=11):
        nonlocal y
        c.setFont("Helvetica", size)
        c.drawString(40, y, text)
        y -= size + 6

    draw("CAREER COMPASS – ATS REPORT", 16)
    draw(f"Generated on: {datetime.now().strftime('%d %b %Y %H:%M')}", 10)
    y -= 10

    draw(f"Final Resume Score: {data.get('final_score', 0)}%", 14)
    draw(f"Impact Score: {data.get('impact', 0)}")
    draw(f"Brevity Score: {data.get('brevity', 0)}")
    draw(f"Style Score: {data.get('style', 0)}")
    draw(f"Skills Match Score: {data.get('skills_match', 0)}")

    y -= 10
    draw("Matched Skills:", 13)
    for s in data.get("matched_skills", []):
        draw(f"- {s}")

    y -= 10
    draw("Missing Skills:", 13)
    for s in data.get("missing_skills", []):
        draw(f"- {s}")

    c.showPage()
    c.save()

    return FileResponse(
        path=file_path,
        filename="CareerCompass_ATS_Report.pdf",
        media_type="application/pdf"
    )

# ===============================
# CAREER AI (Groq replacement)
# ===============================

class CareerAIRequest(BaseModel):
    message: str
@app.post("/ask_career_ai")
async def ask_career_ai(
    message: str = Form(...),
    file: UploadFile = File(None)
):
    resume_text = ""

    # ✅ Extract PDF text if uploaded
    if file and file.filename.lower().endswith(".pdf"):
        contents = await file.read()
        try:
            with pdfplumber.open(io.BytesIO(contents)) as pdf:
                for page in pdf.pages:
                    resume_text += (page.extract_text() or "") + "\n"
        except Exception as e:
            print("PDF read error:", e)

    # ✅ Build AI prompt
    prompt = message
    if resume_text:
        prompt = f"""
You are a career assistant.

Here is the user's resume:
{resume_text[:4000]}

User question:
{message}

Give clear, professional advice.
"""

    # 🔹 Call Groq (or your AI function)
    reply = groq_chat(prompt)

    return {"reply": reply}
# ===============================
# ROUTERS + HEALTH
# ===============================

app.include_router(career_ai_router)

@app.get("/")
def root():
    return {"status": "Career Compass backend running"}
