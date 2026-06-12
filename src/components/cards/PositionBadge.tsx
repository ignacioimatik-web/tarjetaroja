"use client";

import type { CardPosition } from "@/types";
import { cn } from "@/lib/utils";

const positionConfig: Record<CardPosition, { label: string; classes: string }> = {
  GK: {
    label: "GK",
    classes: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  DEF: {
    label: "DEF",
    classes: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  MID: {
    label: "MID",
    classes: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  FWD: {
    label: "FWD",
    classes: "bg-red-500/20 text-red-400 border-red-500/30",
  },
};

interface PositionBadgeProps {
  position: CardPosition;
  size?: "sm" | "md" | "lg";
}

export function PositionBadge({ position, size = "md" }: PositionBadgeProps) {
  const config = positionConfig[position];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-black border rounded",
        size === "sm" && "text-[8px] w-6 h-6",
        size === "md" && "text-[10px] w-7 h-7",
        size === "lg" && "text-xs w-8 h-8",
        config.classes
      )}
    >
      {config.label}
    </span>
  );
}
