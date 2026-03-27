def decision(score):

    if score < 0.30:
        return "APPROVE"

    elif score < 0.60:
        return "CHALLENGE"

    else:
        return "BLOCK"