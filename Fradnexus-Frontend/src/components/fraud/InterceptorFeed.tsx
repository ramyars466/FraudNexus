import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldAlert, ShieldQuestion, Clock } from "lucide-react";

import { Transaction, TransactionStatus } from "./types";


const statusConfig: Record<
  TransactionStatus,
  {
    icon: typeof Shield;
    className: string;
    glowClass: string;
    label: string;
  }
> = {
  approved: {
    icon: Shield,
    className: "neon-text-cyan",
    glowClass: "neon-glow-cyan",
    label: "APPROVED",
  },
  blocked: {
    icon: ShieldAlert,
    className: "neon-text-red",
    glowClass: "neon-glow-red",
    label: "BLOCKED",
  },
  challenged: {
    icon: ShieldQuestion,
    className: "neon-text-amber",
    glowClass: "neon-glow-amber",
    label: "CHALLENGED",
  },
  pending: {
    icon: Clock,
    className: "neon-text-purple",
    glowClass: "",
    label: "PENDING",
  },
};

const shakeAnimation = {
  x: [0, -4, 4, -4, 4, -2, 2, 0],
  transition: { duration: 0.5 },
};

interface InterceptorFeedProps {
  transactions: Transaction[];
  onAction?: (id: string, action: "approve" | "block") => void;
}

export default function InterceptorFeed({ transactions, onAction }: InterceptorFeedProps) {

  const handleAction = useCallback(
    (id: string, action: "approve" | "block") => {
      onAction?.(id, action);
    },
    [onAction]
  );

  return (
    <div className="glass-panel p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest neon-text-cyan">
          Interceptor Feed
        </h2>
        <span className="font-mono text-xs text-muted-foreground">
          {transactions.length} active
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
        <AnimatePresence initial={false}>
          {transactions.map((tx) => {
            const config = statusConfig[tx.status];
            const Icon = config.icon;

            return (
              <motion.div
                key={tx.id}
                layout
                layoutId={tx.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  ...(tx.status === "blocked" ? shakeAnimation : {}),
                }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`glass-panel p-3 rounded-md cursor-pointer ${config.glowClass}`}
                style={{
                  animation:
                    tx.status === "approved"
                      ? "pulse-cyan 2s infinite"
                      : tx.status === "challenged"
                      ? "pulse-amber 2s infinite"
                      : undefined,
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${config.className}`}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="font-mono text-xs text-muted-foreground truncate">
                        {tx.hash}
                      </span>

                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${config.className}`}
                      >
                        {config.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-semibold text-foreground">
                        {tx.currency === "BTC" || tx.currency === "ETH"
                          ? `${tx.amount.toFixed(4)} ${tx.currency}`
                          : `$${tx.amount.toLocaleString()}`}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {tx.merchant}
                      </span>

                      <span className="text-xs text-muted-foreground ml-auto">
                        {tx.country}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${tx.riskScore}%`,
                            background:
                              tx.riskScore > 80
                                ? "hsl(var(--neon-red))"
                                : tx.riskScore > 50
                                ? "hsl(var(--neon-amber))"
                                : "hsl(var(--neon-cyan))",
                          }}
                        />
                      </div>

                      <span className="font-mono text-[10px] text-muted-foreground">
                        {tx.riskScore}%
                      </span>
                    </div>
                  </div>
                </div>

                {tx.status === "challenged" && (
                  <div className="flex gap-2 mt-2 ml-8">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAction(tx.id, "approve")}
                      className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-neon-cyan/10 border border-neon-cyan/30 neon-text-cyan hover:bg-neon-cyan/20 transition-colors"
                    >
                      Approve
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAction(tx.id, "block")}
                      className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-neon-red/10 border border-neon-red/30 neon-text-red hover:bg-neon-red/20 transition-colors"
                    >
                      Block
                    </motion.button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}