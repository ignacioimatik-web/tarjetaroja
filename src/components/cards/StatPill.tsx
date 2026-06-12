"use client";

import { cn } from "@/lib/utils";

interface StatPillProps {
  label: string;
  value: number;
  color?: "blue" | "violet" | "amber" | "red" | "green";
  size?: "sm" | "md";
}

const colorMap = {
  blue: "from-blue-600/40 to-blue-800/20 border-blue-500/30 text-blue-300",
  violet: "from-violet-600/40 to-violet-800/20 border-violet-500/30 text-violet-300",
  amber: "from-amber-600/40 to-amber-800/20 border-amber-500/30 text-amber-300",
  red: "from-red-600/40 to-red-800/20 border-red-500/30 text-red-300",
  green: "from-green-600/40 to-green-800/20 border-green-500/30 text-green-300",
};

export function StatPill({ label, value, color = "blue", size = "sm" }: StatPillProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-gradient-to-b border rounded-sm",
        colorMap[color],
        size === "sm" ? "py-1 px-2 min-w-[48px]" : "py-1.5 px-3 min-w-[60px]"
      )}
    >
      <span className={cn("font-black leading-none", size === "sm" ? "text-sm" : "text-lg")}>
        {value}
      </span>
      <span className={cn("font-medium uppercase tracking-wider", size === "sm" ? "text-[7px]" : "text-[9px]")}>
        {label}
      </span>
    </div>
  );
}
