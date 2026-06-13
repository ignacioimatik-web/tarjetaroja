"use client";

import { motion } from "framer-motion";

interface StatRingProps {
  value: number;
  max: number;
  label: string;
  color: string;
  size?: "sm" | "md" | "lg";
  delay?: number;
}

const sizeMap = {
  sm: { outer: 64, stroke: 4, fontSize: "text-sm", labelSize: "text-[8px]" },
  md: { outer: 90, stroke: 5, fontSize: "text-lg", labelSize: "text-[10px]" },
  lg: { outer: 120, stroke: 6, fontSize: "text-2xl", labelSize: "text-xs" },
};

export function StatRing({ value, max, label, color, size = "md", delay = 0 }: StatRingProps) {
  const cfg = sizeMap[size];
  const r = (cfg.outer - cfg.stroke) / 2;
  const circ = 2 * Math.PI * r;
  const progress = Math.min(value / max, 1);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: cfg.outer, height: cfg.outer }}>
        <svg width={cfg.outer} height={cfg.outer} className="transform -rotate-90">
          <circle
            cx={cfg.outer / 2}
            cy={cfg.outer / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={cfg.stroke}
          />
          <motion.circle
            cx={cfg.outer / 2}
            cy={cfg.outer / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={cfg.stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - progress) }}
            transition={{ duration: 1.2, delay, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`${cfg.fontSize} font-black text-white`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.3 }}
          >
            {value}
          </motion.span>
        </div>
      </div>
      <span className={`${cfg.labelSize} font-semibold uppercase tracking-widest ${color.replace("stroke-", "text-").replace("#", "")}`}
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}
