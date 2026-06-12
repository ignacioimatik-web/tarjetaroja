"use client";

import { useParams } from "next/navigation";
import { Trophy, ArrowLeft, Calendar, Swords } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { EmptyState } from "@/components/layout/EmptyState";
import { updateStandings, resolveTieBreakers } from "@/lib/tournament";
import { generateId } from "@/lib/utils";
import { startMatch } from "@/lib/match";

export default function TournamentGroupsPage() {
  const params = useParams();
  const tournaments = useStore((s) => s.tournaments);
  const teams = useStore((s) => s.teams);
  const matches = useStore((s) => s.matches);
  const addMatch = useStore((s) => s.addMatch);
  const updateTournament = useStore((s) => s.setTournaments);

  const tournament = tournaments.find((t) => t.id === params.id);

  if (!tournament) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EmptyState icon={Trophy} title="Torneo no encontrado" description="" action={<Link href="/tournaments" className="text-blue-400 hover:underline">Volver</Link>} />
      </div>
    );
  }

  const standings = tournament ? updateStandings(matches, tournament) : [];
  const sorted = resolveTieBreakers(standings, matches);

  function handlePlayMatch(homeTeamId: string, awayTeamId: string) {
    if (!tournament) return;
    const matchId = generateId();
    const match = startMatch(tournament.id, homeTeamId, awayTeamId, "group", "group");
    match.id = matchId;
    addMatch(match);

    const updatedGroups = tournament.groups.map((g) => {
      if (g.teamIds.includes(homeTeamId) && g.teamIds.includes(awayTeamId)) {
        return { ...g, calendar: [...g.calendar, matchId] };
      }
      return g;
    });
    updateTournament(tournaments.map((t) => t.id === tournament.id ? { ...tournament, groups: updatedGroups } : t));
  }

  const tournamentMatches = matches.filter((m) => m.tournamentId === params.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link href={`/tournaments/${tournament.id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Volver al torneo
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <Calendar className="w-5 h-5 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Grupos y Calendario</h1>
      </div>

      <div className="space-y-8">
        {tournament.groups.map((group) => {
          const groupStandings = sorted.filter((s) => s.groupId === group.id);
          const groupMatches = tournamentMatches.filter((m) =>
            group.teamIds.includes(m.homeTeamId) && group.teamIds.includes(m.awayTeamId)
          );

          return (
            <GlassPanel key={group.id}>
              <h3 className="text-lg font-semibold text-white mb-4">{group.name}</h3>

              {/* Standings */}
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-muted-foreground border-b border-border">
                      <th className="text-left py-2 pr-2">Equipo</th>
                      <th className="py-2 px-1 text-center">PJ</th>
                      <th className="py-2 px-1 text-center">G</th>
                      <th className="py-2 px-1 text-center">E</th>
                      <th className="py-2 px-1 text-center">P</th>
                      <th className="py-2 px-1 text-center">GF</th>
                      <th className="py-2 px-1 text-center">GC</th>
                      <th className="py-2 px-1 text-center">DG</th>
                      <th className="py-2 pl-1 text-center text-white font-bold">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupStandings.map((s, i) => {
                      const team = teams.find((t) => t.id === s.teamId);
                      return (
                        <tr key={s.teamId} className="border-b border-border/50">
                          <td className="py-2 pr-2 flex items-center gap-2">
                            <span className="text-muted-foreground">{i + 1}.</span>
                            <span className="text-white">{team?.name || "---"}</span>
                          </td>
                          <td className="py-2 text-center">{s.played}</td>
                          <td className="py-2 text-center text-green-400">{s.won}</td>
                          <td className="py-2 text-center text-amber-400">{s.drawn}</td>
                          <td className="py-2 text-center text-red-400">{s.lost}</td>
                          <td className="py-2 text-center">{s.goalsFor}</td>
                          <td className="py-2 text-center">{s.goalsAgainst}</td>
                          <td className="py-2 text-center">{s.goalDifference}</td>
                          <td className="py-2 text-center text-white font-bold">{s.points}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Match calendar */}
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">Partidos</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(() => {
                  const pairs: [string, string][] = [];
                  for (let i = 0; i < group.teamIds.length; i++) {
                    for (let j = i + 1; j < group.teamIds.length; j++) {
                      pairs.push([group.teamIds[i], group.teamIds[j]]);
                    }
                  }
                  return pairs.map(([homeId, awayId]) => {
                    const existingMatch = groupMatches.find(
                      (m) => m.homeTeamId === homeId && m.awayTeamId === awayId
                    );
                    const homeTeam = teams.find((t) => t.id === homeId);
                    const awayTeam = teams.find((t) => t.id === awayId);
                    const hasMatch = !!existingMatch;

                    return (
                      <div key={`${homeId}-${awayId}`} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-1.5 text-xs min-w-0 flex-1">
                          <span className="text-white truncate">{homeTeam?.name || "---"}</span>
                          <span className="text-muted-foreground shrink-0">vs</span>
                          <span className="text-white truncate">{awayTeam?.name || "---"}</span>
                        </div>
                        {hasMatch ? (
                          existingMatch.status === "finished" ? (
                            <span className="text-xs font-bold text-white shrink-0 ml-2">{existingMatch.homeScore}-{existingMatch.awayScore}</span>
                          ) : (
                            <Link
                              href={`/tournaments/${tournament.id}/match/${existingMatch.id}`}
                              className="text-xs text-blue-400 hover:underline shrink-0 ml-2 flex items-center gap-1"
                            >
                              <Swords className="w-3 h-3" /> Jugar
                            </Link>
                          )
                        ) : (
                          <button
                            onClick={() => handlePlayMatch(homeId, awayId)}
                            className="text-xs text-blue-400 hover:underline shrink-0 ml-2"
                          >
                            Iniciar
                          </button>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
}
