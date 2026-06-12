"use client";

import { useParams } from "next/navigation";
import { Trophy, Users } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { EmptyState } from "@/components/layout/EmptyState";
import { updateStandings, resolveTieBreakers } from "@/lib/tournament";

export default function TournamentDetailPage() {
  const params = useParams();
  const tournaments = useStore((s) => s.tournaments);
  const teams = useStore((s) => s.teams);
  const matches = useStore((s) => s.matches);

  const tournament = tournaments.find((t) => t.id === params.id);

  if (!tournament) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EmptyState icon={Trophy} title="Torneo no encontrado" description="El torneo no existe" action={<Link href="/tournaments" className="text-blue-400 hover:underline">Volver</Link>} />
      </div>
    );
  }

  const standings = updateStandings(matches, tournament);
  const sortedStandings = resolveTieBreakers(standings, matches);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/tournaments" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-white mb-4">
        ← Volver
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{tournament.name}</h1>
          <p className="text-sm text-muted-foreground">
            {tournament.format} equipos · {tournament.mode} · {tournament.status === "pending" ? "Pendiente" : tournament.status === "groups" ? "Fase de grupos" : tournament.status === "knockout" ? "Eliminatorias" : "Finalizado"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Groups */}
          {tournament.groups.map((group) => (
            <GlassPanel key={group.id}>
              <h3 className="text-sm font-semibold text-white mb-3">{group.name}</h3>
              <div className="space-y-1">
                {group.teamIds.map((teamId) => {
                  const team = teams.find((t) => t.id === teamId);
                  const standing = sortedStandings.find((s) => s.teamId === teamId);
                  return (
                    <div key={teamId} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center">
                          <Users className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-white">{team?.name || "Unknown"}</span>
                      </div>
                      {standing && (
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>PJ:{standing.played}</span>
                          <span>G:{standing.won}</span>
                          <span>E:{standing.drawn}</span>
                          <span>P:{standing.lost}</span>
                          <span className="text-white font-bold">{standing.points}pts</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </GlassPanel>
          ))}

          {/* Knockout bracket */}
          {tournament.knockoutBracket.length > 0 && (
            <GlassPanel>
              <h3 className="text-sm font-semibold text-white mb-3">Eliminatorias</h3>
              <div className="space-y-2">
                {tournament.knockoutBracket.map((m) => {
                  const homeTeam = m.homeTeamId ? teams.find((t) => t.id === m.homeTeamId) : null;
                  const awayTeam = m.awayTeamId ? teams.find((t) => t.id === m.awayTeamId) : null;
                  const match = m.matchId ? matches.find((mm) => mm.id === m.matchId) : null;
                  return (
                    <div key={m.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5">
                      <span className="text-[10px] text-muted-foreground w-20">{m.round}</span>
                      <div className="flex items-center gap-2 flex-1 justify-center">
                        <span className="text-sm text-white">{homeTeam?.name || "---"}</span>
                        <span className="text-xs text-muted-foreground">vs</span>
                        <span className="text-sm text-white">{awayTeam?.name || "---"}</span>
                      </div>
                      {match ? (
                        <span className="text-sm font-bold text-white">{match.homeScore}-{match.awayScore}</span>
                      ) : (
                        homeTeam && awayTeam && m.matchId ? (
                          <Link href={`/tournaments/${tournament.id}/match/${m.matchId}`} className="text-xs text-blue-400 hover:underline">
                            Jugar
                          </Link>
                        ) : null
                      )}
                    </div>
                  );
                })}
              </div>
            </GlassPanel>
          )}
        </div>

        <div className="space-y-4">
          <GlassPanel>
            <h3 className="text-sm font-semibold text-white mb-2">Acciones</h3>
            <div className="space-y-2">
              {tournament.status === "groups" && (
                <Link
                  href={`/tournaments/${tournament.id}/groups`}
                  className="block w-full text-center py-2 bg-blue-600/20 text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-600/30 transition-all"
                >
                  Ver Grupos y Calendario
                </Link>
              )}
              {tournament.status === "knockout" && (
                <Link
                  href={`/tournaments/${tournament.id}/knockout`}
                  className="block w-full text-center py-2 bg-violet-600/20 text-violet-400 text-sm font-medium rounded-lg hover:bg-violet-600/30 transition-all"
                >
                  Ver Eliminatorias
                </Link>
              )}
            </div>
          </GlassPanel>

          <GlassPanel>
            <h3 className="text-sm font-semibold text-white mb-2">Información</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Formato</span><span className="text-white">{tournament.format} equipos</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Modo</span><span className="text-white">{tournament.mode}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Grupos</span><span className="text-white">{tournament.groups.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Estado</span><span className="text-white">{tournament.status}</span></div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
