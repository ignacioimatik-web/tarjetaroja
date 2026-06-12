"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Shirt, Save, ArrowLeft, X, Plus, Check, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { ProTradingCard } from "@/components/cards/ProTradingCard";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { EmptyState } from "@/components/layout/EmptyState";
import { generateId } from "@/lib/utils";
import { validateSquad, getSquadLegalitySummary } from "@/lib/rules";
import { FORMATIONS } from "@/lib/constants";
import { getFormationSlots } from "@/lib/formations";
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
  const teamCards = cards.filter((c) => c.teamName === team?.name || c.nationalTeamName === team?.name || c.clubName === team?.name);

  const [starters, setStarters] = useState<string[]>(existingSquad?.starters || []);
  const [subs, setSubs] = useState<string[]>(existingSquad?.substitutes || []);
  const [formation, setFormation] = useState(existingSquad?.formation || "4-3-3");
  const [mode, setMode] = useState<"infantil" | "standard" | "advanced">(existingSquad?.mode || "standard");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showMobileCards, setShowMobileCards] = useState(false);

  const slots = getFormationSlots(formation);
  const slotPositions = slots.map((s) => s.position);

  const validation = useMemo(() => {
    if (!team) return null;
    const squad: Squad = { id: existingSquad?.id || generateId(), teamId: team.id, formation, starters, substitutes: subs, mode, createdAt: new Date().toISOString() };
    return validateSquad(squad, cards, team, mode);
  }, [team, starters, subs, formation, mode, cards, existingSquad]);

  const [positionFilter, setPositionFilter] = useState<string>("all");

  if (!team) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EmptyState icon={Shirt} title="Equipo no encontrado" description="" action={<Link href="/teams" className="text-blue-400 hover:underline">Volver</Link>} />
      </div>
    );
  }

  function assignToSlot(slotIndex: number, cardId: string) {
    setStarters((prev) => {
      const next = [...prev];
      next[slotIndex] = cardId;
      const dupIdx = next.indexOf(cardId);
      if (dupIdx !== slotIndex && dupIdx !== -1) {
        next.splice(dupIdx, 1);
      }
      return next;
    });
    setSelectedCardId(null);
  }

  function removeFromSlot(slotIndex: number) {
    setStarters((prev) => {
      const next = [...prev];
      next[slotIndex] = "";
      return next;
    });
  }

  function addSub(cardId: string) {
    if (subs.length >= 5) return;
    setSubs((prev) => [...prev, cardId]);
  }

  function removeSub(cardId: string) {
    setSubs((prev) => prev.filter((id) => id !== cardId));
  }

  function autoFill() {
    const gks = teamCards.filter((c) => c.position === "GK");
    const defs = teamCards.filter((c) => c.position === "DEF");
    const mids = teamCards.filter((c) => c.position === "MID");
    const fwds = teamCards.filter((c) => c.position === "FWD");

    const newStarters: string[] = [];
    let gkIdx = 0, defIdx = 0, midIdx = 0, fwdIdx = 0;

    for (const pos of slotPositions) {
      if (pos === "GK" && gkIdx < gks.length) {
        newStarters.push(gks[gkIdx++].id);
      } else if (pos === "DEF" && defIdx < defs.length) {
        newStarters.push(defs[defIdx++].id);
      } else if (pos === "MID" && midIdx < mids.length) {
        newStarters.push(mids[midIdx++].id);
      } else if (pos === "FWD" && fwdIdx < fwds.length) {
        newStarters.push(fwds[fwdIdx++].id);
      } else {
        newStarters.push("");
      }
    }
    setStarters(newStarters);
  }

  function handleSave() {
    if (!team) return;
    const validStarters = starters.filter((id) => id && cards.find((c) => c.id === id));
    const squad: Squad = {
      id: existingSquad?.id || generateId(),
      teamId: team.id,
      formation,
      starters: validStarters,
      substitutes: subs,
      mode,
      createdAt: existingSquad?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveSquad(squad);
    router.push("/teams");
  }

  const availableCards = teamCards.filter((c) =>
    !starters.includes(c.id) && !subs.includes(c.id) &&
    (!team || team.type === "national"
      ? c.nationalTeamName === team.name || c.country === team.country
      : c.clubName === team.name || c.teamName === team.name)
  );

  const gkCards = availableCards.filter((c) => c.position === "GK");
  const defCards = availableCards.filter((c) => c.position === "DEF");
  const midCards = availableCards.filter((c) => c.position === "MID");
  const fwdCards = availableCards.filter((c) => c.position === "FWD");

  // Group available cards by position for tabs
  const positionTabs = [
    { key: "all", label: "Todos", cards: availableCards },
    { key: "GK", label: "Porteros", cards: gkCards },
    { key: "DEF", label: "Defensas", cards: defCards },
    { key: "MID", label: "Medios", cards: midCards },
    { key: "FWD", label: "Delanteros", cards: fwdCards },
  ] as const;

  const filteredCards = positionTabs.find((t) => t.key === positionFilter)?.cards || availableCards;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8">
      <Link href="/teams" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: team.colors?.primary || "#333" }}>
          <Shirt className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white truncate">{team.name}</h1>
          <p className="text-sm text-muted-foreground">Constructor de plantilla</p>
        </div>
        <div className="flex gap-2">
          <button onClick={autoFill} className="px-3 py-1.5 text-xs bg-white/5 text-muted-foreground rounded-lg hover:bg-white/10">
            Auto-llenar
          </button>
          <button
            onClick={handleSave}
            disabled={!validation?.valid}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-semibold rounded-xl hover:from-blue-500 hover:to-violet-500 disabled:opacity-50 transition-all"
          >
            <Save className="w-3.5 h-3.5" /> Guardar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* LEFT: Pitch */}
        <div className="xl:col-span-2 order-2 xl:order-1">
          <GlassPanel className="p-0 overflow-hidden">
            {/* Formation & Mode selector */}
            <div className="flex items-center gap-2 p-3 border-b border-border/50">
              <select
                value={formation}
                onChange={(e) => setFormation(e.target.value)}
                className="px-2 py-1 rounded bg-black/40 border border-border text-xs text-white"
              >
                {FORMATIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
              <div className="flex gap-1">
                {(["infantil", "standard", "advanced"] as const).map((m) => (
                  <button key={m} onClick={() => setMode(m)}
                    className={`px-2 py-1 rounded text-[10px] font-medium ${mode === m ? "bg-blue-500/20 text-blue-400" : "text-muted-foreground"}`}
                  >{m === "infantil" ? "Inf" : m === "standard" ? "Std" : "Adv"}</button>
                ))}
              </div>
              <div className="ml-auto text-xs text-muted-foreground">
                {starters.filter(Boolean).length}/{slots.length}
              </div>
            </div>

            {/* Pitch */}
            <div className="relative w-full aspect-[3/4] sm:aspect-[2/3] bg-gradient-to-b from-emerald-900/60 via-emerald-950/50 to-emerald-900/60">
              {/* Pitch markings */}
              <div className="absolute inset-4 border border-white/10 rounded-lg">
                <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-white/10" />
                <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-white/10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-white/10 rounded-full" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-8 border border-white/10 rounded-t-full border-b-0" />
              </div>

              {/* Player slots */}
              <div className="absolute inset-4">
                {slots.map((slot, idx) => {
                  const cardId = starters[idx];
                  const card = cardId ? cards.find((c) => c.id === cardId) : undefined;
                  return (
                    <div
                      key={slot.id}
                      className="absolute"
                      style={{ left: `${slot.x}%`, top: `${slot.y}%`, transform: "translate(-50%, -50%)" }}
                    >
                      {card ? (
                        <div className="relative group">
                          <ProTradingCard
                            card={card}
                            size="sm"
                            interactive={false}
                            className="shadow-lg shadow-black/40"
                          />
                          <button
                            onClick={() => removeFromSlot(idx)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedCardId(`slot-${idx}`)}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center hover:bg-white/20 hover:border-blue-400/50 transition-all group"
                          title={`Añadir ${slot.label}`}
                        >
                          <Plus className="w-4 h-4 text-white/40 group-hover:text-blue-400" />
                          <span className="absolute -bottom-4 text-[8px] text-white/40 uppercase font-bold">{slot.label}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Substitutes */}
            <div className="px-3 py-3 border-t border-border/50">
              <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">Suplentes ({subs.length})</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {subs.length === 0 && (
                  <p className="text-xs text-muted-foreground/60 italic">Selecciona cartas como suplentes desde el panel de cartas</p>
                )}
                {subs.map((id) => {
                  const card = cards.find((c) => c.id === id);
                  if (!card) return null;
                  return (
                    <div key={id} className="relative shrink-0">
                      <ProTradingCard card={card} size="sm" interactive={false} />
                      <button onClick={() => removeSub(id)}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-600/80 text-white flex items-center justify-center hover:bg-red-500 z-10"
                      ><X className="w-2.5 h-2.5" /></button>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* RIGHT: Cards panel + Validation */}
        <div className="xl:col-span-2 order-1 xl:order-2 space-y-4">
          {/* Validation */}
          <GlassPanel className="py-3 px-4">
            <div className="flex items-center gap-2 mb-2">
              {validation?.valid ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
              <span className={`text-xs font-bold ${validation?.valid ? "text-green-400" : "text-amber-400"}`}>
                {getSquadLegalitySummary(validation!)}
              </span>
              {validation && (
                <span className="text-xs text-muted-foreground ml-auto">
                  Fuerza: {validation.strengthIndex} | Abuso: {validation.abuseIndex}
                </span>
              )}
            </div>
            {validation?.errors.map((e, i) => (
              <p key={i} className="text-[10px] text-red-400/80 pl-6">✗ {e}</p>
            ))}
            {validation?.warnings.map((w, i) => (
              <p key={i} className="text-[10px] text-amber-400/80 pl-6">⚠ {w}</p>
            ))}
          </GlassPanel>

          {/* Card grid */}
          <GlassPanel>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Cartas disponibles ({availableCards.length})</h3>
              <button
                onClick={() => setShowMobileCards(!showMobileCards)}
                className="xl:hidden text-xs text-blue-400"
              >
                {showMobileCards ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            {/* Position filter tabs */}
            <div className="flex gap-1 mb-3 overflow-x-auto">
              {positionTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setPositionFilter(tab.key)}
                  className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                    positionFilter === tab.key
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "text-muted-foreground hover:text-white border border-transparent"
                  }`}
                >
                  {tab.label} ({tab.cards.length})
                </button>
              ))}
            </div>

            {/* Cards grid */}
            <div className={`${showMobileCards ? "block" : "hidden"} xl:block`}>
              {filteredCards.length === 0 ? (
                <p className="text-xs text-muted-foreground/60 py-4 text-center">No hay cartas disponibles</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[500px] overflow-y-auto pr-1">
                  {filteredCards.map((card) => {
                    const isSelected = selectedCardId === card.id;
                    return (
                      <div key={card.id} className="relative">
                        <ProTradingCard
                          card={card}
                          size="sm"
                          interactive={true}
                          selected={isSelected}
                          onClick={() => setSelectedCardId(selectedCardId === card.id ? null : card.id)}
                        />
                        <div className="flex gap-1 mt-1">
                          <button
                            onClick={() => {
                              const emptyIdx = starters.findIndex((s) => !s);
                              if (emptyIdx !== -1) assignToSlot(emptyIdx, card.id);
                              else if (subs.length < 5) addSub(card.id);
                            }}
                            className="flex-1 py-1 text-[9px] bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-all"
                          >
                            Titular
                          </button>
                          <button
                            onClick={() => {
                              if (subs.length < 5) addSub(card.id);
                            }}
                            className="flex-1 py-1 text-[9px] bg-violet-600/20 text-violet-400 rounded hover:bg-violet-600/30 transition-all"
                          >
                            Suplente
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
