import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function LatencyMeter({ latency }: { latency: number }) {
  const [history, setHistory] = useState<number[]>([latency]);

  useEffect(() => {
    setHistory(prev => [...prev.slice(-30), latency]);
  }, [latency]);

  const maxAngle = 240;
  const startAngle = -210;
  const normalizedLatency = Math.min(latency / 300, 1);
  const needleAngle = startAngle + normalizedLatency * maxAngle;
  const radius = 70;
  const cx = 90;
  const cy = 90;

  const getColor = (l: number) => {
    if (l <= 100) return 'hsl(var(--neon-cyan))';
    if (l <= 200) return 'hsl(var(--neon-amber))';
    return 'hsl(var(--neon-red))';
  };

  const color = getColor(latency);

  // Arc path
  const arcPath = (startDeg: number, endDeg: number, r: number) => {
    const s = (startDeg * Math.PI) / 180;
    const e = (endDeg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(s);
    const y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e);
    const y2 = cy + r * Math.sin(e);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  const needleRad = (needleAngle * Math.PI) / 180;
  const nx = cx + (radius - 12) * Math.cos(needleRad);
  const ny = cy + (radius - 12) * Math.sin(needleRad);

  return (
    <div className="glass-panel p-4 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-2 self-start">
        <Activity className="w-4 h-4 neon-text-cyan" />
        <h2 className="text-sm font-semibold uppercase tracking-widest neon-text-cyan">Latency</h2>
      </div>
      <svg viewBox="0 0 180 120" className="w-full max-w-[220px]">
        {/* Background arc */}
        <path
          d={arcPath(-210, 30, radius)}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Active arc */}
        <motion.path
          d={arcPath(-210, -210 + normalizedLatency * maxAngle, radius)}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          initial={false}
          animate={{ pathLength: 1 }}
        />
        {/* Tick marks */}
        {[0, 50, 100, 150, 200, 250, 300].map((val) => {
          const angle = ((-210 + (val / 300) * maxAngle) * Math.PI) / 180;
          const inner = radius - 8;
          const outer = radius + 2;
          return (
            <g key={val}>
              <line
                x1={cx + inner * Math.cos(angle)}
                y1={cy + inner * Math.sin(angle)}
                x2={cx + outer * Math.cos(angle)}
                y2={cy + outer * Math.sin(angle)}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
              />
              <text
                x={cx + (radius + 12) * Math.cos(angle)}
                y={cy + (radius + 12) * Math.sin(angle)}
                fill="hsl(var(--muted-foreground))"
                fontSize="6"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="var(--font-mono)"
              >
                {val}
              </text>
            </g>
          );
        })}
        {/* Needle */}
        <motion.line
          x1={cx}
          y1={cy}
          animate={{ x2: nx, y2: ny }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
        <circle cx={cx} cy={cy} r="4" fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
        {/* Center text */}
        <text x={cx} y={cy + 25} textAnchor="middle" fill={color} fontSize="18" fontFamily="var(--font-mono)" fontWeight="bold">
          {latency}
        </text>
        <text x={cx} y={cy + 34} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="6" fontFamily="var(--font-mono)">
          ms
        </text>
      </svg>
      {/* Sparkline */}
      <div className="w-full h-8 mt-2">
        <svg viewBox={`0 0 ${history.length} 30`} className="w-full h-full" preserveAspectRatio="none">
          <polyline
            points={history.map((v, i) => `${i},${30 - (v / 300) * 28}`).join(' ')}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity="0.6"
          />
        </svg>
      </div>
    </div>
  );
}
