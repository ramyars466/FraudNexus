def explain_transaction(amount, avg_amount, device_risk_score, graph_score):

    reasons = []

    if amount > avg_amount * 2:
        reasons.append("Transaction amount unusually high")

    if device_risk_score > 0.5:
        reasons.append("New or unrecognized device")

    if graph_score > 0.5:
        reasons.append("Merchant appears in suspicious transaction cluster")

    if not reasons:
        reasons.append("Transaction appears normal")

    return reasons