# 🕵️ FraudNexus AI

> **Advanced real-time credit card fraud detection powered by dual gradient boosting models, live transaction streaming, and an intelligent neon-clad React dashboard.**

🌐 **Live Demo:** [https://fraud-nexus.vercel.app](https://fraud-nexus.vercel.app)
🔗 **Repository:** [https://github.com/ramyars466/FraudNexus](https://github.com/ramyars466/FraudNexus)

---

## 📌 What is FraudNexus AI?

FraudNexus AI is a full-stack, production-grade Machine Learning system built to **detect, track, and intercept fraudulent credit card transactions dynamically — in real time**.

Unlike static fraud analysis tools, FraudNexus operates as a live interception pipeline: transactions stream through a Python ML backend powered by **XGBoost** and **CatBoost** ensemble predictions, and the results surface instantly on a React frontend featuring biometric PCA visualization, a live transaction feed, and an intelligent fraud origin network graph.

Built on Kaggle's real-world Credit Card Fraud Dataset, FraudNexus closes the gap between academic fraud modeling and production-ready fraud intelligence.

---

## 🌟 Core Features

### 🔴 Interceptor Feed
A live-streaming transaction panel that ingests credit card transaction records and evaluates fraud probability in real time. Each transaction is scored mathematically and classified as legitimate or fraudulent with a confidence score.

### 🧬 Biometrics Radar
An interactive radar/scatter visualization that plots the **principal PCA components (V1, V2, V3)** of each transaction — the same latent behavioral fingerprints the ML model uses. This gives analysts a visual biometric trace of each transaction's anomaly signature embedded directly within the data stream.

### 🕸️ Nexus Graph
An intelligent, interactive network graph that maps the **origin and propagation nodes** of each transaction — including:
- **Merchant node** — the point-of-sale origin
- **Device ID node** — the device fingerprint
- **Card node** — the payment instrument

When the model detects anomalous behavior, affected nodes light up as **critical alerts**, visually tracing fraud proxies and exposing suspicious clusters in the transaction network.

### ⚡ Dual Model Gradient Boosting Engine
FraudNexus employs a synchronized **XGBoost + CatBoost** dual prediction pipeline for higher precision fraud scoring:
- Both models independently evaluate each transaction
- Predictions are combined/compared for a final fraud verdict
- Trained natively on Kaggle's Credit Card Fraud Detection dataset (284,807 transactions, 0.172% fraud rate)

---

## 🏗️ Architecture

FraudNexus/
│
├── api/ # Python FastAPI backend (ML pipeline)
│ ├── transaction_api.py # Main FastAPI app & transaction endpoints
│ ├── models/
│ │ ├── xgboost_model.pkl # Trained XGBoost fraud classifier
│ │ └── catboost_model.pkl # Trained CatBoost fraud classifier
│ └── requirements.txt # Backend Python dependencies
│
├── FraudNexus-Frontend/ # React frontend (Vite)
│ ├── src/
│ │ ├── components/
│ │ │ ├── InterceptorFeed.jsx # Live transaction stream panel
│ │ │ ├── BiometricsRadar.jsx # PCA V1/V2/V3 scatter visualization
│ │ │ └── NexusGraph.jsx # Fraud origin network graph
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── .env # VITE_API_URL environment config
│ └── package.json
│
└── README.md

text

---

## 💻 Local Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

---

### 1️⃣ Backend — Python ML API

```bash
# Clone the repository
git clone https://github.com/ramyars466/FraudNexus.git
cd FraudNexus/api

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn transaction_api:app --reload
```

The backend will start at `http://localhost:8000`.

**Key API Endpoints:**

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/predict` | Submit a transaction for fraud scoring |
| `GET` | `/stream` | Stream live transaction evaluations |
| `GET` | `/health` | API health check |

---

### 2️⃣ Frontend — React Dashboard

```bash
cd FraudNexus-Frontend

# Install dependencies
npm install

# Configure API URL (create .env file)
echo "VITE_API_URL=http://localhost:8000" > .env

# Start the development server
npm run dev
```

The frontend will launch at `http://localhost:5173`.

---

## 🚀 Cloud Deployment

FraudNexus is structured for Free-Tier cloud deployment with zero configuration overhead.

### Backend → Render

The FastAPI backend binds gracefully to dynamic ports for PaaS architectures:

```python
# transaction_api.py handles dynamic port binding
port = int(os.environ.get("PORT", 8000))
```

**Render Deployment Steps:**
1. Connect your GitHub repo to [Render](https://render.com)
2. Set **Build Command:** `pip install -r requirements.txt`
3. Set **Start Command:** `uvicorn transaction_api:app --host 0.0.0.0 --port $PORT`
4. Add environment variables as needed

### Frontend → Vercel

The React frontend uses `VITE_API_URL` for dynamic API routing via global CDN:

**Vercel Deployment Steps:**
1. Import repo to [Vercel](https://vercel.com)
2. Set **Framework Preset:** Vite
3. Add Environment Variable: `VITE_API_URL = https://your-render-backend.onrender.com`
4. Deploy — Vercel handles build and CDN routing automatically

---

## 🤖 ML Model Details

### Dataset
- **Source:** [Kaggle Credit Card Fraud Detection Dataset](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud)
- **Size:** 284,807 transactions
- **Fraud Rate:** ~0.172% (highly imbalanced)
- **Features:** 28 PCA-transformed components (V1–V28) + `Time` + `Amount`

### Models

| Model | Strengths in Fraud Detection |
|---|---|
| **XGBoost** | Handles class imbalance well via `scale_pos_weight`; fast inference |
| **CatBoost** | Robust to noisy features; strong on tabular data without extensive tuning |

### Dual Prediction Pipeline
Transaction Input
│
├──► XGBoost ──► Fraud Score A ──┐
│ ├──► Final Fraud Verdict
└──► CatBoost ──► Fraud Score B ──┘

text

Both models independently score each transaction. The ensemble output determines the final classification and triggers UI alerts when fraud probability exceeds the defined threshold.

### Handling Class Imbalance
The Kaggle fraud dataset is severely imbalanced (~99.8% legitimate). FraudNexus addresses this via:
- SMOTE oversampling or `scale_pos_weight` tuning
- Threshold optimization (precision-recall tradeoff instead of accuracy)
- Evaluation using **AUC-ROC**, **Precision**, **Recall**, and **F1-Score**

---

## 📊 Biometrics Radar — PCA Explained

The 28 PCA components (V1–V28) in the dataset are anonymized behavioral signals derived from raw transaction data (merchant category, location, time patterns, device fingerprints, etc.) via Principal Component Analysis.

FraudNexus visualizes the **top 3 components (V1, V2, V3)** which carry the highest variance and are the strongest fraud discriminators. In the Biometrics Radar:

- **Legitimate transactions** cluster tightly near the origin
- **Fraudulent transactions** appear as outliers far from the cluster centroid
- Each dot represents a live transaction colored by its fraud verdict

---

## 🕸️ Nexus Graph — Fraud Network Mapping

The Nexus Graph models each transaction as a set of connected nodes:
[Card ID] ──── [Transaction] ──── [Merchant ID]
│
[Device ID]

text

- **Green nodes** = verified legitimate activity
- **Red/pulsing nodes** = flagged anomalous nodes
- **Edge thickness** = transaction frequency between nodes
- **Alert clusters** = multiple flagged transactions originating from the same node (proxy/card cloning indicator)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| ML Models | XGBoost, CatBoost, scikit-learn |
| Backend API | Python, FastAPI, Uvicorn |
| Data Processing | Pandas, NumPy |
| Model Serialization | joblib / pickle |
| Frontend | React (Vite), JavaScript |
| Visualization | D3.js / Recharts / Custom Canvas |
| Backend Hosting | Render (Free Tier) |
| Frontend Hosting | Vercel |
| Dataset | Kaggle Credit Card Fraud Detection |

---

## 📁 Environment Variables

### Backend (`api/.env`)
```env
PORT=8000
MODEL_PATH=models/
```

### Frontend (`FraudNexus-Frontend/.env`)
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

## 📄 License

This project is developed for academic, research, and innovation purposes.
For commercial licensing or collaboration inquiries, contact the author.

---

> *FraudNexus AI — Intercept. Visualize. Neutralize.*
