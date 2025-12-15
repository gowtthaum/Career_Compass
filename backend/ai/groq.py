import os
from groq import Groq

def groq_chat(
    prompt: str,
    system_prompt: str = "You are a professional career assistant."
) -> str:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY missing")

    client = Groq(api_key=api_key)

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",  # ✅ UPDATED MODEL
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        temperature=0.6,
        max_tokens=512
    )

    return response.choices[0].message.content.strip()
