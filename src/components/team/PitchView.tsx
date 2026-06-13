"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import type { PlayerCard } from "@/types";
import { ProTradingCard } from "@/components/cards/ProTradingCard";
import { getFormationSlots } from "@/lib/formations";

interface PitchViewProps {
  formation: string;
  starters: (PlayerCard | undefined)[];
  selectedCardId: string | null;
  onSlotClick: (slotIndex: number) => void;
  onRemoveFromSlot: (slotIndex: number) => void;
}

export function PitchView({
  formation,
  starters,
  selectedCardId,
  onSlotClick,
  onRemoveFromSlot,
}: PitchViewProps) {
  const slots = useMemo(() => getFormationSlots(formation), [formation]);

  return (
    <div className="relative w-full perspective-[600px]">
      {/* Stadium glow behind the pitch */}
      <div className="absolute -inset-4 bg-gradient-to-b from-blue-500/5 via-transparent to-emerald-500/10 rounded-3xl blur-3xl pointer-events-none" />

      <div
        className="relative w-full origin-bottom transition-transform duration-500"
        style={{
          transform: "rotateX(5deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Stadium shadow */}
        <div className="absolute -bottom-2 left-[5%] right-[5%] h-8 bg-black/40 blur-xl rounded-full" />

        {/* Pitch surface */}
        <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/60 border-2 border-emerald-700/40">
          {/* Grass background with realistic stripes */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/70 via-emerald-700/80 to-emerald-800/90">
            {/* Grass stripes - alternating dark/light */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full"
                  style={{
                    top: `${i * 7.14}%`,
                    height: "7.14%",
                    background: i % 2 === 0
                      ? "linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.06), rgba(255,255,255,0.03))"
                      : "linear-gradient(90deg, rgba(0,0,0,0.03), rgba(0,0,0,0.06), rgba(0,0,0,0.03))",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Grass texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)",
              backgroundSize: "6px 6px",
            }}
          />

          {/* Main pitch border */}
          <div className="absolute inset-[5%] border-[2px] border-white/20 rounded-sm">
            {/* Center line */}
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/20" />

            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] aspect-square border-[2px] border-white/20 rounded-full" />

            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2.5%] aspect-square bg-white/25 rounded-full" />

            {/* Penalty areas */}
            <div className="absolute bottom-0 left-[18%] right-[18%] h-[22%] border-[2px] border-white/15 border-b-0 rounded-t-sm" />
            <div className="absolute top-0 left-[18%] right-[18%] h-[22%] border-[2px] border-white/15 border-t-0 rounded-b-sm" />

            {/* Goal areas (6-yard box) */}
            <div className="absolute bottom-0 left-[35%] right-[35%] h-[10%] border-[2px] border-white/15 border-b-0 rounded-t-sm" />
            <div className="absolute top-0 left-[35%] right-[35%] h-[10%] border-[2px] border-white/15 border-t-0 rounded-b-sm" />

            {/* Penalty spots */}
            <div className="absolute bottom-[17%] left-1/2 -translate-x-1/2 w-[2%] aspect-square bg-white/25 rounded-full shadow-[0_0_6px_rgba(255,255,255,0.3)]" />
            <div className="absolute top-[17%] left-1/2 -translate-x-1/2 w-[2%] aspect-square bg-white/25 rounded-full shadow-[0_0_6px_rgba(255,255,255,0.3)]" />

            {/* Corner arcs */}
            <div className="absolute bottom-0 left-0 w-[7%] aspect-square border-[2px] border-white/20 rounded-br-full border-l-0 border-t-0" />
            <div className="absolute bottom-0 right-0 w-[7%] aspect-square border-[2px] border-white/20 rounded-bl-full border-r-0 border-t-0" />
            <div className="absolute top-0 left-0 w-[7%] aspect-square border-[2px] border-white/20 rounded-tr-full border-l-0 border-b-0" />
            <div className="absolute top-0 right-0 w-[7%] aspect-square border-[2px] border-white/20 rounded-tl-full border-r-0 border-b-0" />

            {/* Corner flag dots */}
            <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-[1.5%] aspect-square bg-white/30 rounded-full" />
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[1.5%] aspect-square bg-white/30 rounded-full" />
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[1.5%] aspect-square bg-white/30 rounded-full" />
            <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-[1.5%] aspect-square bg-white/30 rounded-full" />
          </div>

          {/* Goals with nets */}
          <div className="absolute bottom-[4%] left-[38%] right-[38%] z-10">
            <div className="relative">
              {/* Goal frame */}
              <div className="h-[6%] bg-white/30 rounded-t-sm border border-white/30 border-b-0 shadow-[0_-4px_15px_rgba(255,255,255,0.15)]" />
              {/* Net pattern */}
              <div
                className="absolute -bottom-3 left-0 right-0 h-3 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, rgba(255,255,255,0.3) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.3) 75%, transparent 75%, transparent)",
                  backgroundSize: "4px 4px",
                }}
              />
            </div>
          </div>
          <div className="absolute top-[4%] left-[38%] right-[38%] z-10">
            <div className="relative">
              <div className="h-[6%] bg-white/30 rounded-b-sm border border-white/30 border-t-0 shadow-[0_4px_15px_rgba(255,255,255,0.15)]" />
              <div
                className="absolute -top-3 left-0 right-0 h-3 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, rgba(255,255,255,0.3) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.3) 75%, transparent 75%, transparent)",
                  backgroundSize: "4px 4px",
                }}
              />
            </div>
          </div>

          {/* Players on the pitch */}
          <div className="absolute inset-[5%]">
            <AnimatePresence>
              {slots.map((slot, idx) => {
                const card = starters[idx];
                return (
                  <motion.div
                    key={slot.id}
                    className="absolute"
                    style={{
                      left: `${slot.x}%`,
                      top: `${slot.y}%`,
                      transform: "translate(-50%, -50%) translateZ(10px)",
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25, delay: idx * 0.03 }}
                  >
                    {card ? (
                      <motion.div
                        className="relative group cursor-pointer"
                        whileHover={{ scale: 1.15, zIndex: 50 }}
                        layout
                        layoutId={`player-${card.id}`}
                      >
                        {/* Player shadow on pitch */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/30 rounded-full blur-sm" />
                        <div
                          className="relative"
                          style={{ transform: "rotateX(-5deg)" }}
                        >
                          <ProTradingCard
                            card={card}
                            size="sm"
                            interactive={false}
                            className="shadow-2xl shadow-black/70"
                          />
                        </div>
                        <motion.button
                          initial={{ opacity: 0, scale: 0 }}
                          whileHover={{ scale: 1.2 }}
                          onClick={(e) => { e.stopPropagation(); onRemoveFromSlot(idx); }}
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-20"
                        >
                          <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.button
                        onClick={() => onSlotClick(idx)}
                        className={`relative flex items-center justify-center
                          w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2
                          transition-all duration-300 group
                          ${selectedCardId
                            ? "border-blue-400/70 bg-blue-500/15 shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse-glow"
                            : "border-dashed border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                          }`}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* Slot shadow */}
                        <div className="absolute -bottom-1 w-6 h-1.5 bg-black/20 rounded-full blur-sm" />
                        {selectedCardId ? (
                          <Sparkles className="w-4 h-4 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                        ) : (
                          <Plus className="w-4 h-4 text-white/30 group-hover:text-white/60" />
                        )}
                        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[7px] font-bold text-white/40 uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                          {slot.label}
                        </span>
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Subtle vignette overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/15 pointer-events-none" />

          {/* Top/bottom lighting */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-emerald-900/20 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
