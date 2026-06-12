"use client";

import { Plus, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { EmptyState } from "@/components/layout/EmptyState";

export default function TournamentsPage() {
  const tournaments = useStore((s) => s.tournaments);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Torneos</h1>
            <p className="text-sm text-muted-foreground">{tournaments.length} torneos</p>
          </div>
        </div>
        <Link
          href="/tournaments/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:from-blue-500 hover:to-violet-500"
        >
          <Plus className="w-4 h-4" /> Nuevo
        </Link>
      </div>

      {tournaments.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No hay torneos"
          description="Crea tu primer torneo para empezar a competir"
          action={
            <Link
              href="/tournaments/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl"
            >
              <Plus className="w-4 h-4" /> Crear Torneo
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {tournaments.map((t) => (
            <Link key={t.id} href={`/tournaments/${t.id}`}>
              <GlassPanel hover>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">{t.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t.format} equipos · {t.mode} · {t.status === "pending" ? "Pendiente" : t.status === "groups" ? "Fase de grupos" : t.status === "knockout" ? "Eliminatorias" : "Finalizado"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-[10px] text-blue-400 font-medium">{t.mode}</span>
                      <span className="px-2 py-0.5 rounded bg-violet-500/10 text-[10px] text-violet-400 font-medium">{t.format} eq.</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              </GlassPanel>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
