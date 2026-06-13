"use client";

import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { toPng } from "html-to-image";
import { cn } from "@/lib/utils";
import type { CardTemplate } from "@/types";

export interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defense: number;
  physical: number;
}

export interface Player {
  name: string;
  position: string;
  overall: number;
  team: string;
  nationality: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic";
  imageUrl: string;
  stats: PlayerStats;
}

interface PlayerCardProps {
  player: Player;
  template?: CardTemplate | null;
  className?: string;
  hideExport?: boolean;
}

const rarityColors: Record<Player["rarity"], { primary: string; secondary: string; accent: string; border: string; glow: string; label: string }> = {
  common: {
    primary: "#4a4a5a",
    secondary: "#2a2a35",
    accent: "#a0a0b0",
    border: "#6b6b7b",
    glow: "rgba(160,160,176,0.15)",
    label: "COMMON",
  },
  rare: {
    primary: "#1a4a8a",
    secondary: "#0f1f3a",
    accent: "#3b82f6",
    border: "#3b82f6",
    glow: "rgba(59,130,246,0.3)",
    label: "RARE",
  },
  epic: {
    primary: "#5a1a8a",
    secondary: "#1f0f3a",
    accent: "#8b5cf6",
    border: "#8b5cf6",
    glow: "rgba(139,92,246,0.3)",
    label: "EPIC",
  },
  legendary: {
    primary: "#8a6a1a",
    secondary: "#3a2a0f",
    accent: "#f59e0b",
    border: "#f59e0b",
    glow: "rgba(245,158,11,0.4)",
    label: "LEGENDARY",
  },
  mythic: {
    primary: "#8a1a5a",
    secondary: "#2a0a1f",
    accent: "#ec4899",
    border: "transparent",
    glow: "rgba(236,72,153,0.4)",
    label: "MYTHIC",
  },
};

const statLabels: Record<keyof PlayerStats, string> = {
  pace: "PAC",
  shooting: "SHO",
  passing: "PAS",
  dribbling: "DRI",
  defense: "DEF",
  physical: "PHY",
};

function RarityStars({ rarity }: { rarity: Player["rarity"] }) {
  const count =
    rarity === "common" ? 1 : rarity === "rare" ? 2 : rarity === "epic" ? 3 : rarity === "legendary" ? 4 : 5;
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={cn("w-3 h-3", i < count ? "text-yellow-400" : "text-white/20")}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] font-black tracking-wider text-white/70 w-7 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}dd, ${color})`,
            boxShadow: `0 0 6px ${color}66`,
          }}
        />
      </div>
      <span className="text-[10px] font-black text-white w-5 text-right tabular-nums">{value}</span>
    </div>
  );
}

const CARD_W = 280;
const CARD_H = 400;

export interface PlayerCardHandle {
  getCardElement: () => HTMLDivElement | null;
}

export const PlayerCard = forwardRef<PlayerCardHandle, PlayerCardProps>(function PlayerCard(
  { player, template, className, hideExport },
  ref
) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [exportState, setExportState] = useState<"idle" | "loading" | "error">("idle");
  const [exportError, setExportError] = useState("");
  const [imgError, setImgError] = useState(false);

  useImperativeHandle(ref, () => ({
    getCardElement: () => cardRef.current,
  }));

  const colors = rarityColors[player.rarity];
  const isMythic = player.rarity === "mythic";
  const lc = template?.layoutConfig;
  const hasTemplate = !!template;

  function applyOffset(x = 0, y = 0): React.CSSProperties {
    return {
      position: "absolute" as const,
      transform: `translate(${x}px, ${y}px)`,
    };
  }

  async function handleExport() {
    const el = cardRef.current;
    if (!el) return;
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

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        ref={cardRef}
        className="relative w-[280px] h-[400px] rounded-xl overflow-hidden select-none"
        style={{ fontFamily: "'Geist Sans', 'Impact', 'Arial Black', sans-serif" }}
      >
        {hasTemplate ? (
          <>
            {/* Layer 1: Template image */}
            {!imgError ? (
              <>
                <img
                  src={template!.imageUrl}
                  alt=""
                  crossOrigin="anonymous"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              </>
            ) : null}

            {/* Layer 2: Dark overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

            {/* Layer 3: Player image */}
            <div
              className="absolute overflow-hidden"
              style={{
                top: 0,
                left: 0,
                right: 0,
                height: 250,
                transform: `translate(${lc?.playerImage.x ?? 0}px, ${lc?.playerImage.y ?? 0}px) scale(${lc?.playerImage.scale ?? 1})`,
                transformOrigin: "center top",
              }}
            >
              <img
                src={player.imageUrl}
                alt=""
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)" }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Layer 4: Data overlay */}
            <div className="absolute inset-0 flex flex-col">
              {/* Overall + Position */}
              <div
                className="flex items-start justify-between px-3 z-10"
                style={{ paddingTop: `calc(12px + ${lc?.overall.y ?? 0}px)`, paddingLeft: `calc(12px + ${lc?.overall.x ?? 0}px)` }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <span
                      className="text-3xl font-black leading-none text-white"
                      style={{ textShadow: `0 0 20px ${colors.accent}, 0 0 40px ${colors.accent}66` }}
                    >
                      {player.overall}
                    </span>
                    <span className="text-[7px] font-bold tracking-widest uppercase" style={{ color: colors.accent }}>
                      Rating
                    </span>
                  </div>
                  <div
                    className="px-2 py-0.5 rounded-sm text-white font-black text-xs tracking-wider"
                    style={{
                      background: colors.accent,
                      boxShadow: `0 0 10px ${colors.accent}66`,
                      transform: `translate(${lc?.position.x ?? 0}px, ${lc?.position.y ?? 0}px)`,
                    }}
                  >
                    {player.position}
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="mt-auto mb-0">
                <div
                  className="px-3 py-1.5"
                  style={{
                    background: `linear-gradient(90deg, ${colors.primary}dd, ${colors.primary}99, transparent)`,
                    backdropFilter: "blur(4px)",
                    borderTop: `2px solid ${colors.accent}44`,
                    borderBottom: `2px solid ${colors.accent}44`,
                    transform: `translate(${lc?.name.x ?? 0}px, ${lc?.name.y ?? 0}px)`,
                  }}
                >
                  <h2
                    className="text-lg font-black text-white leading-tight truncate"
                    style={{
                      textShadow:
                        "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 10px rgba(0,0,0,0.5)",
                    }}
                  >
                    {player.name.toUpperCase()}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-white/70 font-medium">{player.team}</span>
                    <span className="text-[8px] text-white/30">|</span>
                    <RarityStars rarity={player.rarity} />
                    <span className="text-[8px] font-black tracking-widest" style={{ color: colors.accent }}>
                      {colors.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div
                className="px-3 py-2 bg-black/40 backdrop-blur-sm"
                style={{ transform: `translate(${lc?.stats.x ?? 0}px, ${lc?.stats.y ?? 0}px)` }}
              >
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {(Object.keys(player.stats) as Array<keyof PlayerStats>).map((key) => (
                    <StatBar key={key} label={statLabels[key]} value={player.stats[key]} color={colors.accent} />
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Fallback: no-template manga design */}
            {/* Layer 1: Background */}
            <div
              className="absolute inset-0"
              style={{
                background: isMythic
                  ? "linear-gradient(135deg, #2a0a1f 0%, #1a0a3a 25%, #0a1a3a 50%, #1a0a2a 75%, #2a0a1f 100%)"
                  : `linear-gradient(180deg, ${colors.secondary} 0%, #0a0a0f 100%)`,
              }}
            />

            {/* Layer 2: Halftone */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `radial-gradient(circle, ${colors.accent}33 1px, transparent 1px)`,
                backgroundSize: "4px 4px",
              }}
            />

            {/* Layer 3: Rarity frame glow */}
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                boxShadow: isMythic
                  ? "inset 0 0 30px rgba(236,72,153,0.15), 0 0 40px rgba(236,72,153,0.2)"
                  : `inset 0 0 30px ${colors.glow}, 0 0 40px ${colors.glow}`,
              }}
            />

            {/* Layer 4: AI Player Image */}
            <div className="absolute top-0 left-0 right-0 h-[250px] overflow-hidden">
              <img
                src={player.imageUrl}
                alt=""
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)" }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-20"
                style={{
                  background: `linear-gradient(0deg, ${colors.secondary} 0%, transparent 100%)`,
                }}
              />
            </div>

            {/* Layer 5: Manga speed lines */}
            <div
              className="absolute top-0 left-0 right-0 h-[250px] overflow-hidden opacity-20 pointer-events-none"
              style={{
                background: `repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.06) 10px, rgba(255,255,255,0.06) 11px)`,
              }}
            />

            {/* Layer 6: Impact burst */}
            <div
              className="absolute top-3 left-3 w-16 h-16 rounded-full opacity-40"
              style={{
                background: `radial-gradient(circle, ${colors.accent} 0%, ${colors.accent}00 70%)`,
                filter: "blur(2px)",
              }}
            />

            {/* Layer 7: Text/Data */}
            <div className="absolute inset-0 flex flex-col">
              <div className="flex items-start justify-between px-3 pt-3 z-10">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <span
                      className="text-3xl font-black leading-none text-white"
                      style={{ textShadow: `0 0 20px ${colors.accent}, 0 0 40px ${colors.accent}66` }}
                    >
                      {player.overall}
                    </span>
                    <span className="text-[7px] font-bold tracking-widest uppercase" style={{ color: colors.accent }}>
                      Rating
                    </span>
                  </div>
                  <div
                    className="px-2 py-0.5 rounded-sm text-white font-black text-xs tracking-wider"
                    style={{ background: colors.accent, boxShadow: `0 0 10px ${colors.accent}66` }}
                  >
                    {player.position}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold text-white/80">{player.nationality}</span>
                </div>
              </div>

              <div className="mt-auto mb-0">
                <div
                  className="px-3 py-1.5"
                  style={{
                    background: `linear-gradient(90deg, ${colors.primary}dd, ${colors.primary}99, transparent)`,
                    backdropFilter: "blur(4px)",
                    borderTop: `2px solid ${colors.accent}44`,
                    borderBottom: `2px solid ${colors.accent}44`,
                  }}
                >
                  <h2
                    className="text-lg font-black text-white leading-tight truncate"
                    style={{
                      textShadow:
                        "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 10px rgba(0,0,0,0.5)",
                    }}
                  >
                    {player.name.toUpperCase()}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-white/70 font-medium">{player.team}</span>
                    <span className="text-[8px] text-white/30">|</span>
                    <RarityStars rarity={player.rarity} />
                    <span className="text-[8px] font-black tracking-widest" style={{ color: colors.accent }}>
                      {colors.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-3 py-2 bg-black/40 backdrop-blur-sm mt-auto">
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {(Object.keys(player.stats) as Array<keyof PlayerStats>).map((key) => (
                    <StatBar key={key} label={statLabels[key]} value={player.stats[key]} color={colors.accent} />
                  ))}
                </div>
              </div>
            </div>

            {/* Layer 8: Lighting/Effects */}
            <div
              className="absolute inset-0 pointer-events-none rounded-xl"
              style={{
                background: isMythic
                  ? "linear-gradient(135deg, rgba(236,72,153,0.05) 0%, transparent 30%, rgba(59,130,246,0.05) 50%, transparent 70%, rgba(236,72,153,0.05) 100%)"
                  : "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 40%, rgba(255,255,255,0.02) 60%, transparent 100%)",
              }}
            />
          </>
        )}

        {/* Border overlay (applied in both modes) */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={
            isMythic
              ? {
                  border: "2px solid transparent",
                  backgroundImage: "linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6, #06b6d4, #ec4899)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                  backgroundSize: "200% 200%",
                  animation: "mythicBorder 3s ease infinite",
                }
              : {
                  border: `2px solid ${colors.border}`,
                  boxShadow: `0 0 15px ${colors.glow}, inset 0 0 15px ${colors.glow}`,
                }
          }
        />
      </div>

      {/* Export button */}
      {!hideExport && (
        <>
          <button
            onClick={handleExport}
            disabled={exportState === "loading"}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
              "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "text-white"
            )}
          >
            {exportState === "loading" ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 11l5 5 5-5M12 4v12" />
                </svg>
                Export PNG
              </>
            )}
          </button>
          {exportState === "error" && (
            <p className="text-xs text-red-400 text-center max-w-[280px]">{exportError}</p>
          )}
        </>
      )}
    </div>
  );
});
