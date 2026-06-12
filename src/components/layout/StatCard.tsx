"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  sublabel?: string;
  color?: "blue" | "violet" | "amber" | "red" | "green" | "cyan";
  className?: string;
}

const colorMap = {
  blue: "from-blue-600/20 to-blue-800/10 border-blue-500/20 text-blue-400",
  violet: "from-violet-600/20 to-violet-800/10 border-violet-500/20 text-violet-400",
  amber: "from-amber-600/20 to-amber-800/10 border-amber-500/20 text-amber-400",
  red: "from-red-600/20 to-red-800/10 border-red-500/20 text-red-400",
  green: "from-green-600/20 to-green-800/10 border-green-500/20 text-green-400",
  cyan: "from-cyan-600/20 to-cyan-800/10 border-cyan-500/20 text-cyan-400",
};

export function StatCard({ icon: Icon, label, value, sublabel, color = "blue", className }: StatCardProps) {
  return (
    <div className={cn("glass rounded-xl p-4 flex items-center gap-3", className)}>
      {Icon && (
        <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br border flex items-center justify-center shrink-0", colorMap[color])}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground truncate">{label}</div>
        <div className={cn("text-xl font-black", colorMap[color].split(" ")[2])}>{value}</div>
        {sublabel && <div className="text-[10px] text-muted-foreground/60">{sublabel}</div>}
      </div>
    </div>
  );
}
