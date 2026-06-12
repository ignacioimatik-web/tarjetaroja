"use client";

import type { CardRarity, AvatarStyle } from "@/types";

const rarityGradients: Record<CardRarity, string> = {
  BASE: "from-zinc-800/60 to-zinc-900/60",
  RARE: "from-blue-900/60 to-blue-950/60",
  EPIC: "from-violet-900/60 to-violet-950/60",
  LEGENDARY: "from-amber-900/60 to-amber-950/60",
  GOLDEN: "from-yellow-900/60 to-yellow-950/60",
  MOMENTUM: "from-red-900/60 to-red-950/60",
  ULTRA_RARE: "from-cyan-900/60 via-violet-900/60 to-amber-900/60",
};

const styleOverlays: Record<AvatarStyle, string> = {
  classic: "",
  neon: "after:bg-cyan-500/5",
  gold: "after:bg-amber-500/10",
  shadow: "after:bg-black/20",
  rookie: "after:bg-emerald-500/5",
  legend: "after:bg-pink-500/10",
};

interface AvatarBackgroundProps {
  rarity: CardRarity;
  style: AvatarStyle;
  className?: string;
}

export function AvatarBackground({ rarity, style, className = "" }: AvatarBackgroundProps) {
  const gradient = rarityGradients[rarity];
  const overlay = styleOverlays[style];

  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br ${gradient} ${overlay} ${className}
        ${rarity === "ULTRA_RARE" ? "animate-holographic" : ""}`}
    />
  );
}
