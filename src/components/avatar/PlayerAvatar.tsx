"use client";

import { useMemo } from "react";
import { generateAvatarSvg } from "@/lib/seed/avatar";
import type { CardRarity, CardPosition, AvatarStyle } from "@/types";
import { AvatarBackground } from "./AvatarBackground";
import { AvatarGlow } from "./AvatarGlow";

interface PlayerAvatarProps {
  seed: string;
  rarity?: CardRarity;
  position?: CardPosition;
  style?: AvatarStyle;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-12 h-16",
  md: "w-20 h-28",
  lg: "w-28 h-40",
};

export function PlayerAvatar({
  seed,
  rarity = "BASE",
  position,
  style = "classic",
  size = "md",
  className = "",
}: PlayerAvatarProps) {
  const svg = useMemo(
    () => generateAvatarSvg(seed, rarity, position, style),
    [seed, rarity, position, style]
  );

  return (
    <div
      className={`relative ${sizeMap[size]} flex-shrink-0 overflow-hidden rounded-lg ${className}`}
    >
      <AvatarBackground rarity={rarity} style={style} />
      <div
        className="relative z-10 w-full h-full flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <AvatarGlow rarity={rarity} />
    </div>
  );
}
