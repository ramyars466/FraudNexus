// Dynamic routing for Free Tier Deployments
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function processTransactionApi(data: { card: string, merchant: string, amount: number, device_id: string, features?: number[] }) {

    const response = await fetch(`${API_BASE_URL}/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  
    return response.json();
}

export async function streamLiveTransaction() {
    const response = await fetch(`${API_BASE_URL}/stream`);
    return response.json();
}