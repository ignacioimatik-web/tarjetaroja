"use client";

import type { CardRarity } from "@/types";
import { cn } from "@/lib/utils";

const rarityConfig: Record<CardRarity, { label: string; classes: string }> = {
  BASE: {
    label: "BASE",
    classes: "bg-zinc-800/80 text-zinc-300 border-zinc-700",
  },
  RARE: {
    label: "RARE",
    classes: "bg-blue-900/80 text-blue-300 border-blue-700 shadow-[0_0_8px_rgba(59,130,246,0.3)]",
  },
  EPIC: {
    label: "EPIC",
    classes: "bg-violet-900/80 text-violet-300 border-violet-700 shadow-[0_0_8px_rgba(139,92,246,0.3)]",
  },
  LEGENDARY: {
    label: "LEGENDARY",
    classes: "bg-amber-900/80 text-amber-300 border-amber-700 shadow-[0_0_8px_rgba(245,158,11,0.4)]",
  },
  GOLDEN: {
    label: "GOLDEN",
    classes: "bg-yellow-900/80 text-yellow-300 border-yellow-700 shadow-[0_0_8px_rgba(251,191,36,0.5)]",
  },
  MOMENTUM: {
    label: "MOMENTUM",
    classes: "bg-red-900/80 text-red-300 border-red-700 shadow-[0_0_8px_rgba(239,68,68,0.3)]",
  },
  ULTRA_RARE: {
    label: "ULTRA RARE",
    classes: "bg-cyan-900/80 text-cyan-300 border-cyan-700 shadow-[0_0_8px_rgba(6,182,212,0.4)]",
  },
};

interface RarityBadgeProps {
  rarity: CardRarity;
  size?: "sm" | "md";
}

export function RarityBadge({ rarity, size = "sm" }: RarityBadgeProps) {
  const config = rarityConfig[rarity];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-bold tracking-wider border rounded-sm",
        size === "sm" ? "text-[9px] px-1.5 py-0.5" : "text-xs px-2 py-1",
        config.classes
      )}
    >
      {config.label}
    </span>
  );
}
