import { Transaction, FraudNode } from './types';

const merchants = ['Amazon EU', 'Binance', 'Stripe Inc.', 'PayPal HK', 'Revolut', 'Coinbase', 'Shopify', 'Square', 'Adyen', 'Klarna'];
const countries = ['US', 'CN', 'RU', 'DE', 'NG', 'BR', 'GB', 'JP', 'IN', 'KR'];
const statuses: Transaction['status'][] = ['approved', 'blocked', 'challenged', 'pending'];

function randomHash(): string {
  return '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function randomIP(): string {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
}

let txCounter = 0;

export function generateTransaction(): Transaction {
  txCounter++;
  const riskScore = Math.random() * 100;
  let status: Transaction['status'];
  if (riskScore > 85) status = 'blocked';
  else if (riskScore > 60) status = 'challenged';
  else status = 'approved';

  return {
    id: `TX-${String(txCounter).padStart(6, '0')}`,
    hash: randomHash(),
    amount: Math.round(Math.random() * 50000 * 100) / 100,
    currency: ['USD', 'EUR', 'GBP', 'BTC', 'ETH'][Math.floor(Math.random() * 5)],
    merchant: merchants[Math.floor(Math.random() * merchants.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
    riskScore: Math.round(riskScore),
    status,
    timestamp: Date.now(),
    ip: randomIP(),
    deviceId: `DEV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  };
}

export function generateInitialTransactions(count = 12): Transaction[] {
  return Array.from({ length: count }, generateTransaction);
}

export const fraudNodes: FraudNode[] = [
  { id: 'n1', label: 'Card-7842', x: 0, y: 0, radius: 22, connections: ['n2', 'n3', 'n5'], riskLevel: 'critical' },
  { id: 'n2', label: 'IP-Cluster', x: 0, y: 0, radius: 18, connections: ['n1', 'n4'], riskLevel: 'high' },
  { id: 'n3', label: 'Dev-9F3A', x: 0, y: 0, radius: 15, connections: ['n1', 'n6'], riskLevel: 'high' },
  { id: 'n4', label: 'Email-Burner', x: 0, y: 0, radius: 14, connections: ['n2', 'n7'], riskLevel: 'medium' },
  { id: 'n5', label: 'Wallet-0xAB', x: 0, y: 0, radius: 16, connections: ['n1', 'n8'], riskLevel: 'critical' },
  { id: 'n6', label: 'Phone-Spoof', x: 0, y: 0, radius: 12, connections: ['n3'], riskLevel: 'medium' },
  { id: 'n7', label: 'Geo-Anomaly', x: 0, y: 0, radius: 13, connections: ['n4', 'n8'], riskLevel: 'low' },
  { id: 'n8', label: 'Proxy-VPN', x: 0, y: 0, radius: 17, connections: ['n5', 'n7'], riskLevel: 'high' },
];
