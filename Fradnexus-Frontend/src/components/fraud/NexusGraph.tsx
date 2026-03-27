import { useRef, useEffect, useState } from 'react';

export interface GraphNode {
  id: string;
  label: string;
  angle: number;
  orbitRadius: number;
  nodeRadius: number;
  connections: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  x: number;
  y: number;
}

const riskColors: Record<string, string> = {
  low: 'hsl(185, 100%, 50%)',
  medium: 'hsl(40, 100%, 55%)',
  high: 'hsl(0, 85%, 55%)',
  critical: 'hsl(270, 80%, 60%)',
};

export const initialNodes: GraphNode[] = [
  { id: 'n1', label: 'Card-7842', angle: 0, orbitRadius: 0, nodeRadius: 16, connections: ['n2', 'n3', 'n5'], riskLevel: 'critical', x: 0, y: 0 },
  { id: 'n2', label: 'IP-Cluster', angle: 0, orbitRadius: 90, nodeRadius: 12, connections: ['n1', 'n4'], riskLevel: 'high', x: 0, y: 0 },
  { id: 'n3', label: 'Dev-9F3A', angle: 72, orbitRadius: 85, nodeRadius: 10, connections: ['n1', 'n6'], riskLevel: 'high', x: 0, y: 0 },
  { id: 'n4', label: 'Email-Burner', angle: 144, orbitRadius: 110, nodeRadius: 9, connections: ['n2', 'n7'], riskLevel: 'medium', x: 0, y: 0 },
  { id: 'n5', label: 'Wallet-0xAB', angle: 216, orbitRadius: 95, nodeRadius: 11, connections: ['n1', 'n8'], riskLevel: 'critical', x: 0, y: 0 },
  { id: 'n6', label: 'Phone-Spoof', angle: 288, orbitRadius: 120, nodeRadius: 8, connections: ['n3'], riskLevel: 'medium', x: 0, y: 0 },
  { id: 'n7', label: 'Geo-Anomaly', angle: 180, orbitRadius: 130, nodeRadius: 8, connections: ['n4', 'n8'], riskLevel: 'low', x: 0, y: 0 },
  { id: 'n8', label: 'Proxy-VPN', angle: 320, orbitRadius: 100, nodeRadius: 11, connections: ['n5', 'n7'], riskLevel: 'high', x: 0, y: 0 },
];

export default function NexusGraph({ nodes = [] }: { nodes: GraphNode[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    let frame: number;
    const draw = (time: number) => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h / 2;
      ctx.clearRect(0, 0, w, h);

      // Update positions
      const updatedNodes = nodes.map(n => {
        if (n.orbitRadius === 0) return { ...n, x: cx, y: cy };
        const speed = 0.0002 + (1 / (n.orbitRadius + 1)) * 0.01;
        const a = (n.angle + time * speed * 60) * (Math.PI / 180);
        return {
          ...n,
          x: cx + n.orbitRadius * Math.cos(a) * (w / 340),
          y: cy + n.orbitRadius * Math.sin(a) * (h / 340),
        };
      });

      // Draw orbit rings
      ctx.globalAlpha = 0.06;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.5;
      [90, 110, 130].forEach(r => {
        ctx.beginPath();
        ctx.arc(cx, cy, r * (w / 340), 0, Math.PI * 2);
        ctx.stroke();
      });

      // Draw connections
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 1;
      updatedNodes.forEach(n => {
        n.connections.forEach(cid => {
          const target = updatedNodes.find(t => t.id === cid);
          if (!target) return;
          const grad = ctx.createLinearGradient(n.x, n.y, target.x, target.y);
          grad.addColorStop(0, riskColors[n.riskLevel]);
          grad.addColorStop(1, riskColors[target.riskLevel]);
          ctx.strokeStyle = grad;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        });
      });

      // Draw data pulse on connections
      ctx.globalAlpha = 0.8;
      const pulseT = (time % 3000) / 3000;
      updatedNodes.forEach(n => {
        n.connections.forEach(cid => {
          const target = updatedNodes.find(t => t.id === cid);
          if (!target) return;
          const px = n.x + (target.x - n.x) * pulseT;
          const py = n.y + (target.y - n.y) * pulseT;
          ctx.fillStyle = riskColors[n.riskLevel];
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // Draw nodes
      updatedNodes.forEach(n => {
        const color = riskColors[n.riskLevel];
        const r = n.nodeRadius * (w / 340);

        // Glow
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2, 0, Math.PI * 2);
        ctx.fill();

        // Node
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Border
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 3, 0, Math.PI * 2);
        ctx.stroke();

        // Label
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = '#e0e0e0';
        ctx.font = `${Math.max(8, 10 * (w / 340))}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.x, n.y + r + 14 * (w / 340));
      });

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [nodes]);

  return (
    <div className="glass-panel p-4 h-full flex flex-col">
      <h2 className="text-sm font-semibold uppercase tracking-widest neon-text-purple mb-2">Nexus Graph — Fraud Ring</h2>
      <div className="flex-1 relative min-h-[200px]">
        <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
      </div>
      <div className="flex gap-4 mt-2 justify-center">
        {Object.entries(riskColors).map(([level, color]) => (
          <div key={level} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="text-[10px] font-mono uppercase text-muted-foreground">{level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
