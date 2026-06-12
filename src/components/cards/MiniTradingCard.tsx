"use client";

import type { PlayerCard } from "@/types";
import { cn } from "@/lib/utils";
import { RarityBadge } from "./RarityBadge";
import { PositionBadge } from "./PositionBadge";

interface MiniTradingCardProps {
  card: PlayerCard;
  className?: string;
  onClick?: () => void;
}

export function MiniTradingCard({ card, className, onClick }: MiniTradingCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 rounded-lg glass-light cursor-pointer hover:bg-white/10 transition-colors",
        className
      )}
      onClick={onClick}
    >
      <PositionBadge position={card.position} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-white truncate">{card.name}</div>
        <div className="text-[9px] text-muted-foreground truncate">{card.teamName}</div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-black text-white">{card.total}</span>
        <RarityBadge rarity={card.rarity} size="sm" />
      </div>
    </div>
  );
}
