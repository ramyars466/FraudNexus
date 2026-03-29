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

> *FraudNexus AI — Intercept. Visualize. Neutralize.*
