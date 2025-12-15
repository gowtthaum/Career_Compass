def brevity_score(text: str) -> int:
    word_count = len(text.split())

    if word_count < 450:
        return 95
    elif word_count < 650:
        return 80
    elif word_count < 900:
        return 65
    else:
        return 50
