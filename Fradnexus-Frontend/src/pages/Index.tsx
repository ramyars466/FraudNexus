import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Volume2, VolumeX } from "lucide-react";

import InterceptorFeed from "@/components/fraud/InterceptorFeed";
import LatencyMeter from "@/components/fraud/LatencyMeter";
import BiometricsRadar from "@/components/fraud/BiometricsRadar";
import NexusGraph from "@/components/fraud/NexusGraph";
import StatsBar, { AppStats } from "@/components/fraud/StatsBar";
import { GraphNode, initialNodes } from "@/components/fraud/NexusGraph";
import { Transaction } from "@/components/fraud/types";

import { processTransactionApi, streamLiveTransaction } from "@/api/fraudApi";

export default function Index() {
const [soundEnabled, setSoundEnabled] = useState(false);
const [scanlines, setScanlines] = useState(true);

// Centralized Live ML State
const [transactions, setTransactions] = useState<Transaction[]>([]);
const [stats, setStats] = useState<AppStats>({ approved: 12900, blocked: 398, challenged: 144, latency: 73 });
const [latency, setLatency] = useState(73);
const [biometrics, setBiometrics] = useState({ v1: 72, v2: 58, v3: 85 });
const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);

// The Master ML Polling Loop
useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const startTime = Date.now();
      const streamData = await streamLiveTransaction();
      
      const result = await processTransactionApi({
        card: streamData.card,
        merchant: streamData.merchant,
        amount: streamData.amount,
        device_id: streamData.device_id,
        features: streamData.features
      });
      
      const endTime = Date.now();
      const networkLatency = endTime - startTime;

      const tx: Transaction = {
        id: streamData.id,
        hash: streamData.card,
        amount: streamData.amount,
        currency: 'USD',
        merchant: streamData.merchant,
        country: streamData.country,
        riskScore: Math.round(result.risk_score * 100),
        status: result.decision === "BLOCK" ? 'blocked' : result.decision === "CHALLENGE" ? 'challenged' : 'approved',
        timestamp: Date.now(),
        ip: "192.168.1.1",
        deviceId: streamData.device_id
      };

      setTransactions(prev => [tx, ...prev].slice(0, 50));
      setLatency(networkLatency);
      
      // Update Stats explicitly based on actual decision
      setStats(prev => ({
        approved: prev.approved + (result.decision === "APPROVE" || result.decision === "APPROVED" ? 1 : 0),
        blocked: prev.blocked + (result.decision === "BLOCK" ? 1 : 0),
        challenged: prev.challenged + (result.decision === "CHALLENGE" ? 1 : 0),
        latency: Math.round((prev.latency + networkLatency) / 2)
      }));

      // Update Biometrics based on true feature math (V1, V2, V3)
      if (streamData.features && streamData.features.length >= 3) {
          setBiometrics({
              v1: streamData.features[0],
              v2: streamData.features[1],
              v3: streamData.features[2]
          });
      }

      // Update Graph dynamically to show actual properties of the stream!
      setNodes(prev => {
          let currentRisk: 'low' | 'medium' | 'high' | 'critical' = 'low';
          if (result.decision === "BLOCK") currentRisk = 'critical';
          else if (result.decision === "CHALLENGE") currentRisk = 'high';
          
          return prev.map(n => {
            if (n.id === 'n1') return { ...n, label: streamData.card, riskLevel: currentRisk };
            if (n.id === 'n3') return { ...n, label: streamData.device_id, riskLevel: currentRisk };
            if (n.id === 'n4') return { ...n, label: streamData.merchant, riskLevel: currentRisk };
            if (n.id === 'n8') return { ...n, riskLevel: currentRisk };
            return n;
          });
      });

    } catch (err) {
      console.error("Master Sync Loop Error:", err);
    }
  }, 2500);

  return () => clearInterval(interval);
}, []);

const playAlertSound = useCallback(() => {
if (!soundEnabled) return;


try {
  const audioCtx = new AudioContext();
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  oscillator.connect(gain);
  gain.connect(audioCtx.destination);

  oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    440,
    audioCtx.currentTime + 0.15
  );

  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + 0.2
  );

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.2);
} catch {}


}, [soundEnabled]);

const handleAction = useCallback(
(id: string, action: "approve" | "block") => {
if (action === "block") playAlertSound();
setTransactions(prev =>
  prev.map(tx =>
    tx.id === id
      ? { ...tx, status: action === "approve" ? "approved" : "blocked" }
      : tx
  )
);
},
[playAlertSound]
);

return ( <div className="min-h-screen p-4 md:p-6 relative">
{scanlines && <div className="scanline-overlay" />}

  {/* Header */}
  <motion.header
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center justify-between mb-6"
  >
    <div className="flex items-center gap-3">
      <div className="gradient-border rounded-lg p-2">
        <Shield className="w-6 h-6 neon-text-cyan" />
      </div>

      <div>
        <h1 className="text-lg font-bold tracking-tight neon-text-cyan">
          FraudNexus AI
        </h1>

        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          Global Fraud Monitor — Command Center
        </p>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setScanlines(!scanlines)}
        className="glass-panel px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
      >
        Scanlines {scanlines ? "ON" : "OFF"}
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="glass-panel p-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {soundEnabled ? (
          <Volume2 className="w-4 h-4 neon-text-cyan" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </motion.button>

      <div className="flex items-center gap-1.5 ml-2">
        <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
        <span className="text-[10px] font-mono text-muted-foreground uppercase">
          Live
        </span>
      </div>
    </div>
  </motion.header>

  {/* Stats */}
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="mb-6"
  >
    <StatsBar stats={stats} />
  </motion.div>

  {/* Main Grid */}
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-220px)] min-h-[500px]">
    {/* Interceptor Feed */}
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="lg:col-span-4 min-h-0"
    >
      <InterceptorFeed transactions={transactions} onAction={handleAction} />
    </motion.div>

    {/* Center Column */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="lg:col-span-5 flex flex-col gap-4 min-h-0"
    >
      <div className="flex-1 min-h-0">
        <NexusGraph nodes={nodes} />
      </div>
    </motion.div>

    {/* Right Column */}
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="lg:col-span-3 flex flex-col gap-4 min-h-0"
    >
      <LatencyMeter latency={latency} />
      <BiometricsRadar features={[biometrics.v1, biometrics.v2, biometrics.v3]} />
    </motion.div>
  </div>


</div>


);
}
