from fastapi import APIRouter
from ai.groq import groq_chat

router = APIRouter(prefix="/career-ai", tags=["Career AI"])

@router.post("/ask")
def ask_career_ai(data: dict):
    reply = groq_chat(
        data["message"],
        system_prompt="You are a professional career assistant."
    )
    return {"reply": reply}
