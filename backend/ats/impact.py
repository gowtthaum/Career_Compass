import re

ACTION_VERBS = [
    "developed", "designed", "implemented", "built",
    "created", "optimized", "improved", "led",
    "managed", "automated", "deployed"
]

def impact_score(text: str) -> int:
    text = text.lower()

    metrics = len(re.findall(r"\d+%|\d+\+", text))
    verbs = sum(1 for v in ACTION_VERBS if v in text)

    score = (metrics * 15) + (verbs * 5)
    return min(100, score)
