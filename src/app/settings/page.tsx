"use client";

import { Settings, HardDrive, Database, ShieldCheck, ExternalLink } from "lucide-react";
import Link from "next/link";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { useStore } from "@/store/useStore";

export default function SettingsPage() {
  const cards = useStore((s) => s.cards);
  const teams = useStore((s) => s.teams);
  const tournaments = useStore((s) => s.tournaments);
  const matches = useStore((s) => s.matches);
  const squads = useStore((s) => s.squads);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Settings className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Ajustes</h1>
          <p className="text-sm text-muted-foreground">Información y configuración de la aplicación</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassPanel>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-blue-400" /> Almacenamiento
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Cartas</span><span className="text-white">{cards.length}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Equipos</span><span className="text-white">{teams.length}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Plantillas</span><span className="text-white">{squads.length}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Torneos</span><span className="text-white">{tournaments.length}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Partidos</span><span className="text-white">{matches.length}</span></div>
          </div>
        </GlassPanel>

        <GlassPanel>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" /> Persistencia
          </h3>
          <p className="text-xs text-muted-foreground mb-3">Los datos se guardan automáticamente en el navegador (localStorage).</p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline"
          >
            <ExternalLink className="w-3 h-3" /> Administrar datos (backup / restore)
          </Link>
        </GlassPanel>

        <GlassPanel>
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" /> Acerca de
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">App</span><span className="text-white">Adrenalyn Cup</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Versión</span><span className="text-white">0.1.0</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Framework</span><span className="text-white">Next.js</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Almacenaje</span><span className="text-white">localStorage</span></div>
          </div>
        </GlassPanel>

        <GlassPanel>
          <h3 className="text-sm font-semibold text-white mb-4">Atajos</h3>
          <div className="space-y-2">
            <Link href="/cards/new" className="block w-full text-center py-2 bg-blue-600/20 text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-600/30 transition-all">
              Nueva Carta
            </Link>
            <Link href="/teams/new" className="block w-full text-center py-2 bg-blue-600/20 text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-600/30 transition-all">
              Nuevo Equipo
            </Link>
            <Link href="/tournaments/new" className="block w-full text-center py-2 bg-blue-600/20 text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-600/30 transition-all">
              Nuevo Torneo
            </Link>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
