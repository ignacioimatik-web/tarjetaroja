"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { createTournamentEngine, calculatePotsByStrength, drawGroups } from "@/lib/tournament";
import { TOURNAMENT_FORMATS, TOURNAMENT_MODES } from "@/lib/constants";
import { validateSquad } from "@/lib/rules";
import type { TournamentMode, TournamentFormat } from "@/types";

export default function NewTournamentPage() {
  const router = useRouter();
  const teams = useStore((s) => s.teams);
  const cards = useStore((s) => s.cards);
  const squads = useStore((s) => s.squads);
  const createTournament = useStore((s) => s.createTournament);

  const [name, setName] = useState("");
  const [mode, setMode] = useState<TournamentMode>("standard");
  const [format, setFormat] = useState<TournamentFormat>(8);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  const isValid = teams.length >= format && selectedTeams.length === format;

  function handleCreate() {
    if (!name.trim() || !isValid) return;

    const tournamentTeams = teams.filter((t) => selectedTeams.includes(t.id));

    // Validate squads
    const invalidTeams: string[] = [];
    for (const team of tournamentTeams) {
      const squad = squads.find((s) => s.teamId === team.id);
      if (!squad) {
        invalidTeams.push(team.name);
        continue;
      }
      const validation = validateSquad(squad, cards, team, mode);
      if (!validation.valid) {
        invalidTeams.push(team.name);
      }
    }

    if (invalidTeams.length > 0) {
      alert(`Equipos con plantillas inválidas: ${invalidTeams.join(", ")}`);
      return;
    }

    let tournament = createTournamentEngine(name, mode, format, tournamentTeams);
    const pots = calculatePotsByStrength(tournamentTeams, cards, squads);
    tournament = drawGroups(tournament, pots);
    createTournament(tournament);
    router.push(`/tournaments/${tournament.id}`);
  }

  function toggleTeam(teamId: string) {
    setSelectedTeams((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/tournaments" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Nuevo Torneo</h1>
          <p className="text-sm text-muted-foreground">Paso {step} de 3</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`flex-1 h-1 rounded-full ${step >= s ? "bg-gradient-to-r from-blue-500 to-violet-500" : "bg-zinc-800"}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Datos básicos</h2>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Nombre del torneo</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Adrenalyn Cup 2025" className="w-full px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Modo</label>
            <select value={mode} onChange={(e) => setMode(e.target.value as TournamentMode)} className="w-full px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white focus:outline-none focus:border-blue-500/50">
              {TOURNAMENT_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <p className="text-[10px] text-muted-foreground mt-1">{TOURNAMENT_MODES.find((m) => m.value === mode)?.description}</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Formato</label>
            <div className="grid grid-cols-2 gap-2">
              {TOURNAMENT_FORMATS.map((f) => (
                <button key={f.value} onClick={() => setFormat(f.value)} className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${format === f.value ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-black/40 text-muted-foreground border border-transparent hover:border-border"}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setStep(2)} disabled={!name.trim()} className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl disabled:opacity-50 hover:from-blue-500 hover:to-violet-500 transition-all">Siguiente</button>
        </div>
      )}

      {step === 2 && (
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Seleccionar equipos ({selectedTeams.length}/{format})</h2>
          <p className="text-xs text-muted-foreground">Selecciona exactamente {format} equipos con plantillas válidas</p>
          <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
            {teams.map((team) => {
              const squad = squads.find((s) => s.teamId === team.id);
              const hasSquad = !!squad;
              const selected = selectedTeams.includes(team.id);
              return (
                <button key={team.id} onClick={() => hasSquad && toggleTeam(team.id)} disabled={!hasSquad} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all ${selected ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : hasSquad ? "bg-black/40 text-white hover:bg-white/5 border border-transparent" : "bg-black/20 text-muted-foreground border border-transparent opacity-50"}`}>
                  <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: team.colors?.primary || "#333" }}>
                    <Users className="w-3 h-3 text-white" />
                  </div>
                  <span className="truncate">{team.name}</span>
                  {!hasSquad && <span className="text-[8px] text-red-400 ml-auto">Sin plantilla</span>}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 bg-black/40 text-white font-medium rounded-xl border border-border hover:bg-white/5 transition-all">Atrás</button>
            <button onClick={() => setStep(3)} disabled={selectedTeams.length !== format} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl disabled:opacity-50 hover:from-blue-500 hover:to-violet-500 transition-all">Siguiente</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Confirmar torneo</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Nombre</span><span className="text-white">{name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Modo</span><span className="text-white">{TOURNAMENT_MODES.find((m) => m.value === mode)?.label}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Formato</span><span className="text-white">{TOURNAMENT_FORMATS.find((f) => f.value === format)?.label}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Equipos</span><span className="text-white">{selectedTeams.length}</span></div>
          </div>
          <div className="border-t border-border pt-3">
            <h3 className="text-xs text-muted-foreground mb-2">Equipos seleccionados:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedTeams.map((id) => {
                const team = teams.find((t) => t.id === id);
                return team ? <span key={id} className="px-2 py-1 rounded bg-white/5 text-xs text-white">{team.name}</span> : null;
              })}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Al crear el torneo se realizará el sorteo de grupos automáticamente.</p>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-3 bg-black/40 text-white font-medium rounded-xl border border-border hover:bg-white/5 transition-all">Atrás</button>
            <button onClick={handleCreate} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-violet-500 transition-all">
              <Trophy className="w-4 h-4" /> Crear Torneo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
