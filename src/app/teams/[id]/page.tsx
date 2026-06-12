"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Shirt, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { MiniTradingCard } from "@/components/cards/MiniTradingCard";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { EmptyState } from "@/components/layout/EmptyState";
import { generateId } from "@/lib/utils";
import { validateSquad, getSquadLegalitySummary } from "@/lib/rules";
import { FORMATIONS } from "@/lib/constants";
import type { Squad } from "@/types";

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teams = useStore((s) => s.teams);
  const cards = useStore((s) => s.cards);
  const squads = useStore((s) => s.squads);
  const saveSquad = useStore((s) => s.saveSquad);

  const team = teams.find((t) => t.id === params.id);
  const existingSquad = squads.find((s) => s.teamId === params.id);
  const teamCards = cards.filter((c) => c.teamName === team?.name || c.country === team?.name || c.clubName === team?.name);

  const [starters, setStarters] = useState<string[]>(existingSquad?.starters || []);
  const [subs, setSubs] = useState<string[]>(existingSquad?.substitutes || []);
  const [formation, setFormation] = useState(existingSquad?.formation || "4-4-2");

  const [mode, setMode] = useState<"infantil" | "standard" | "advanced">(existingSquad?.mode || "standard");

  const validation = useMemo(() => {
    if (!team) return null;
    const squad: Squad = { id: existingSquad?.id || generateId(), teamId: team.id, formation, starters, substitutes: subs, mode, createdAt: new Date().toISOString() };
    return validateSquad(squad, cards, team, mode);
  }, [team, starters, subs, formation, mode, cards, existingSquad]);

  if (!team) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EmptyState icon={Shirt} title="Equipo no encontrado" description="El equipo que buscas no existe" action={<Link href="/teams" className="text-blue-400 hover:underline">Volver</Link>} />
      </div>
    );
  }

  function toggleCard(cardId: string) {
    if (starters.includes(cardId)) {
      setStarters(starters.filter((id) => id !== cardId));
    } else if (subs.includes(cardId)) {
      setSubs(subs.filter((id) => id !== cardId));
    } else if (starters.length < 11) {
      setStarters([...starters, cardId]);
    } else if (subs.length < 5) {
      setSubs([...subs, cardId]);
    }
  }

  function handleSave() {
    if (!team) return;
    const squad: Squad = {
      id: existingSquad?.id || generateId(),
      teamId: team.id,
      formation,
      starters,
      substitutes: subs,
      mode,
      createdAt: existingSquad?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveSquad(squad);
    router.push("/teams");
  }

  const availableCards = teamCards.filter((c) => !starters.includes(c.id) && !subs.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/teams" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: team.colors?.primary || "#333" }}>
          <Shirt className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{team.name}</h1>
          <p className="text-sm text-muted-foreground">Constructor de plantilla · {formation}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <GlassPanel>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Plantilla</h3>
              <select
                value={formation}
                onChange={(e) => setFormation(e.target.value)}
                className="px-2 py-1 rounded bg-black/40 border border-border text-xs text-white"
              >
                {FORMATIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => setMode("infantil")} className={`px-3 py-1 rounded-lg text-xs font-medium ${mode === "infantil" ? "bg-blue-500/20 text-blue-400" : "text-muted-foreground"}`}>Infantil</button>
              <button onClick={() => setMode("standard")} className={`px-3 py-1 rounded-lg text-xs font-medium ${mode === "standard" ? "bg-blue-500/20 text-blue-400" : "text-muted-foreground"}`}>Estándar</button>
              <button onClick={() => setMode("advanced")} className={`px-3 py-1 rounded-lg text-xs font-medium ${mode === "advanced" ? "bg-blue-500/20 text-blue-400" : "text-muted-foreground"}`}>Avanzado</button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Titulares ({starters.length})</p>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {starters.map((id) => {
                    const card = cards.find((c) => c.id === id);
                    if (!card) return null;
                    return <MiniTradingCard key={id} card={card} onClick={() => toggleCard(id)} />;
                  })}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Suplentes ({subs.length})</p>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {subs.map((id) => {
                    const card = cards.find((c) => c.id === id);
                    if (!card) return null;
                    return <MiniTradingCard key={id} card={card} onClick={() => toggleCard(id)} />;
                  })}
                </div>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel>
            <h3 className="text-sm font-semibold text-white mb-3">Cartas disponibles ({availableCards.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-y-auto">
              {availableCards.map((card) => (
                <MiniTradingCard key={card.id} card={card} onClick={() => toggleCard(card.id)} />
              ))}
            </div>
          </GlassPanel>

          <button
            onClick={handleSave}
            disabled={!validation?.valid}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-violet-500 disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" /> Guardar Plantilla
          </button>
        </div>

        <div className="space-y-4">
          <GlassPanel>
            <h3 className="text-sm font-semibold text-white mb-2">Validación</h3>
            <div className={`text-xs font-medium mb-2 ${validation?.valid ? "text-green-400" : "text-red-400"}`}>
              {getSquadLegalitySummary(validation!)}
            </div>
            {validation?.errors.map((e, i) => <p key={i} className="text-[10px] text-red-400/80 mb-1">✗ {e}</p>)}
            {validation?.warnings.map((w, i) => <p key={i} className="text-[10px] text-amber-400/80 mb-1">⚠ {w}</p>)}
          </GlassPanel>

          <GlassPanel>
            <h3 className="text-sm font-semibold text-white mb-2">Métricas</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Ataque</span>
                <span className="text-white font-bold">{validation?.totals.attack || 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Control</span>
                <span className="text-white font-bold">{validation?.totals.control || 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Defensa</span>
                <span className="text-white font-bold">{validation?.totals.defense || 0}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-xs">
                <span className="text-muted-foreground">Índice de Fuerza</span>
                <span className="text-amber-400 font-bold">{validation?.strengthIndex || 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Índice de Abuso</span>
                <span className="text-red-400 font-bold">{validation?.abuseIndex || 0}</span>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel>
            <h3 className="text-sm font-semibold text-white mb-2">Rarezas</h3>
            <div className="space-y-1">
              {Object.entries(validation?.rarityCounts || {}).map(([rarity, count]) => (
                <div key={rarity} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{rarity}</span>
                  <span className="text-white font-bold">{count}</span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
