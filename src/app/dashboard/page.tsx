"use client";

import { Trophy, Shirt, Swords, Users, Target, Shield, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { StatCard } from "@/components/layout/StatCard";

export default function DashboardPage() {
  const cards = useStore((s) => s.cards);
  const teams = useStore((s) => s.teams);
  const tournaments = useStore((s) => s.tournaments);
  const matches = useStore((s) => s.matches);

  const activeTournament = tournaments.find((t) => t.status === "groups" || t.status === "knockout");
  const finishedMatches = matches.filter((m) => m.status === "finished");
  const totalGoals = finishedMatches.reduce((a, m) => a + m.homeScore + m.awayScore, 0);

  const topCards = [...cards]
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const topTeams = teams
    .map((t) => ({
      team: t,
      cards: cards.filter((c) => c.teamName === t.name),
      avgTotal: cards.filter((c) => c.teamName === t.name).reduce((a, c) => a + c.total, 0),
    }))
    .filter((t) => t.cards.length > 0)
    .sort((a, b) => b.avgTotal - a.avgTotal)
    .slice(0, 5);

  const lastMatches = [...matches]
    .filter((m) => m.status === "finished")
    .slice(-5)
    .reverse();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Panel de control del campeonato</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <StatCard icon={Trophy} label="Cartas" value={cards.length} color="blue" />
        <StatCard icon={Shirt} label="Equipos" value={teams.length} color="violet" />
        <StatCard icon={Users} label="Torneos" value={tournaments.length} color="amber" />
        <StatCard icon={Swords} label="Partidos" value={matches.length} sublabel={`${finishedMatches.length} finalizados`} color="red" />
        <StatCard icon={Target} label="Goles" value={totalGoals} color="green" />
        <StatCard icon={Zap} label="Media de cartas" value={cards.length > 0 ? Math.round(cards.reduce((a, c) => a + c.total, 0) / cards.length) : 0} color="cyan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Active Tournament */}
        <GlassPanel>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Torneo Activo
          </h3>
          {activeTournament ? (
            <div>
              <p className="text-base font-bold text-white">{activeTournament.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {activeTournament.format} equipos · {activeTournament.mode} · {activeTournament.status}
              </p>
              <Link
                href={`/tournaments/${activeTournament.id}`}
                className="inline-flex items-center gap-1 mt-3 text-xs text-blue-400 hover:underline"
              >
                Ir al torneo →
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground">No hay torneo activo</p>
              <Link
                href="/tournaments/new"
                className="inline-flex items-center gap-1 mt-2 text-xs text-blue-400 hover:underline"
              >
                Crear torneo →
              </Link>
            </div>
          )}
        </GlassPanel>

        {/* Top Cards */}
        <GlassPanel>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            Mejores Cartas
          </h3>
          <div className="space-y-1">
            {topCards.map((card, i) => (
              <div key={card.id} className="flex items-center justify-between py-1 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-muted-foreground w-4">#{i + 1}</span>
                  <span className="text-white truncate">{card.name}</span>
                </div>
                <span className="text-amber-400 font-bold">{card.total}</span>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Top Teams */}
        <GlassPanel>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            Mejores Equipos
          </h3>
          <div className="space-y-1">
            {topTeams.map((t, i) => (
              <div key={t.team.id} className="flex items-center justify-between py-1 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-muted-foreground w-4">#{i + 1}</span>
                  <span className="text-white truncate">{t.team.name}</span>
                </div>
                <span className="text-amber-400 font-bold">{t.cards.length} cartas</span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      {/* Last matches */}
      {lastMatches.length > 0 && (
        <GlassPanel>
          <h3 className="text-sm font-semibold text-white mb-3">Últimos Partidos</h3>
          <div className="space-y-1">
            {lastMatches.map((m) => {
              const home = teams.find((t) => t.id === m.homeTeamId);
              const away = teams.find((t) => t.id === m.awayTeamId);
              return (
                <div key={m.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 text-sm">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-white truncate">{home?.name || "---"}</span>
                    <span className="text-muted-foreground">vs</span>
                    <span className="text-white truncate">{away?.name || "---"}</span>
                  </div>
                  <span className="font-bold text-white ml-2">{m.homeScore} - {m.awayScore}</span>
                </div>
              );
            })}
          </div>
        </GlassPanel>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <Link href="/cards/new" className="glass rounded-xl p-4 text-center hover:bg-white/[0.07] transition-all">
          <Trophy className="w-6 h-6 mx-auto mb-2 text-blue-400" />
          <p className="text-xs font-medium text-white">Nueva Carta</p>
        </Link>
        <Link href="/teams/new" className="glass rounded-xl p-4 text-center hover:bg-white/[0.07] transition-all">
          <Shirt className="w-6 h-6 mx-auto mb-2 text-violet-400" />
          <p className="text-xs font-medium text-white">Nuevo Equipo</p>
        </Link>
        <Link href="/tournaments/new" className="glass rounded-xl p-4 text-center hover:bg-white/[0.07] transition-all">
          <Users className="w-6 h-6 mx-auto mb-2 text-amber-400" />
          <p className="text-xs font-medium text-white">Nuevo Torneo</p>
        </Link>
        <Link href="/cards" className="glass rounded-xl p-4 text-center hover:bg-white/[0.07] transition-all">
          <Swords className="w-6 h-6 mx-auto mb-2 text-red-400" />
          <p className="text-xs font-medium text-white">Ver Cartas</p>
        </Link>
      </div>
    </div>
  );
}
