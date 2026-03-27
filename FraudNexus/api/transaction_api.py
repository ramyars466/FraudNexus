from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import json
import numpy as np
import sys
import os
import pandas as pd
import random
import uuid

# Add parent directory to path to allow importing fraud_pipeline
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from fraud_pipeline import process_transaction

# Create API
app = FastAPI(title="FraudNexus ML API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
xgb_model = joblib.load(os.path.join(BASE_DIR, "models", "xgboost_model.pkl"))
cat_model = joblib.load(os.path.join(BASE_DIR, "models", "catboost_model.pkl"))

# Load feature list
with open(os.path.join(BASE_DIR, "models", "features.json")) as f:
    FEATURES = json.load(f)

# Load Dataset for Streaming (Optimized for Free Tier Cloud Hosting 5MB size)
df_creditcard = pd.read_csv(os.path.join(BASE_DIR, "data", "creditcard_sample.csv"))

# Mock metadata dictionaries for UI visual appeal
MERCHANTS = ['Amazon EU', 'Binance', 'Stripe Inc.', 'PayPal HK', 'Revolut', 'Coinbase', 'Shopify', 'Square', 'Adyen', 'Klarna']
COUNTRIES = ['US', 'CN', 'RU', 'DE', 'NG', 'BR', 'GB', 'JP', 'IN', 'KR']


class Transaction(BaseModel):
    Time: float
    Amount: float

class ProcessRequest(BaseModel):
    card: str
    merchant: str
    amount: float
    device_id: str
    features: list[float]  # Passed directly from the real dataset


@app.get("/")
def home():
    return {"message": "FraudNexus Backend Running 🚀"}


@app.post("/predict")
def predict(transaction: Transaction):

    # Create feature vector
    feature_vector = []

    for feature in FEATURES:
        if feature == "Time":
            feature_vector.append(transaction.Time)
        elif feature == "Amount":
            feature_vector.append(transaction.Amount)
        else:
            feature_vector.append(0)

    X = np.array([feature_vector])

    # Predict using both models
    xgb_prob = xgb_model.predict_proba(X)[0][1]
    cat_prob = cat_model.predict_proba(X)[0][1]

    # Ensemble prediction
    fraud_probability = float((xgb_prob + cat_prob) / 2)

    fraud = fraud_probability > 0.5

    return {
        "fraud": fraud,
        "fraud_probability": fraud_probability
    }

@app.post("/process")
def process(transaction: ProcessRequest):
    # Call the integrated fraud pipeline function
    result = process_transaction({
        "card": transaction.card,
        "merchant": transaction.merchant,
        "amount": transaction.amount,
        "device_id": transaction.device_id,
        "features": transaction.features
    })
    return result

@app.get("/stream")
def stream_transaction():
    """
    Pulls a single real row from creditcard.csv to evaluate against the ML models.
    Mocks the non-mathematical IDs so the Frontend dashboard stays visually pretty!
    """
    # Hackathon Demo Trick: 
    # Real dataset only has 0.17% fraud! We artificially boost fraud sampling to 25% 
    # so the dashboard actually shows action during presentations.
    if 'Class' in df_creditcard.columns and random.random() < 0.25:
        row = df_creditcard[df_creditcard['Class'] == 1].sample(1).iloc[0]
    else:
        row = df_creditcard.sample(1).iloc[0]
    
    # We iterate over FEATURES (which the models expect) to build the exact vector.
    # The models were trained on feature names like V1, V2... Time, Amount.
    # We map them exactly from the Pandas row!
    feature_vector = []
    for f in FEATURES:
        # Some feature arrays use "Amount", some use "amount" or "V1"
        if f in row:
            feature_vector.append(float(row[f]))
        else:
            feature_vector.append(0.0)

    # Note: real `Amount` feature is mathematically used evaluating ML model, 
    # but we ALSO pass it to the UI for visualization.
    amount_value = float(row['Amount']) if 'Amount' in row else 0.0

    return {
        "id": f"TX-{str(uuid.uuid4())[:8].upper()}",
        "card": f"CARD-{random.randint(1000, 9999)}",
        "merchant": random.choice(MERCHANTS),
        "device_id": f"DEV-{str(uuid.uuid4())[:6].upper()}",
        "country": random.choice(COUNTRIES),
        "amount": amount_value,
        "features": feature_vector
    }