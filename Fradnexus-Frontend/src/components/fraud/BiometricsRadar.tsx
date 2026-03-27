import { useState, useEffect } from 'react';
import { Fingerprint } from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
  angle: number;
  color: string;
}

export default function BiometricsRadar({ features = [] }: { features: number[] }) {
  const [sweepAngle, setSweepAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSweepAngle(prev => (prev + 3) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const v1 = features[0] ? Math.min(100, Math.abs(features[0] * 30)) : 72;
  const v2 = features[1] ? Math.min(100, Math.abs(features[1] * 30)) : 58;
  const v3 = features[2] ? Math.min(100, Math.abs(features[2] * 30)) : 85;

  const dataPoints: DataPoint[] = [
    { label: 'V1 Vector', value: v1, angle: 45, color: 'hsl(var(--neon-cyan))' },
    { label: 'V2 Array', value: v2, angle: 160, color: 'hsl(var(--neon-purple))' },
    { label: 'V3 Delta', value: v3, angle: 280, color: 'hsl(var(--neon-amber))' },
  ];

  const cx = 100;
  const cy = 100;
  const maxR = 80;

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-2">
        <Fingerprint className="w-4 h-4 neon-text-purple" />
        <h2 className="text-sm font-semibold uppercase tracking-widest neon-text-purple">Biometrics Radar</h2>
      </div>
      <svg viewBox="0 0 200 200" className="w-full max-w-[260px] mx-auto">
        {/* Concentric rings */}
        {[0.25, 0.5, 0.75, 1].map(scale => (
          <circle
            key={scale}
            cx={cx}
            cy={cy}
            r={maxR * scale}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}
        {/* Cross lines */}
        {[0, 60, 120].map(angle => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={angle}
              x1={cx - maxR * Math.cos(rad)}
              y1={cy - maxR * Math.sin(rad)}
              x2={cx + maxR * Math.cos(rad)}
              y2={cy + maxR * Math.sin(rad)}
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
              opacity="0.2"
            />
          );
        })}
        {/* Sweep */}
        <defs>
          <linearGradient id="sweepGrad" gradientUnits="userSpaceOnUse" x1={cx} y1={cy} x2={cx + maxR} y2={cy}>
            <stop offset="0%" stopColor="hsl(var(--neon-cyan))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(var(--neon-cyan))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g transform={`rotate(${sweepAngle} ${cx} ${cy})`}>
          <path
            d={`M ${cx} ${cy} L ${cx + maxR} ${cy} A ${maxR} ${maxR} 0 0 1 ${cx + maxR * Math.cos(Math.PI / 6)} ${cy + maxR * Math.sin(Math.PI / 6)} Z`}
            fill="url(#sweepGrad)"
          />
          <line x1={cx} y1={cy} x2={cx + maxR} y2={cy} stroke="hsl(var(--neon-cyan))" strokeWidth="1" opacity="0.6" />
        </g>
        {/* Data points */}
        {dataPoints.map((point) => {
          const rad = (point.angle * Math.PI) / 180;
          const dist = (point.value / 100) * maxR;
          const px = cx + dist * Math.cos(rad);
          const py = cy + dist * Math.sin(rad);
          return (
            <g key={point.label}>
              <circle cx={px} cy={py} r="4" fill={point.color} opacity="0.8" style={{ filter: `drop-shadow(0 0 4px ${point.color})` }} />
              <circle cx={px} cy={py} r="7" fill="none" stroke={point.color} strokeWidth="0.5" opacity="0.4" />
              <text x={px} y={py - 10} textAnchor="middle" fill={point.color} fontSize="5" fontFamily="var(--font-mono)">
                {point.label}
              </text>
              <text x={px} y={py + 12} textAnchor="middle" fill={point.color} fontSize="6" fontFamily="var(--font-mono)" fontWeight="bold">
                {Math.round(point.value)}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
