"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shirt, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { generateId } from "@/lib/utils";
import type { Team, TeamType } from "@/types";

export default function NewTeamPage() {
  const router = useRouter();
  const addTeam = useStore((s) => s.addTeam);
  const [team, setTeam] = useState<Partial<Team>>({ name: "", type: "club", colors: { primary: "#3b82f6", secondary: "#ffffff", accent: "#000000" } });

  function handleSave() {
    if (!team.name?.trim()) return;
    addTeam({
      id: generateId(),
      name: team.name!,
      type: (team.type as TeamType) || "club",
      country: team.country,
      league: team.league,
      colors: team.colors,
      createdAt: new Date().toISOString(),
    });
    router.push("/teams");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/teams" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Shirt className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Nuevo Equipo</h1>
          <p className="text-sm text-muted-foreground">Crea un equipo o selección</p>
        </div>
      </div>

      <div className="glass rounded-xl p-6 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Nombre del equipo</label>
          <input
            value={team.name}
            onChange={(e) => setTeam({ ...team, name: e.target.value })}
            placeholder="Ej: Real Madrid FC"
            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Tipo</label>
          <select
            value={team.type}
            onChange={(e) => setTeam({ ...team, type: e.target.value as TeamType })}
            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white focus:outline-none focus:border-blue-500/50"
          >
            <option value="club">Club</option>
            <option value="national">Selección Nacional</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">País</label>
          <input
            value={team.country || ""}
            onChange={(e) => setTeam({ ...team, country: e.target.value })}
            placeholder="Opcional"
            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/50"
          />
        </div>

        {team.type === "club" && (
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Liga</label>
            <input
              value={team.league || ""}
              onChange={(e) => setTeam({ ...team, league: e.target.value })}
              placeholder="Opcional"
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/50"
            />
          </div>
        )}

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Color primario</label>
          <input
            type="color"
            value={team.colors?.primary || "#3b82f6"}
            onChange={(e) => setTeam({ ...team, colors: { ...team.colors!, primary: e.target.value } })}
            className="w-full h-10 rounded-lg bg-black/40 border border-border cursor-pointer"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!team.name?.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Save className="w-4 h-4" /> Guardar Equipo
        </button>
      </div>
    </div>
  );
}
