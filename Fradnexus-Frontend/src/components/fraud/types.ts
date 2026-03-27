export type TransactionStatus = 'approved' | 'blocked' | 'challenged' | 'pending';

export interface Transaction {
  id: string;
  hash: string;
  amount: number;
  currency: string;
  merchant: string;
  country: string;
  riskScore: number;
  status: TransactionStatus;
  timestamp: number;
  ip: string;
  deviceId: string;
}

export interface BiometricData {
  mouseJitter: number;
  keystrokeDynamics: number;
  deviceVelocity: number;
}

export interface FraudNode {
  id: string;
  label: string;
  x: number;
  y: number;
  radius: number;
  connections: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}
