# FraudNexus AI

FraudNexus AI is an advanced, full-stack Machine Learning project designed to detect, track, and intercept fraudulent credit card transactions dynamically in real-time.

## 🌟 Features
- **Interceptor Feed**: Streams real credit card transaction data evaluating the risk mathematically.
- **Biometrics Radar**: Plots live absolute PCA variables (V1, V2, V3) natively embedded within transaction traces.
- **Nexus Graph**: An intelligent tracking network that highlights the origin nodes (Merchant, Device ID, Card) and triggers critical alerts when anomalous behaviors occur mapping active proxies.
- **Data-Driven Backend**: Employs synchronized gradient boosted predictions using both **XGBoost** and **CatBoost** models natively analyzing Kaggle's Credit Card Dataset.

## 💻 Architecture Setup

### 1. The Backend (Python ML Pipeline)
The backend intercepts incoming transaction streams and executes gradient boosting model evaluations instantly.

```bash
cd FraudNexus/api
pip install -r requirements.txt
uvicorn transaction_api:app --reload
```

### 2. The Frontend (React Dashboard)
A sleek, neon-clad UI rendering visual cues strictly synchronized with physical ML backend results.

```bash
cd Fradnexus-Frontend
npm install
npm run dev
```

## 🚀 Cloud Deployment
FraudNexus AI is mathematically compressed and structured to successfully deploy on Free-Tier cloud infrastructure. 
- The backend API binds gracefully to dynamic ports for PaaS architectures like **Render**.
- The frontend supports environment mappings (`VITE_API_URL`) allowing global CDNs like **Vercel** to route API traffic securely.
