import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldQuestion, Zap } from 'lucide-react';

export interface AppStats {
  approved: number;
  blocked: number;
  challenged: number;
  latency: number;
}

interface StatsBarProps {
  stats: AppStats;
}

export default function StatsBar({ stats }: StatsBarProps) {
  const statArray = [
    { label: 'Approved', value: stats.approved, suffix: '', icon: Shield, colorClass: 'neon-text-cyan' },
    { label: 'Blocked', value: stats.blocked, suffix: '', icon: ShieldAlert, colorClass: 'neon-text-red' },
    { label: 'Challenged', value: stats.challenged, suffix: '', icon: ShieldQuestion, colorClass: 'neon-text-amber' },
    { label: 'Avg Latency', value: stats.latency, suffix: 'ms', icon: Zap, colorClass: 'neon-text-green' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {statArray.map(stat => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            className="glass-panel p-3 flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Icon className={`w-5 h-5 ${stat.colorClass}`} />
            <div>
              <div className={`font-mono text-lg font-bold ${stat.colorClass}`}>
                {stat.value.toLocaleString()}{stat.suffix}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
