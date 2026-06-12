"use client";

import { useState, useRef } from "react";
import { Settings, Download, Upload, AlertTriangle, RefreshCw, CheckCircle2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { SEED_CARDS, SEED_TEAMS } from "@/lib/seed";

export default function AdminPage() {
  const exportBackup = useStore((s) => s.exportBackup);
  const importBackup = useStore((s) => s.importBackup);
  const resetDemoData = useStore((s) => s.resetDemoData);
  const setCards = useStore((s) => s.setCards);
  const setTeams = useStore((s) => s.setTeams);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleExport() {
    const json = exportBackup();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `adrenalyn-cup-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ type: "success", text: "Backup exportado correctamente" });
  }

  function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        importBackup(text);
        setMessage({ type: "success", text: "Backup importado correctamente" });
      } catch {
        setMessage({ type: "error", text: "Error al importar el backup" });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleReset() {
    if (window.confirm("¿Estás seguro? Se borrarán todos los datos locales.")) {
      resetDemoData();
      setMessage({ type: "success", text: "Datos restablecidos" });
    }
  }

  function handleLoadSeed() {
    if (window.confirm("¿Cargar datos de demostración? Se añadirán a los datos existentes.")) {
      setCards(SEED_CARDS);
      setTeams(SEED_TEAMS);
      setMessage({ type: "success", text: "Datos de demostración cargados" });
    }
  }

  const state = useStore.getState();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Settings className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Administración</h1>
          <p className="text-sm text-muted-foreground">Gestión de datos y configuración</p>
        </div>
      </div>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-xl flex items-center gap-2 text-sm ${
          message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <GlassPanel>
          <h3 className="text-sm font-semibold text-white mb-4">Diagnóstico de datos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-white">{state.cards.length}</p>
              <p className="text-xs text-muted-foreground">Cartas</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-white">{state.teams.length}</p>
              <p className="text-xs text-muted-foreground">Equipos</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-white">{state.tournaments.length}</p>
              <p className="text-xs text-muted-foreground">Torneos</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-white">{state.matches.length}</p>
              <p className="text-xs text-muted-foreground">Partidos</p>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel>
          <h3 className="text-sm font-semibold text-white mb-4">Exportar / Importar</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:from-blue-500 hover:to-violet-500 transition-all"
            >
              <Download className="w-4 h-4" /> Exportar Backup
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 bg-black/40 text-white text-sm font-semibold rounded-xl border border-border hover:bg-white/10 transition-all"
            >
              <Upload className="w-4 h-4" /> Importar Backup
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </GlassPanel>

        <GlassPanel>
          <h3 className="text-sm font-semibold text-white mb-4">Mantenimiento</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleLoadSeed}
              className="flex items-center gap-2 px-4 py-2.5 bg-black/40 text-white text-sm font-semibold rounded-xl border border-border hover:bg-white/10 transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Cargar Datos Demo
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 text-red-400 text-sm font-semibold rounded-xl border border-red-500/20 hover:bg-red-600/30 transition-all"
            >
              <AlertTriangle className="w-4 h-4" /> Resetear Datos
            </button>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
