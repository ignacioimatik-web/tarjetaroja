"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { ProTradingCard } from "@/components/cards/ProTradingCard";
import { generateId } from "@/lib/utils";
import type { PlayerCard } from "@/types";

const initialCard: PlayerCard = {
  id: "",
  name: "",
  teamName: "",
  position: "MID",
  rarity: "BASE",
  attack: 50,
  control: 50,
  defense: 50,
  total: 50,
  avatarSeed: Math.random().toString(36).substring(2, 10),
  avatarStyle: "classic",
  collection: "Temporada 1",
  season: "2025/26",
};

export default function NewCardPage() {
  const router = useRouter();
  const addCard = useStore((s) => s.addCard);
  const [card, setCard] = useState<PlayerCard>({ ...initialCard, id: generateId() });

  function update(field: keyof PlayerCard, value: string | number) {
    const updated = { ...card, [field]: value };
    updated.total = Math.round((updated.attack + updated.control + updated.defense) / 3);
    setCard(updated);
  }

  function handleSave() {
    if (!card.name.trim()) return;
    addCard({ ...card, createdAt: new Date().toISOString() });
    router.push("/cards");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/cards" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Nueva Carta</h1>
          <p className="text-sm text-muted-foreground">Crea una carta de jugador</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-xl p-6 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Nombre del jugador</label>
            <input
              value={card.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Ej: Alejandro Silva"
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Equipo</label>
            <input
              value={card.teamName}
              onChange={(e) => update("teamName", e.target.value)}
              placeholder="Ej: Real Madrid FC"
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Posición</label>
              <select
                value={card.position}
                onChange={(e) => update("position", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="GK">Portero</option>
                <option value="DEF">Defensa</option>
                <option value="MID">Medio</option>
                <option value="FWD">Delantero</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Rareza</label>
              <select
                value={card.rarity}
                onChange={(e) => update("rarity", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="BASE">Base</option>
                <option value="RARE">Rare</option>
                <option value="EPIC">Epic</option>
                <option value="LEGENDARY">Legendary</option>
                <option value="GOLDEN">Golden</option>
                <option value="MOMENTUM">Momentum</option>
                <option value="ULTRA_RARE">Ultra Rare</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">País</label>
            <input
              value={card.country || ""}
              onChange={(e) => update("country", e.target.value)}
              placeholder="Opcional"
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Estilo de avatar</label>
            <select
              value={card.avatarStyle || "classic"}
              onChange={(e) => {
                update("avatarStyle", e.target.value);
                update("avatarSeed", Math.random().toString(36).substring(2, 10));
              }}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="classic">Classic</option>
              <option value="neon">Neon</option>
              <option value="gold">Gold</option>
              <option value="shadow">Shadow</option>
              <option value="rookie">Rookie</option>
              <option value="legend">Legend</option>
            </select>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-semibold text-white mb-3">Estadísticas</h3>
            <div className="space-y-3">
              {(["attack", "control", "defense"] as const).map((stat) => (
                <div key={stat}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground uppercase">{stat}</span>
                    <span className="text-white font-bold">{card[stat]}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={99}
                    value={card[stat]}
                    onChange={(e) => update(stat, parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="text-lg font-black text-white">{card.total}</span>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!card.name.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Save className="w-4 h-4" /> Guardar Carta
          </button>
        </div>

        <div className="flex flex-col items-center justify-start pt-4">
          <p className="text-xs text-muted-foreground mb-4">Vista previa</p>
          <ProTradingCard card={card} size="lg" interactive={false} />
        </div>
      </div>
    </div>
  );
}
