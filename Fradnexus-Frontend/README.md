# FraudNexus AI - Frontend Command Center

FraudNexus AI is a real-time, data-driven Machine Learning Dashboard designed to intercept and evaluate streaming credit card transactions.

## 🚀 Tech Stack
This project is built from the ground up for performance and modern UI/UX:
- **Core**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion (dynamic animations), and shadcn-ui
- **Network**: Axios for consuming the Python Machine Learning endpoints
- **Data Visualization**: Custom SVG plotting for the Biometrics Radar and Nexus Fraud Ring

## 🛠️ How to Run Locally

If you cloned this repository, follow these steps to run the frontend independently:

```bash
# Navigate to the frontend directory
cd Fradnexus-Frontend

# Install the necessary dependencies
npm install

# Start the Vite development server with auto-reloading
npm run dev
```

## 🌐 Connecting to the ML Backend
This frontend is configured to intercept physical transactions processed by the `FraudNexus` Python/FastAPI backend.
Make sure your Python Uvicorn server is running locally on port 8000, or explicitly route the `VITE_API_URL` environment variable if deployed to a custom Cloud URL mapping!

---
*Built for absolute real-time fraud intervention.*
