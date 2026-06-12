"use client";

import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Settings className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Ajustes</h1>
          <p className="text-sm text-muted-foreground">Configuración de la aplicación</p>
        </div>
      </div>

      <div className="glass rounded-xl p-8 text-center">
        <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-white mb-2">Ajustes</h2>
        <p className="text-sm text-muted-foreground">Próximamente: configuración.</p>
      </div>
    </div>
  );
}
