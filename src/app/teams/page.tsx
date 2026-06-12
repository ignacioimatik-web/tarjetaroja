"use client";

import { useState } from "react";
import { Shirt, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { EmptyState } from "@/components/layout/EmptyState";

export default function TeamsPage() {
  const teams = useStore((s) => s.teams);
  const deleteTeam = useStore((s) => s.deleteTeam);
  const [filter, setFilter] = useState<"all" | "national" | "club" | "draft">("all");

  const filtered = teams.filter((t) => filter === "all" || t.type === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Shirt className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Equipos</h1>
            <p className="text-sm text-muted-foreground">{teams.length} equipos</p>
          </div>
        </div>
        <Link
          href="/teams/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:from-blue-500 hover:to-violet-500"
        >
          <Plus className="w-4 h-4" /> Nuevo
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "national", "club", "draft"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-muted-foreground hover:text-white border border-transparent"
            }`}
          >
            {f === "all" ? "Todos" : f === "national" ? "Selecciones" : f === "club" ? "Clubes" : "Draft"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Shirt}
          title="No hay equipos"
          description="Crea tu primer equipo para empezar"
          action={
            <Link
              href="/teams/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl"
            >
              <Plus className="w-4 h-4" /> Crear Equipo
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((team) => (
            <GlassPanel key={team.id} hover>
              <Link href={`/teams/${team.id}`} className="block">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: team.colors?.primary || "#333" }}
                  >
                    <Shirt className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">{team.name}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase">
                      {team.type === "national" ? "Selección" : team.type === "club" ? "Club" : "Draft"}
                      {team.country ? ` · ${team.country}` : ""}
                    </p>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => deleteTeam(team.id)}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
}
