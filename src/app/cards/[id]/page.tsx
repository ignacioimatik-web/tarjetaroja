"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Globe, Shirt, Calendar, Layers, Star, Zap, Shield, Target, Swords, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { ProTradingCard } from "@/components/cards/ProTradingCard";
import { StatRing } from "@/components/cards/StatRing";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { RarityBadge } from "@/components/cards/RarityBadge";
import { PositionBadge } from "@/components/cards/PositionBadge";
import { EmptyState } from "@/components/layout/EmptyState";

const rarityColors: Record<string, { ring: string; bg: string }> = {
  BASE: { ring: "#71717a", bg: "from-zinc-900/50 to-zinc-950/50" },
  RARE: { ring: "#3b82f6", bg: "from-blue-900/50 to-blue-950/50" },
  EPIC: { ring: "#8b5cf6", bg: "from-violet-900/50 to-violet-950/50" },
  LEGENDARY: { ring: "#f59e0b", bg: "from-amber-900/50 to-amber-950/50" },
  GOLDEN: { ring: "#fbbf24", bg: "from-yellow-900/50 to-yellow-950/50" },
  MOMENTUM: { ring: "#ef4444", bg: "from-red-900/50 to-red-950/50" },
  ULTRA_RARE: { ring: "#06b6d4", bg: "from-cyan-900/50 via-violet-900/50 to-amber-900/50" },
};

export default function CardDetailPage() {
  const params = useParams();
  const cards = useStore((s) => s.cards);
  const card = cards.find((c) => c.id === params.id);

  if (!card) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EmptyState icon={Shield} title="Carta no encontrada" description="" action={<Link href="/cards" className="text-blue-400 hover:underline">Volver</Link>} />
      </div>
    );
  }

  const rc = rarityColors[card.rarity] || rarityColors.BASE;
  const isSpecial = card.isSpecial;

  return (
    <div className="min-h-screen bg-stadium">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/cards" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a cartas
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT: Card display */}
          <motion.div
            className="lg:col-span-2 flex flex-col items-center"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <ProTradingCard card={card} size="lg" interactive={false} />
            </motion.div>

            <motion.div
              className="flex items-center gap-3 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <RarityBadge rarity={card.rarity} size="md" />
              <PositionBadge position={card.position} size="lg" />
              {isSpecial && (
                <span className="flex items-center gap-1 px-2 py-1 rounded bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                  <Star className="w-3 h-3" /> SPECIAL
                </span>
              )}
            </motion.div>
          </motion.div>

          {/* RIGHT: Stats & Info */}
          <motion.div
            className="lg:col-span-3 space-y-5"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Player name header */}
            <div>
              <motion.h1
                className="text-3xl sm:text-4xl font-black text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                {card.name}
              </motion.h1>
              <motion.p
                className="text-base text-muted-foreground mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              >
                {card.teamName}
                {card.nationalTeamName && card.nationalTeamName !== card.teamName && (
                  <span className="text-muted-foreground/60"> · {card.nationalTeamName}</span>
                )}
              </motion.p>
            </div>

            {/* Overall rating */}
            <motion.div
              className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${rc.bg} border border-white/10`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-5">
                <div className="relative">
                  <motion.div
                    className="text-6xl sm:text-7xl font-black text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    style={{ textShadow: `0 0 30px ${rc.ring}60` }}
                  >
                    {card.total}
                  </motion.div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">Overall</div>
                </div>
                <div className="flex-1 h-14 relative">
                  <div className="absolute inset-0 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${rc.ring}40, ${rc.ring})`,
                        boxShadow: `0 0 20px ${rc.ring}40`,
                        width: `${(card.total / 99) * 100}%`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(card.total / 99) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>0</span>
                    <span>50</span>
                    <span>99</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stat rings */}
            <motion.div
              className="grid grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <GlassPanel className="flex flex-col items-center py-5">
                <StatRing value={card.attack} max={99} label="ATT" color="#ef4444" size="lg" delay={0.3} />
              </GlassPanel>
              <GlassPanel className="flex flex-col items-center py-5">
                <StatRing value={card.control} max={99} label="CON" color="#22c55e" size="lg" delay={0.5} />
              </GlassPanel>
              <GlassPanel className="flex flex-col items-center py-5">
                <StatRing value={card.defense} max={99} label="DEF" color="#3b82f6" size="lg" delay={0.7} />
              </GlassPanel>
            </motion.div>

            {/* Info grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <GlassPanel>
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Swords className="w-4 h-4 text-muted-foreground" />
                  Información del Jugador
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow icon={Shirt} label="Equipo" value={card.teamName} />
                  {card.nationalTeamName && (
                    <InfoRow icon={Globe} label="Selección" value={card.nationalTeamName} />
                  )}
                  <InfoRow icon={Target} label="Posición" value={card.position === "GK" ? "Portero" : card.position === "DEF" ? "Defensa" : card.position === "MID" ? "Medio" : "Delantero"} />
                  <InfoRow icon={Zap} label="Rareza" value={card.rarity} />
                  {card.country && <InfoRow icon={Globe} label="País" value={card.country} />}
                  {card.collection && <InfoRow icon={Layers} label="Colección" value={card.collection} />}
                  {card.season && <InfoRow icon={Calendar} label="Temporada" value={card.season} />}
                  {card.cardType && <InfoRow icon={Star} label="Tipo" value={card.cardType} />}
                </div>
              </GlassPanel>
            </motion.div>

            {/* Created/Updated timestamps */}
            <motion.div
              className="text-[10px] text-muted-foreground/40 text-right"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {card.createdAt && <span>Creado: {new Date(card.createdAt).toLocaleDateString()}</span>}
              {card.updatedAt && <span className="ml-3">Actualizado: {new Date(card.updatedAt).toLocaleDateString()}</span>}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/5">
      <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
        <div className="text-sm font-semibold text-white truncate">{value}</div>
      </div>
    </div>
  );
}
