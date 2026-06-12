"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { PlayerCard, CardRarity } from "@/types";
import { cn } from "@/lib/utils";
import { PlayerAvatar } from "@/components/avatar/PlayerAvatar";
import { RarityBadge } from "./RarityBadge";
import { PositionBadge } from "./PositionBadge";
import { CardShine } from "./CardShine";
import { StatPill } from "./StatPill";

interface ProTradingCardProps {
  card: PlayerCard;
  size?: "sm" | "md" | "lg";
  selected?: boolean;
  disabled?: boolean;
  used?: boolean;
  compact?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  hideStats?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { width: "w-28", avatarSize: "sm" as const, statSize: "sm" as const, showStats: false },
  md: { width: "w-36", avatarSize: "md" as const, statSize: "sm" as const, showStats: true },
  lg: { width: "w-44", avatarSize: "lg" as const, statSize: "md" as const, showStats: true },
};

const rarityFrames: Record<CardRarity, string> = {
  BASE: "border-zinc-700 shadow-[0_0_15px_rgba(113,113,122,0.1)]",
  RARE: "border-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.25)]",
  EPIC: "border-violet-600 shadow-[0_0_20px_rgba(139,92,246,0.25)]",
  LEGENDARY: "border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.35)]",
  GOLDEN: "border-yellow-400 shadow-[0_0_30px_rgba(251,191,36,0.4)]",
  MOMENTUM: "border-red-600 shadow-[0_0_20px_rgba(239,68,68,0.25)]",
  ULTRA_RARE: "border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)]",
};

const rarityBackgrounds: Record<CardRarity, string> = {
  BASE: "bg-gradient-to-b from-zinc-900 to-zinc-950",
  RARE: "bg-gradient-to-b from-blue-950 to-black",
  EPIC: "bg-gradient-to-b from-violet-950 to-black",
  LEGENDARY: "bg-gradient-to-b from-amber-950 to-black",
  GOLDEN: "bg-gradient-to-b from-yellow-950 to-black",
  MOMENTUM: "bg-gradient-to-b from-red-950 to-black",
  ULTRA_RARE: "bg-gradient-to-b from-cyan-950 via-violet-950 to-black",
};

export function ProTradingCard({
  card,
  size = "md",
  selected = false,
  disabled = false,
  used = false,
  compact = false,
  interactive = true,
  onClick,
  hideStats = false,
  className = "",
}: ProTradingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const config = sizeConfig[size];
  const frameClass = rarityFrames[card.rarity];
  const bgClass = rarityBackgrounds[card.rarity];

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!interactive) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX((y - centerY) / centerY * -8);
    setRotateY((x - centerX) / centerX * 8);
  }

  function handleMouseLeave() {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  }

  const frameStyle: React.CSSProperties =
    card.rarity === "ULTRA_RARE"
      ? {
          border: "2px solid transparent",
          backgroundImage: `linear-gradient(135deg, #06b6d4, #8b5cf6, #f59e0b, #ef4444)`,
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }
      : {};

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative rounded-xl cursor-pointer select-none",
        config.width,
        disabled && "opacity-50 pointer-events-none",
        used && "opacity-60 grayscale",
        interactive && "transform-gpu",
        className
      )}
      style={{ perspective: "1000px" }}
      onClick={disabled ? undefined : onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={
        interactive && isHovered
          ? { rotateX, rotateY, scale: 1.02 }
          : { rotateX: 0, rotateY: 0, scale: 1 }
      }
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Card outer frame */}
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border-2 transition-shadow duration-300",
          frameClass,
          bgClass,
          selected && "ring-2 ring-blue-400 ring-offset-2 ring-offset-black",
          !card.rarity.startsWith("ULTRA_RARE") && "border-2"
        )}
        style={card.rarity === "ULTRA_RARE" ? frameStyle : undefined}
      >
        {/* Inner card body */}
        <div
          className="relative flex flex-col"
          style={
            card.rarity === "ULTRA_RARE"
              ? { padding: "2px", background: "linear-gradient(180deg, #0a1a1a 0%, #000 100%)" }
              : {}
          }
        >
          {/* Holographic background for ultra rare */}
          {card.rarity === "ULTRA_RARE" && (
            <div className="absolute inset-0 animate-holographic opacity-20"
              style={{
                background: "linear-gradient(135deg, #06b6d4, #8b5cf6, #f59e0b, #ef4444, #06b6d4)",
                backgroundSize: "200% 200%",
              }}
            />
          )}

          {/* Rating total and position header */}
          <div className="relative z-10 flex items-start justify-between px-2 pt-2 pb-1">
            <div className="flex items-center gap-1">
              <span className={cn(
                "font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]",
                size === "sm" ? "text-base" : size === "md" ? "text-xl" : "text-2xl"
              )}>
                {card.total}
              </span>
              <div className="flex flex-col items-start">
                <RarityBadge rarity={card.rarity} size={size === "lg" ? "md" : "sm"} />
                {compact && (
                  <span className="text-[7px] text-muted-foreground mt-0.5">{card.collection}</span>
                )}
              </div>
            </div>
            <PositionBadge position={card.position} size={size === "sm" ? "sm" : size === "lg" ? "lg" : "md"} />
          </div>

          {/* Avatar area */}
          <div className="relative z-10 flex justify-center px-1">
            <PlayerAvatar
              seed={card.avatarSeed || card.id}
              rarity={card.rarity}
              position={card.position}
              size={config.avatarSize}
            />
          </div>

          {/* Player info */}
          <div className="relative z-10 px-2 mt-1 mb-0.5">
            <h3 className={cn(
              "font-bold text-white text-center leading-tight truncate",
              size === "sm" ? "text-[10px]" : size === "md" ? "text-xs" : "text-sm"
            )}>
              {card.name}
            </h3>
            <p className={cn(
              "text-center text-muted-foreground truncate",
              size === "sm" ? "text-[8px]" : "text-[10px]"
            )}>
              {card.teamName}
            </p>
          </div>

          {/* Stats */}
          {config.showStats && !hideStats && !compact && (
            <div className="relative z-10 flex justify-center gap-1 px-2 py-1">
              <StatPill label="ATT" value={card.attack} color="red" size={config.statSize} />
              <StatPill label="CON" value={card.control} color="green" size={config.statSize} />
              <StatPill label="DEF" value={card.defense} color="blue" size={config.statSize} />
            </div>
          )}

          {/* Footer */}
          {!compact && size !== "sm" && (
            <div className="relative z-10 px-2 pb-2 pt-0.5">
              <div className="flex items-center justify-between text-[7px] text-muted-foreground/60">
                <span>{card.collection || ""}</span>
                <span>{card.season || ""}</span>
              </div>
            </div>
          )}

          {/* Shine overlay */}
          <CardShine />

          {/* Selected indicator */}
          {selected && (
            <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-400 rounded-lg pointer-events-none" />
          )}

          {/* Used stamp */}
          {used && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="bg-red-600/80 text-white text-xs font-black px-3 py-1 rotate-[-20deg] rounded">
                USADO
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
