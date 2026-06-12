"use client";

import { useState, useMemo } from "react";
import { Trophy, Search, Filter } from "lucide-react";
import { useStore } from "@/store/useStore";
import { ProTradingCard } from "@/components/cards/ProTradingCard";
import { cn } from "@/lib/utils";
import type { CardRarity, CardPosition } from "@/types";

const rarities: (CardRarity | "ALL")[] = ["ALL", "BASE", "RARE", "EPIC", "LEGENDARY", "GOLDEN", "MOMENTUM", "ULTRA_RARE"];
const positions: (CardPosition | "ALL")[] = ["ALL", "GK", "DEF", "MID", "FWD"];

export default function CardsPage() {
  const cards = useStore((s) => s.cards);
  const [search, setSearch] = useState("");
  const [rarityFilter, setRarityFilter] = useState<CardRarity | "ALL">("ALL");
  const [positionFilter, setPositionFilter] = useState<CardPosition | "ALL">("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (search && !card.name.toLowerCase().includes(search.toLowerCase()) && !card.teamName.toLowerCase().includes(search.toLowerCase())) return false;
      if (rarityFilter !== "ALL" && card.rarity !== rarityFilter) return false;
      if (positionFilter !== "ALL" && card.position !== positionFilter) return false;
      return true;
    });
  }, [cards, search, rarityFilter, positionFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Biblioteca de Cartas</h1>
          <p className="text-sm text-muted-foreground">{cards.length} cartas en total</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre o equipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/40 border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value as CardRarity | "ALL")}
            className="px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white focus:outline-none focus:border-blue-500/50"
          >
            {rarities.map((r) => (
              <option key={r} value={r}>{r === "ALL" ? "Todas" : r}</option>
            ))}
          </select>
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value as CardPosition | "ALL")}
            className="px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white focus:outline-none focus:border-blue-500/50"
          >
            {positions.map((p) => (
              <option key={p} value={p}>{p === "ALL" ? "Todas" : p}</option>
            ))}
          </select>
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "compact" : "grid")}
            className="px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white hover:bg-white/5"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={cn(
        viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" : "space-y-2"
      )}>
        {filteredCards.map((card) => (
          <ProTradingCard key={card.id} card={card} size={viewMode === "compact" ? "sm" : "md"} />
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="glass rounded-xl p-12 text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-white mb-2">No hay cartas</h2>
          <p className="text-sm text-muted-foreground">Crea tu primera carta usando el botón +</p>
        </div>
      )}
    </div>
  );
}
