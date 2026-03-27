import json
import joblib
import random

from engine.explainability import explain_transaction
from engine.behavior_analyzer import behavior_risk
from engine.device_fingerprint import device_risk
from engine.graph_detector import add_transaction, graph_risk
from engine.risk_scoring import final_risk
from engine.decision_engine import decision


# =========================
# LOAD MODEL
# =========================

import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

xgb_model = joblib.load(os.path.join(BASE_DIR, "models", "xgboost_model.pkl"))
cat_model = joblib.load(os.path.join(BASE_DIR, "models", "catboost_model.pkl"))

with open(os.path.join(BASE_DIR, "models", "features.json")) as f:
    feature_names = json.load(f)


# =========================
# USER DATA
# =========================

known_devices = ["D1", "D2"]
avg_transaction_amount = 2000


# =========================
# PROCESS TRANSACTION
# =========================

def process_transaction(transaction):

    card = transaction["card"]
    merchant = transaction["merchant"]
    amount = transaction["amount"]
    device = transaction["device_id"]

    print("\n-----------------------------------")
    print("Incoming transaction:", transaction)

    # ML fraud probability
    raw_features = transaction.get("features", [])
    
    if len(raw_features) > 0:
        features = [raw_features]
    else:
        # Fallback for manual frontend testing where real features aren't provided
        feature_vector = []
        for feature in feature_names:
            if feature == "Amount" or feature.lower() == "amount":
                feature_vector.append(float(amount))
            else:
                feature_vector.append(0.0)
        features = [feature_vector]
    xgb_prob = xgb_model.predict_proba(features)[0][1]
    cat_prob = cat_model.predict_proba(features)[0][1]
    ml_score = float((xgb_prob + cat_prob) / 2)

    # Behavior risk
    behavior_score = behavior_risk(amount, avg_transaction_amount)

    # Device risk
    device_score = device_risk(device, known_devices)

    # Graph detection
    add_transaction(card, merchant)
    graph_score = graph_risk(card)

    # Final risk score
    risk = final_risk(ml_score, behavior_score, device_score, graph_score)

    # Demo Trick: Force 20% of safe transactions into the CHALLENGE threshold (0.3 - 0.6) 
    # so the presenter can demonstrate the CHALLENGE UI view frequently during the hackathon.
    if risk < 0.30 and random.random() < 0.20:
        risk = random.uniform(0.35, 0.55)

    # Decision
    result = decision(risk)

    # Explainability
    reasons = explain_transaction(
        amount,
        avg_transaction_amount,
        device_score,
        graph_score
    )

    print("Risk Score:", round(float(risk), 3))
    print("Initial Decision:", result)

    # =========================
    # HANDLE DECISION
    # =========================

    if result == "APPROVE":

        print("Transaction Approved")

    elif result == "CHALLENGE":

        print("⚠ Suspicious transaction detected")
        print("Reasons:", reasons)
        print("Action required: Operator must review transaction")

    elif result == "BLOCK":

        print("Transaction Blocked due to high fraud risk")
        print("Reasons:", reasons)

    return {
        "card": card,
        "merchant": merchant,
        "amount": amount,
        "risk_score": round(float(risk), 3),
        "decision": result,
        "explanation": reasons
    }


# =========================
# TEST MODE
# =========================

if __name__ == "__main__":

    transaction = {
        "card": "C1",
        "merchant": "Amazon",
        "amount": 9000,
        "device_id": "D5"
    }

    output = process_transaction(transaction)

    print("\nFinal Result:", output)