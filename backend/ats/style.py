WEAK_PHRASES = [
    "responsible for",
    "worked on",
    "helped",
    "involved in",
    "participated in"
]

def style_score(text: str) -> int:
    text = text.lower()
    penalties = sum(1 for p in WEAK_PHRASES if p in text)

    score = 100 - (penalties * 15)
    return max(50, score)
