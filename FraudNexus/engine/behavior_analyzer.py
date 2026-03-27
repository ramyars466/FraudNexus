def behavior_risk(amount, avg_amount):

    if amount > avg_amount * 4:
        return 0.9   # very suspicious

    elif amount > avg_amount * 2:
        return 0.6

    return 0.1