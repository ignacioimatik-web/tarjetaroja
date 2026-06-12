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
    <div className="relative w-full perspective-[800px]">
      <div
        className="relative w-full origin-bottom transition-transform duration-500"
        style={{
          transform: "rotateX(55deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Pitch surface */}
        <div className="relative w-full aspect-[2/3] bg-gradient-to-b from-emerald-800 via-emerald-900 to-emerald-950 rounded-lg overflow-hidden shadow-2xl shadow-emerald-900/50 border border-emerald-700/30">
          {/* Grass stripes */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-[8.33%]"
                style={{
                  top: `${i * 8.33}%`,
                  background: i % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent",
                }}
              />
            ))}
          </div>

          {/* Pitch markings - transformed for perspective */}
          <div className="absolute inset-[8%] border border-white/15 rounded-sm">
            {/* Center line */}
            <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-white/15" />

            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25%] aspect-square border border-white/15 rounded-full" />

            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3%] aspect-square bg-white/20 rounded-full" />

            {/* Penalty areas */}
            <div className="absolute bottom-0 left-[15%] right-[15%] h-[25%] border border-white/15 border-b-0 rounded-t-sm" />
            <div className="absolute top-0 left-[15%] right-[15%] h-[25%] border border-white/15 border-t-0 rounded-b-sm" />

            {/* Goal areas */}
            <div className="absolute bottom-0 left-[32%] right-[32%] h-[10%] border border-white/15 border-b-0 rounded-t-sm" />
            <div className="absolute top-0 left-[32%] right-[32%] h-[10%] border border-white/15 border-t-0 rounded-b-sm" />

            {/* Penalty spots */}
            <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[2%] aspect-square bg-white/15 rounded-full" />
            <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[2%] aspect-square bg-white/15 rounded-full" />

            {/* Goals */}
            <div className="absolute bottom-0 left-[38%] right-[38%] h-[3%] bg-white/20 rounded-t-sm border border-white/20 border-b-0" />
            <div className="absolute top-0 left-[38%] right-[38%] h-[3%] bg-white/20 rounded-b-sm border border-white/20 border-t-0" />

            {/* Corner arcs */}
            <div className="absolute bottom-0 left-0 w-[6%] aspect-square border border-white/15 rounded-br-full border-l-0 border-t-0" />
            <div className="absolute bottom-0 right-0 w-[6%] aspect-square border border-white/15 rounded-bl-full border-r-0 border-t-0" />
            <div className="absolute top-0 left-0 w-[6%] aspect-square border border-white/15 rounded-tr-full border-l-0 border-b-0" />
            <div className="absolute top-0 right-0 w-[6%] aspect-square border border-white/15 rounded-tl-full border-r-0 border-b-0" />
          </div>

          {/* Goals glow */}
          <div className="absolute bottom-[5%] left-[35%] right-[35%] h-[2%] bg-gradient-to-r from-blue-500/20 via-blue-400/40 to-blue-500/20 blur-sm" />
          <div className="absolute top-[5%] left-[35%] right-[35%] h-[2%] bg-gradient-to-r from-blue-500/20 via-blue-400/40 to-blue-500/20 blur-sm" />

          {/* Players on the pitch */}
          <div className="absolute inset-[8%]">
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
                      transform: "translate(-50%, -50%) translateZ(20px)",
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25, delay: idx * 0.03 }}
                  >
                    {card ? (
                      <motion.div
                        className="relative group cursor-pointer"
                        whileHover={{ scale: 1.1, zIndex: 50 }}
                        layout
                        layoutId={`player-${card.id}`}
                      >
                        <div
                          className="relative"
                          style={{ transform: "rotateX(-55deg)" }}
                        >
                          <ProTradingCard
                            card={card}
                            size="sm"
                            interactive={false}
                            className="shadow-2xl shadow-black/60"
                          />
                        </div>
                        {/* Remove button */}
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
                          w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-dashed
                          transition-all duration-300 group
                          ${selectedCardId
                            ? "border-blue-400/70 bg-blue-500/15 shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse-glow"
                            : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                          }`}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {selectedCardId ? (
                          <Sparkles className="w-4 h-4 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                        ) : (
                          <Plus className="w-4 h-4 text-white/30 group-hover:text-white/60" />
                        )}
                        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[7px] font-bold text-white/30 uppercase tracking-wider">
                          {slot.label}
                        </span>
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
