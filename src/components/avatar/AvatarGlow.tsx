"use client";

import type { CardRarity } from "@/types";

const glowColors: Record<CardRarity, string> = {
  BASE: "shadow-zinc-500/20",
  RARE: "shadow-blue-500/30",
  EPIC: "shadow-violet-500/30",
  LEGENDARY: "shadow-amber-500/40",
  GOLDEN: "shadow-yellow-500/50",
  MOMENTUM: "shadow-red-500/30",
  ULTRA_RARE: "shadow-cyan-500/40",
};

interface AvatarGlowProps {
  rarity: CardRarity;
  className?: string;
}

export function AvatarGlow({ rarity, className = "" }: AvatarGlowProps) {
  return (
    <div
      className={`absolute inset-0 rounded-lg ${glowColors[rarity]} shadow-[0_0_30px_var(--tw-shadow-color)] ${className}`}
    />
  );
}
