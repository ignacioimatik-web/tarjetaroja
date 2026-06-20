"use client";

import { useParams } from "next/navigation";
import { Trophy, ArrowLeft, Swords } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { EmptyState } from "@/components/layout/EmptyState";
import { updateStandings, resolveTieBreakers, getQualifiers, generateKnockoutBracket } from "@/lib/tournament";

export default function TournamentKnockoutPage() {
  const params = useParams();
  const tournaments = useStore((s) => s.tournaments);
  const teams = useStore((s) => s.teams);
  const matches = useStore((s) => s.matches);
  const setTournaments = useStore((s) => s.setTournaments);

  const tournament = tournaments.find((t) => t.id === params.id);

  if (!tournament) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EmptyState icon={Trophy} title="Torneo no encontrado" description="" action={<Link href="/tournaments" className="text-blue-400 hover:underline">Volver</Link>} />
      </div>
    );
  }

  const standings = updateStandings(matches, tournament);
  const sorted = resolveTieBreakers(standings, matches);
  const allGroupMatches = matches.filter((m) => m.tournamentId === tournament.id && m.phase === "group");
  const allGroupFinished = allGroupMatches.length > 0 && allGroupMatches.every((m) => m.status === "finished");
  const canAdvance = tournament.status === "groups" && allGroupFinished;
  const bracket = tournament.knockoutBracket;

  function handleAdvanceToKnockout() {
    if (!tournament) return;
    const { groupQualifiers, bestThird } = getQualifiers(sorted, matches, tournament.format, tournament.groups);
    const newBracket = generateKnockoutBracket(groupQualifiers, bestThird, tournament.format);
    setTournaments(
      tournaments.map((t) =>
        t.id === tournament.id
          ? { ...tournament, knockoutBracket: newBracket, status: "knockout" as const }
          : t
      )
    );
  }

  const rounds = [...new Set(bracket.map((m) => m.round))];
  const finalMatch = bracket.find((m) => m.round === "Final");
  const finalMatchObj = finalMatch?.matchId ? matches.find((m) => m.id === finalMatch.matchId) : undefined;
  const isFinalFinished = finalMatchObj?.status === "finished";
  const winnerTeamId = isFinalFinished
    ? (finalMatchObj.homeScore > finalMatchObj.awayScore
        ? finalMatch?.homeTeamId
        : finalMatchObj.awayScore > finalMatchObj.homeScore
          ? finalMatch?.awayTeamId
          : finalMatchObj.penaltyWinner)
    : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link href={`/tournaments/${tournament.id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Volver al torneo
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Eliminatorias</h1>
          <p className="text-sm text-muted-foreground">{tournament.name}</p>
        </div>
      </div>

      {canAdvance && (
        <GlassPanel className="mb-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">Todos los partidos de grupo han finalizado.</p>
          <button
            onClick={handleAdvanceToKnockout}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all"
          >
            Generar Eliminatorias
          </button>
        </GlassPanel>
      )}

      {!canAdvance && bracket.length === 0 && (
        <GlassPanel className="text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-white mb-2">Sin eliminatorias</h2>
          <p className="text-sm text-muted-foreground mb-4">La fase de grupos aún no ha finalizado.</p>
          <Link href={`/tournaments/${tournament.id}/groups`} className="text-blue-400 hover:underline text-sm">
            Ir a la fase de grupos
          </Link>
        </GlassPanel>
      )}

      {winnerTeamId && (
        <GlassPanel className="mb-6 text-center border-amber-500/30">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-amber-400" />
          <h2 className="text-2xl font-bold text-white mb-2">¡Campeón!</h2>
          <p className="text-xl text-amber-400 font-semibold">
            {teams.find((t) => t.id === winnerTeamId)?.name || "---"}
          </p>
        </GlassPanel>
      )}

      {bracket.length > 0 && (
        <div className="space-y-6">
          {rounds.map((round) => (
            <GlassPanel key={round}>
              <h3 className="text-sm font-semibold text-white mb-4">{round}</h3>
              <div className="space-y-2">
                {bracket
                  .filter((m) => m.round === round)
                  .sort((a, b) => a.position - b.position)
                  .map((m) => {
                    const homeTeam = m.homeTeamId ? teams.find((t) => t.id === m.homeTeamId) : null;
                    const awayTeam = m.awayTeamId ? teams.find((t) => t.id === m.awayTeamId) : null;
                    const match = m.matchId ? matches.find((mm) => mm.id === m.matchId) : null;
                    const isFinished = match?.status === "finished";

                    return (
                      <div key={m.id} className="flex items-center justify-between py-3 px-4 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-sm text-white truncate text-right flex-1">
                            {homeTeam?.name || "---"}
                          </span>
                          <span className="text-xs text-muted-foreground shrink-0">vs</span>
                          <span className="text-sm text-white truncate flex-1">
                            {awayTeam?.name || "---"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-3">
                          {isFinished ? (
                            <span className="text-sm font-bold text-white">
                              {match.homeScore}-{match.awayScore}
                            </span>
                          ) : m.homeTeamId && m.awayTeamId && m.matchId ? (
                            <Link
                              href={`/tournaments/${tournament.id}/match/${m.matchId}`}
                              className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                            >
                              <Swords className="w-3 h-3" /> Jugar
                            </Link>
                          ) : (
                            <span className="text-xs text-muted-foreground">Pendiente</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
}
