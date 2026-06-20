"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Swords, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { resolveRound, endMatch, getAvailableCards } from "@/lib/match";
import { updateStandings, advanceTeamsToKnockout } from "@/lib/tournament";
import type { MatchRound } from "@/types";

export default function MatchPage() {
  const params = useParams();
  const router = useRouter();
  const tournaments = useStore((s) => s.tournaments);
  const cards = useStore((s) => s.cards);
  const squads = useStore((s) => s.squads);
  const matches = useStore((s) => s.matches);
  const updateMatch = useStore((s) => s.updateMatch);
  const setTournaments = useStore((s) => s.setTournaments);
  const teams = useStore((s) => s.teams);

  const tournament = tournaments.find((t) => t.id === params.id);
  const match = matches.find((m) => m.id === params.matchId);
  const homeTeam = match ? teams.find((t) => t.id === match.homeTeamId) : undefined;
  const awayTeam = match ? teams.find((t) => t.id === match.awayTeamId) : undefined;
  const homeSquad = match ? squads.find((s) => s.teamId === match.homeTeamId) : undefined;
  const awaySquad = match ? squads.find((s) => s.teamId === match.awayTeamId) : undefined;
  const availableHomeCards = useMemo(() => {
    if (!match || match.status === "finished") return [];
    const starters = homeSquad?.starters || [];
    return getAvailableCards(cards, match, "home", starters);
  }, [cards, match, homeSquad]);

  const availableAwayCards = useMemo(() => {
    if (!match || match.status === "finished") return [];
    const starters = awaySquad?.starters || [];
    return getAvailableCards(cards, match, "away", starters);
  }, [cards, match, awaySquad]);

  const [selectedStat, setSelectedStat] = useState<"attack" | "control" | "defense">("attack");
  const [roundResult, setRoundResult] = useState<MatchRound | null>(null);
  const [currentRound, setCurrentRound] = useState(match?.rounds.length || 0);
  const [matchOver, setMatchOver] = useState(false);
  const [selectedHomeCard, setSelectedHomeCard] = useState<string | null>(
    availableHomeCards.length > 0 ? availableHomeCards[0]?.id || null : null
  );
  const [selectedAwayCard, setSelectedAwayCard] = useState<string | null>(
    availableAwayCards.length > 0 ? availableAwayCards[0]?.id || null : null
  );

  if (!tournament || !match) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="glass rounded-xl p-12 text-center">
          <Swords className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-white mb-2">Partido no encontrado</h2>
          <Link href={`/tournaments/${params.id}`} className="text-blue-400 hover:underline">Volver</Link>
        </div>
      </div>
    );
  }

  function handlePlayRound() {
    if (!selectedHomeCard || !selectedAwayCard || !match) return;

    const homeCard = cards.find((c) => c.id === selectedHomeCard);
    const awayCard = cards.find((c) => c.id === selectedAwayCard);
    if (!homeCard || !awayCard) return;

    const result = resolveRound(homeCard, awayCard, selectedStat, currentRound + 1);
    setRoundResult(result);

    const updatedRounds = [...match.rounds, result];
    updateMatch(match.id, { rounds: updatedRounds, status: "live" });

    setCurrentRound(currentRound + 1);
    setSelectedHomeCard(null);
    setSelectedAwayCard(null);
  }

  function handleEndMatch() {
    if (!match) return;
    const finished = endMatch({
      ...match,
      status: "live",
    });
    updateMatch(match.id, {
      homeScore: finished.homeScore,
      awayScore: finished.awayScore,
      status: "finished",
    });
    setMatchOver(true);
  }

  function handleProceed() {
    if (!match || !tournament) return;

    const updatedStandings = updateStandings(matches, tournament);

    let updatedBracket = tournament.knockoutBracket;
    if (match.phase === "knockout") {
      updatedBracket = advanceTeamsToKnockout(match, tournament.knockoutBracket);
    }

    const updatedTournament = {
      ...tournament,
      standings: updatedStandings,
      knockoutBracket: updatedBracket,
    };

    setTournaments(
      tournaments.map((t) => (t.id === tournament.id ? updatedTournament : t))
    );

    router.push(match.phase === "knockout" ? `/tournaments/${tournament.id}/knockout` : `/tournaments/${tournament.id}/groups`);
  }

  const maxRounds = tournament.rules.maxRounds;
  const isLastRound = currentRound >= maxRounds;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link href={`/tournaments/${tournament.id}/groups`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>

      {/* Scoreboard */}
      <GlassPanel className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <p className="text-xs text-muted-foreground mb-1">Local</p>
            <p className="text-lg font-bold text-white">{homeTeam?.name || "Local"}</p>
          </div>
          <div className="flex items-center gap-4 px-8">
            <span className="text-5xl font-black text-white">{match.homeScore}</span>
            <span className="text-2xl text-muted-foreground">-</span>
            <span className="text-5xl font-black text-white">{match.awayScore}</span>
          </div>
          <div className="flex-1 text-center">
            <p className="text-xs text-muted-foreground mb-1">Visitante</p>
            <p className="text-lg font-bold text-white">{awayTeam?.name || "Visitante"}</p>
          </div>
        </div>
        <div className="text-center mt-2">
          <span className="text-xs text-muted-foreground">Ronda {currentRound}/{maxRounds} · {selectedStat.toUpperCase()}</span>
        </div>
      </GlassPanel>

      {!matchOver && match.status !== "finished" ? (
        <>
          {/* Card selection */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-1">
              <GlassPanel>
                <h3 className="text-xs font-semibold text-white mb-3">Local · Escoge carta</h3>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {availableHomeCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => setSelectedHomeCard(card.id)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all ${
                        selectedHomeCard === card.id ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      {card.name} · {card.total}
                    </button>
                  ))}
                </div>
              </GlassPanel>
            </div>

            <div className="lg:col-span-1">
              <GlassPanel>
                <h3 className="text-xs font-semibold text-white mb-3">Estadística</h3>
                <div className="flex flex-col gap-2">
                  {(["attack", "control", "defense"] as const).map((stat) => (
                    <button
                      key={stat}
                      onClick={() => setSelectedStat(stat)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedStat === stat
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10"
                      }`}
                    >
                      {stat === "attack" ? "ATT · Ataque" : stat === "control" ? "CON · Control" : "DEF · Defensa"}
                    </button>
                  ))}
                </div>
              </GlassPanel>
            </div>

            <div className="lg:col-span-1">
              <GlassPanel>
                <h3 className="text-xs font-semibold text-white mb-3">Visitante · Escoge carta</h3>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {availableAwayCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => setSelectedAwayCard(card.id)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all ${
                        selectedAwayCard === card.id ? "bg-violet-500/20 text-violet-400 border border-violet-500/30" : "bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      {card.name} · {card.total}
                    </button>
                  ))}
                </div>
              </GlassPanel>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={handlePlayRound}
              disabled={!selectedHomeCard || !selectedAwayCard}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl disabled:opacity-50 hover:from-blue-500 hover:to-violet-500 transition-all"
            >
              <Swords className="w-4 h-4" /> Jugar Ronda
            </button>
            {isLastRound && (
              <button
                onClick={handleEndMatch}
                className="px-6 py-3 bg-red-600/20 text-red-400 font-semibold rounded-xl hover:bg-red-600/30 transition-all"
              >
                Finalizar Partido
              </button>
            )}
          </div>
        </>
      ) : matchOver || match.status === "finished" ? (
        <div className="text-center mb-6">
          <GlassPanel>
            <h2 className="text-xl font-bold text-white mb-2">Partido Finalizado</h2>
            <p className="text-4xl font-black text-gradient-gold mb-4">{match.homeScore} - {match.awayScore}</p>
            <button
              onClick={handleProceed}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-violet-500 transition-all"
            >
              Guardar y Volver
            </button>
          </GlassPanel>
        </div>
      ) : null}

      {/* Round Result */}
      {roundResult && (
        <GlassPanel className="mb-6">
          <h3 className="text-sm font-semibold text-white mb-3">Última ronda</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Local ({roundResult.statUsed.toUpperCase()})</p>
              <p className="text-lg font-bold text-white">{roundResult.homeValue}</p>
              <p className={`text-xs font-bold ${roundResult.winner === "home" ? "text-green-400" : "text-red-400"}`}>
                {roundResult.homeGoal ? "⚽ Gol" : "-"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Visitante ({roundResult.statUsed.toUpperCase()})</p>
              <p className="text-lg font-bold text-white">{roundResult.awayValue}</p>
              <p className={`text-xs font-bold ${roundResult.winner === "away" ? "text-green-400" : "text-red-400"}`}>
                {roundResult.awayGoal ? "⚽ Gol" : "-"}
              </p>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* Timeline */}
      <GlassPanel>
        <h3 className="text-sm font-semibold text-white mb-3">Timeline</h3>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {match.rounds.map((r, i) => (
            <div key={i} className="flex items-center justify-between py-1 px-2 rounded bg-white/5 text-xs">
              <span className="text-muted-foreground">R{i + 1}</span>
              <span className="text-white">{r.statUsed.toUpperCase()}</span>
              <span>{r.homeValue}-{r.awayValue}</span>
              <span className={r.winner === "home" ? "text-green-400" : r.winner === "away" ? "text-blue-400" : "text-amber-400"}>
                {r.winner === "home" ? "⚽" : r.winner === "away" ? "⚽" : "—"}
              </span>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
