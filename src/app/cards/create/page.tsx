"use client";

import { useState, useRef } from "react";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import Link from "next/link";
import { toPng } from "html-to-image";
import { cn } from "@/lib/utils";
import { PlayerCard, type Player, type PlayerCardHandle } from "@/components/cards/PlayerCard";
import { useTemplates } from "@/lib/card-templates/context";
import { DEFAULT_LAYOUT } from "@/lib/card-templates/storage";
import type { CardTemplate, LayoutConfig } from "@/types";

const defaultPlayer: Player = {
  name: "Alex Rider",
  position: "FWD",
  overall: 92,
  team: "Tokyo Storm",
  nationality: "Japan",
  rarity: "legendary",
  imageUrl: "https://picsum.photos/seed/alex-editor/400/500",
  stats: { pace: 94, shooting: 90, passing: 85, dribbling: 92, defense: 40, physical: 78 },
};

const statKeys: Array<{ key: keyof Player["stats"]; label: string }> = [
  { key: "pace", label: "Ritmo" },
  { key: "shooting", label: "Tiro" },
  { key: "passing", label: "Pase" },
  { key: "dribbling", label: "Regate" },
  { key: "defense", label: "Defensa" },
  { key: "physical", label: "Físico" },
];

const rarityOptions: Player["rarity"][] = ["common", "rare", "epic", "legendary", "mythic"];

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}

function SliderControl({ label, value, min, max, step, onChange }: SliderControlProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-muted-foreground w-16 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 accent-violet-500 h-1"
      />
      <span className="text-[10px] text-white font-mono w-8 text-right tabular-nums">{value}</span>
    </div>
  );
}

export default function CreateCardPage() {
  const { templates } = useTemplates();
  const cardHandleRef = useRef<PlayerCardHandle>(null);
  const [player, setPlayer] = useState<Player>({ ...defaultPlayer });
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null);
  const [showSelector, setShowSelector] = useState(true);
  const [exportState, setExportState] = useState<"idle" | "loading" | "error">("idle");
  const [exportError, setExportError] = useState("");

  function updatePlayer(field: keyof Player, value: string | number) {
    setPlayer((prev) => ({ ...prev, [field]: value }));
  }

  function updateStat(key: keyof Player["stats"], value: number) {
    setPlayer((prev) => {
      const newStats = { ...prev.stats, [key]: value };
      const overall = Math.round(
        (Object.values(newStats) as number[]).reduce((a, b) => a + b, 0) / 6
      );
      return { ...prev, stats: newStats, overall };
    });
  }

  function updateLayout(field: keyof LayoutConfig, prop: string, value: number) {
    if (!selectedTemplate) return;
    setSelectedTemplate({
      ...selectedTemplate,
      layoutConfig: {
        ...selectedTemplate.layoutConfig,
        [field]: { ...selectedTemplate.layoutConfig[field], [prop]: value },
      },
    });
  }

  async function handleExport() {
    const el = cardHandleRef.current?.getCardElement();
    if (!el) {
      setExportState("error");
      setExportError("No se encontró la tarjeta para exportar");
      return;
    }
    setExportState("loading");
    setExportError("");
    try {
      const dataUrl = await toPng(el, {
        pixelRatio: 3,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `${player.name.replace(/\s+/g, "-").toLowerCase()}-card.png`;
      link.href = dataUrl;
      link.click();
      setExportState("idle");
    } catch (err) {
      setExportState("error");
      setExportError(err instanceof Error ? err.message : "Failed to export image");
    }
  }

  function resetLayout() {
    if (!selectedTemplate) return;
    setSelectedTemplate({
      ...selectedTemplate,
      layoutConfig: JSON.parse(JSON.stringify(DEFAULT_LAYOUT)),
    });
  }

  const lc = selectedTemplate?.layoutConfig;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/cards/templates"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a plantillas
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Download className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Crear Ficha con Plantilla</h1>
          <p className="text-sm text-muted-foreground">Selecciona una plantilla, ajusta posición y exporta</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Form + Controls */}
        <div className="lg:col-span-3 space-y-6">
          {/* Player data */}
          <div className="glass rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">Datos del jugador</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Nombre</label>
                <input
                  value={player.name}
                  onChange={(e) => updatePlayer("name", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Equipo</label>
                <input
                  value={player.team}
                  onChange={(e) => updatePlayer("team", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Nacionalidad</label>
                <input
                  value={player.nationality}
                  onChange={(e) => updatePlayer("nationality", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Posición</label>
                <select
                  value={player.position}
                  onChange={(e) => updatePlayer("position", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white focus:outline-none focus:border-blue-500/50"
                >
                  <option value="GK">GK</option>
                  <option value="DEF">DEF</option>
                  <option value="MID">MID</option>
                  <option value="FWD">FWD</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Rareza</label>
                <select
                  value={player.rarity}
                  onChange={(e) => updatePlayer("rarity", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white focus:outline-none focus:border-blue-500/50"
                >
                  {rarityOptions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">URL imagen jugador</label>
                <input
                  value={player.imageUrl}
                  onChange={(e) => updatePlayer("imageUrl", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-border text-sm text-white focus:outline-none focus:border-blue-500/50"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Stats */}
            <div className="border-t border-border pt-4">
              <h3 className="text-xs text-muted-foreground mb-3 font-medium">Estadísticas</h3>
              <div className="space-y-2">
                {statKeys.map(({ key, label }) => (
                  <div key={key}>
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="text-white font-bold">{player.stats[key]}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={99}
                      value={player.stats[key]}
                      onChange={(e) => updateStat(key, parseInt(e.target.value))}
                      className="w-full accent-blue-500 h-1"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">Overall</span>
                <span className="text-lg font-black text-white">{player.overall}</span>
              </div>
            </div>
          </div>

          {/* Template selector */}
          <div className="glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Plantilla de fondo</h2>
              <button
                onClick={() => setShowSelector(!showSelector)}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                {showSelector ? "Ocultar" : "Seleccionar"}
              </button>
            </div>
            {selectedTemplate && !showSelector ? (
              <div className="flex items-center gap-3">
                <div className="w-14 h-20 rounded-lg overflow-hidden border border-border bg-black/40 shrink-0">
                  <img src={selectedTemplate.imageUrl} alt={selectedTemplate.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{selectedTemplate.name}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{selectedTemplate.rarity}</p>
                </div>
                <button
                  onClick={() => setShowSelector(true)}
                  className="text-xs text-muted-foreground hover:text-white"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <div className={showSelector ? "" : ""}>
                {!selectedTemplate && (
                  <p className="text-xs text-muted-foreground mb-2">Ninguna plantilla seleccionada</p>
                )}
              </div>
            )}

            {(showSelector || !selectedTemplate) && (
              <div className="mt-2 max-h-64 overflow-y-auto space-y-2 pr-1">
                {templates.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No hay plantillas disponibles.</p>
                ) : (
                  templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSelectedTemplate(t);
                        setShowSelector(false);
                      }}
                      className={cn(
                        "flex items-center gap-3 w-full p-2 rounded-lg text-left transition-all",
                        selectedTemplate?.id === t.id
                          ? "bg-blue-500/10 border border-blue-500/30"
                          : "bg-white/[0.02] border border-transparent hover:bg-white/5"
                      )}
                    >
                      <div className="w-10 h-14 rounded overflow-hidden bg-black/40 shrink-0">
                        <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{t.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[9px] text-muted-foreground capitalize">{t.rarity}</span>
                          <span className="text-[8px] text-muted-foreground">·</span>
                          <span className="text-[8px] text-muted-foreground">{t.source === "builtin" ? "integrada" : "subida"}</span>
                        </div>
                      </div>
                      {t.isDefault && <span className="text-[8px] text-violet-400 font-medium">Default</span>}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Position controls */}
          {selectedTemplate && lc && (
            <div className="glass rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white">Ajuste de posición</h2>
                <button onClick={resetLayout} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white">
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </div>
              <div className="space-y-5">
                <div>
                  <h3 className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">Imagen del jugador</h3>
                  <SliderControl label="X" value={lc.playerImage.x} min={-30} max={30} step={1} onChange={(v) => updateLayout("playerImage", "x", v)} />
                  <SliderControl label="Y" value={lc.playerImage.y} min={-30} max={30} step={1} onChange={(v) => updateLayout("playerImage", "y", v)} />
                  <SliderControl label="Escala" value={lc.playerImage.scale} min={0.5} max={2} step={0.05} onChange={(v) => updateLayout("playerImage", "scale", v)} />
                </div>
                <div>
                  <h3 className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">Media / Posición</h3>
                  <SliderControl label="OVR X" value={lc.overall.x} min={-20} max={20} step={1} onChange={(v) => updateLayout("overall", "x", v)} />
                  <SliderControl label="OVR Y" value={lc.overall.y} min={-20} max={20} step={1} onChange={(v) => updateLayout("overall", "y", v)} />
                  <SliderControl label="POS X" value={lc.position.x} min={-20} max={20} step={1} onChange={(v) => updateLayout("position", "x", v)} />
                  <SliderControl label="POS Y" value={lc.position.y} min={-20} max={20} step={1} onChange={(v) => updateLayout("position", "y", v)} />
                </div>
                <div>
                  <h3 className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">Nombre</h3>
                  <SliderControl label="X" value={lc.name.x} min={-20} max={20} step={1} onChange={(v) => updateLayout("name", "x", v)} />
                  <SliderControl label="Y" value={lc.name.y} min={-20} max={20} step={1} onChange={(v) => updateLayout("name", "y", v)} />
                </div>
                <div>
                  <h3 className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">Estadísticas</h3>
                  <SliderControl label="X" value={lc.stats.x} min={-20} max={20} step={1} onChange={(v) => updateLayout("stats", "x", v)} />
                  <SliderControl label="Y" value={lc.stats.y} min={-20} max={20} step={1} onChange={(v) => updateLayout("stats", "y", v)} />
                </div>
              </div>
            </div>
          )}

          {/* Export */}
          <div className="glass rounded-xl p-5">
            <button
              onClick={handleExport}
              disabled={exportState === "loading"}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {exportState === "loading" ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Exportar PNG (3x)
                </>
              )}
            </button>
            {exportState === "error" && (
              <p className="text-xs text-red-400 text-center mt-2">{exportError}</p>
            )}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-2 flex flex-col items-center pt-4">
          <p className="text-xs text-muted-foreground mb-4">Vista previa en tiempo real</p>
          <PlayerCard
            ref={cardHandleRef}
            player={player}
            template={selectedTemplate}
            hideExport
          />
        </div>
      </div>
    </div>
  );
}
