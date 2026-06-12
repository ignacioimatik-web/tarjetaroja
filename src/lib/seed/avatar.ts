import { seededRandom } from "@/lib/utils";
import type { AvatarConfig, AvatarStyle, CardRarity, CardPosition } from "@/types";

const SKIN_TONES = [
  "#f5d6b8", "#e8c39e", "#dbb188", "#c49a6c",
  "#a67c52", "#8b6348", "#6d4c3e", "#5a3d2e",
];

const HAIR_COLORS = [
  "#1a1a1a", "#2d2d2d", "#4a3728", "#6b4c3a",
  "#8b6914", "#c49a28", "#d4a04a", "#e8c878",
  "#3d2b1f", "#2c1810",
];

const HAIR_STYLES = [
  "short", "medium", "long", "curly", "wavy",
  "fade", "spiky", "slick", "buzz", "mohawk",
];

const EYE_COLORS = [
  "#3b3b3b", "#4a6741", "#5b7a9c", "#7a5b3b",
  "#3b5b8c", "#5b3b4a",
];

const EXPRESSIONS = ["neutral", "determined", "confident", "focused", "intense"];

const STYLE_COLORS: Record<AvatarStyle, { bg: string; glow: string; accent: string }> = {
  classic: { bg: "#0a1628", glow: "rgba(59,130,246,0.3)", accent: "#3b82f6" },
  neon: { bg: "#0a0020", glow: "rgba(0,255,255,0.4)", accent: "#06b6d4" },
  gold: { bg: "#1a1200", glow: "rgba(245,158,11,0.4)", accent: "#f59e0b" },
  shadow: { bg: "#080808", glow: "rgba(139,92,246,0.3)", accent: "#8b5cf6" },
  rookie: { bg: "#001a0a", glow: "rgba(34,197,94,0.3)", accent: "#22c55e" },
  legend: { bg: "#1a0a1a", glow: "rgba(236,72,153,0.4)", accent: "#ec4899" },
};

const RARITY_BG_COLORS: Record<CardRarity, string> = {
  BASE: "#1a1a2e",
  RARE: "#0a1628",
  EPIC: "#1a0a2e",
  LEGENDARY: "#1a1200",
  GOLDEN: "#1a1400",
  MOMENTUM: "#2e0a0a",
  ULTRA_RARE: "#0a1a1a",
};

const RARITY_JERSEY_COLORS: Record<CardRarity, [string, string]> = {
  BASE: ["#2a2a3a", "#3a3a4a"],
  RARE: ["#1a3a6a", "#2563eb"],
  EPIC: ["#3a1a6a", "#8b5cf6"],
  LEGENDARY: ["#6a4a0a", "#f59e0b"],
  GOLDEN: ["#6a5a0a", "#fbbf24"],
  MOMENTUM: ["#6a1a1a", "#ef4444"],
  ULTRA_RARE: ["#0a4a4a", "#06b6d4"],
};

export function getAvatarConfigFromSeed(
  seed: string,
  rarity: CardRarity = "BASE",
  position?: CardPosition,
  style: AvatarStyle = "classic"
): AvatarConfig {
  const rng = seededRandom(seed);
  const skinTone = SKIN_TONES[Math.floor(rng() * SKIN_TONES.length)];
  const hairColor = HAIR_COLORS[Math.floor(rng() * HAIR_COLORS.length)];
  const hairStyle = HAIR_STYLES[Math.floor(rng() * HAIR_STYLES.length)];
  const eyeColor = EYE_COLORS[Math.floor(rng() * EYE_COLORS.length)];
  const expression = EXPRESSIONS[Math.floor(rng() * EXPRESSIONS.length)];

  const rarityColors = RARITY_JERSEY_COLORS[rarity];
  const styleColors = STYLE_COLORS[style];
  const bgColor = RARITY_BG_COLORS[rarity];

  return {
    skinTone,
    hairColor,
    hairStyle,
    eyeColor,
    expression,
    jerseyColor: rarityColors[0],
    jerseySecondary: rarityColors[1],
    backgroundColor: bgColor,
    glowColor: styleColors.glow,
    style,
  };
}

function getFaceSvg(config: AvatarConfig): string {
  const { skinTone, eyeColor, expression, hairColor, hairStyle } = config;

  let mouthPath = "";
  switch (expression) {
    case "neutral":
      mouthPath = `<path d="M38 56 Q44 60 50 56" stroke="#333" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
      break;
    case "determined":
      mouthPath = `<path d="M36 58 Q44 54 52 58" stroke="#333" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
      break;
    case "confident":
      mouthPath = `<path d="M36 56 Q44 64 52 56" stroke="#333" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
      break;
    case "focused":
      mouthPath = `<path d="M38 56 L50 56" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>`;
      break;
    case "intense":
      mouthPath = `<path d="M36 58 L52 58" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>`;
      break;
    default:
      mouthPath = `<path d="M38 56 Q44 60 50 56" stroke="#333" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
  }

  let eyebrowsPath = "";
  switch (expression) {
    case "neutral":
      eyebrowsPath = `<path d="M32 40 L44 42 M48 42 L60 40" stroke="${hairColor}" stroke-width="1.5" stroke-linecap="round"/>`;
      break;
    case "determined":
      eyebrowsPath = `<path d="M32 40 L44 38 M48 38 L60 40" stroke="${hairColor}" stroke-width="1.5" stroke-linecap="round"/>`;
      break;
    case "confident":
      eyebrowsPath = `<path d="M32 39 L44 42 M48 42 L60 39" stroke="${hairColor}" stroke-width="1.5" stroke-linecap="round"/>`;
      break;
    case "focused":
      eyebrowsPath = `<path d="M30 39 L46 41 M44 41 L62 39" stroke="${hairColor}" stroke-width="2" stroke-linecap="round"/>`;
      break;
    case "intense":
      eyebrowsPath = `<path d="M30 38 L46 40 M44 40 L62 38" stroke="${hairColor}" stroke-width="2" stroke-linecap="round"/>`;
      break;
    default:
      eyebrowsPath = `<path d="M32 40 L44 42 M48 42 L60 40" stroke="${hairColor}" stroke-width="1.5" stroke-linecap="round"/>`;
  }

  let hairPath = "";
  switch (hairStyle) {
    case "short":
      hairPath = `<path d="M28 44 Q28 20 46 18 Q64 20 64 44" fill="${hairColor}" opacity="0.9"/>
        <path d="M30 42 Q34 22 46 20 Q58 22 62 42" fill="${hairColor}" opacity="0.7"/>`;
      break;
    case "medium":
      hairPath = `<path d="M28 48 Q26 18 46 16 Q66 18 64 48 Q60 34 46 32 Q32 34 28 48" fill="${hairColor}" opacity="0.9"/>
        <path d="M30 46 Q34 24 46 22 Q58 24 62 46" fill="${hairColor}" opacity="0.6"/>`;
      break;
    case "long":
      hairPath = `<path d="M28 48 Q24 16 46 14 Q68 16 64 48 Q62 56 58 64 Q54 68 50 64 Q48 56 46 52 Q44 56 42 64 Q38 68 34 64 Q30 56 28 48" fill="${hairColor}" opacity="0.9"/>`;
      break;
    case "curly":
      hairPath = `<path d="M28 46 Q24 14 46 12 Q68 14 64 46" fill="${hairColor}" opacity="0.9"/>
        <circle cx="34" cy="24" r="6" fill="${hairColor}" opacity="0.7"/>
        <circle cx="46" cy="20" r="7" fill="${hairColor}" opacity="0.7"/>
        <circle cx="58" cy="24" r="6" fill="${hairColor}" opacity="0.7"/>
        <circle cx="40" cy="28" r="5" fill="${hairColor}" opacity="0.5"/>
        <circle cx="52" cy="28" r="5" fill="${hairColor}" opacity="0.5"/>`;
      break;
    case "wavy":
      hairPath = `<path d="M28 46 Q26 14 46 12 Q66 14 64 46 Q62 30 46 28 Q30 30 28 46" fill="${hairColor}" opacity="0.9"/>
        <path d="M30 42 Q34 26 46 24 Q58 26 62 42" fill="${hairColor}" opacity="0.5"/>`;
      break;
    case "fade":
      hairPath = `<path d="M28 42 Q30 18 46 16 Q62 18 64 42" fill="${hairColor}" opacity="0.9"/>
        <path d="M32 40 Q38 26 46 24 Q54 26 60 40" fill="${hairColor}" opacity="0.4"/>
        <path d="M34 38 Q40 28 46 27 Q52 28 58 38" fill="${hairColor}" opacity="0.2"/>`;
      break;
    case "spiky":
      hairPath = `<path d="M28 44 L32 14 L38 22 L42 10 L46 20 L50 12 L54 22 L60 14 L64 44" fill="${hairColor}" opacity="0.9"/>
        <path d="M34 38 L38 20 L42 28 L46 18 L50 26 L54 20 L58 38" fill="${hairColor}" opacity="0.6"/>`;
      break;
    case "slick":
      hairPath = `<path d="M28 46 Q26 12 46 10 Q66 12 64 46 Q62 32 46 30 Q30 32 28 46" fill="${hairColor}" opacity="0.95"/>
        <path d="M30 44 Q34 28 46 26 Q58 28 62 44" fill="${hairColor}" opacity="0.7"/>
        <line x1="44" y1="14" x2="52" y2="16" stroke="${hairColor}" stroke-width="2" opacity="0.3"/>`;
      break;
    case "buzz":
      hairPath = `<path d="M28 44 Q30 22 46 20 Q62 22 64 44" fill="${hairColor}" opacity="0.85"/>
        <path d="M32 40 Q38 28 46 26 Q54 28 60 40" fill="${hairColor}" opacity="0.5"/>`;
      break;
    case "mohawk":
      hairPath = `<path d="M28 44 Q30 18 46 14 Q62 18 64 44" fill="${hairColor}" opacity="0.9"/>
        <path d="M38 44 Q40 14 46 10 Q52 14 54 44" fill="${hairColor}" opacity="0.8"/>
        <path d="M40 42 Q42 18 46 15 Q50 18 52 42" fill="${hairColor}" opacity="0.5"/>`;
      break;
    default:
      hairPath = `<path d="M28 44 Q28 20 46 18 Q64 20 64 44" fill="${hairColor}" opacity="0.9"/>`;
  }

  return `
    <g transform="translate(0, 5)">
      <ellipse cx="46" cy="42" rx="18" ry="20" fill="${skinTone}"/>
      ${hairPath}
      <ellipse cx="38" cy="42" rx="2.5" ry="3" fill="#fff" opacity="0.1"/>
      <ellipse cx="54" cy="42" rx="2.5" ry="3" fill="#fff" opacity="0.1"/>
      <ellipse cx="38" cy="42" rx="2" ry="2.5" fill="${eyeColor}"/>
      <ellipse cx="54" cy="42" rx="2" ry="2.5" fill="${eyeColor}"/>
      <ellipse cx="38" cy="41" rx="1" ry="1" fill="#fff" opacity="0.5"/>
      <ellipse cx="54" cy="41" rx="1" ry="1" fill="#fff" opacity="0.5"/>
      ${eyebrowsPath}
      <path d="M44 48 Q46 46 48 48" stroke="#cc9966" stroke-width="1" fill="none"/>
      <ellipse cx="46" cy="50" rx="3" ry="1.5" fill="${skinTone}" stroke="#cc9966" stroke-width="0.5"/>
      ${mouthPath}
      <path d="M36 36 Q38 34 42 35" stroke="#cc9966" stroke-width="0.8" fill="none" opacity="0.5"/>
      <path d="M50 35 Q54 34 56 36" stroke="#cc9966" stroke-width="0.8" fill="none" opacity="0.5"/>
    </g>`;
}

function getJerseySvg(config: AvatarConfig, position?: CardPosition): string {
  const { jerseyColor, jerseySecondary } = config;

  let positionSymbol = "";
  switch (position) {
    case "GK":
      positionSymbol = `<text x="46" y="96" text-anchor="middle" fill="white" font-size="8" font-weight="bold" opacity="0.6">GK</text>`;
      break;
    case "DEF":
      positionSymbol = `<text x="46" y="96" text-anchor="middle" fill="white" font-size="8" font-weight="bold" opacity="0.6">DEF</text>`;
      break;
    case "MID":
      positionSymbol = `<text x="46" y="96" text-anchor="middle" fill="white" font-size="8" font-weight="bold" opacity="0.6">MID</text>`;
      break;
    case "FWD":
      positionSymbol = `<text x="46" y="96" text-anchor="middle" fill="white" font-size="8" font-weight="bold" opacity="0.6">FW</text>`;
      break;
  }

  return `
    <g transform="translate(0, 60)">
      <path d="M28 0 L32 12 L32 36 Q46 40 60 36 L60 12 L64 0 Z" fill="${jerseyColor}" stroke="${jerseySecondary}" stroke-width="0.5"/>
      <path d="M32 12 Q46 16 60 12" fill="none" stroke="${jerseySecondary}" stroke-width="0.5" opacity="0.5"/>
      <rect x="34" y="14" width="24" height="14" rx="2" fill="none" stroke="${jerseySecondary}" stroke-width="0.3" opacity="0.3"/>
      <line x1="46" y1="14" x2="46" y2="28" stroke="${jerseySecondary}" stroke-width="0.3" opacity="0.3"/>
      <line x1="34" y1="21" x2="58" y2="21" stroke="${jerseySecondary}" stroke-width="0.3" opacity="0.3"/>
      <path d="M36 5 L40 3" stroke="${jerseySecondary}" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
      <path d="M56 5 L52 3" stroke="${jerseySecondary}" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
      ${positionSymbol}
      <path d="M30 0 L28 -2 L30 -4 L32 -2 Z" fill="${jerseySecondary}" opacity="0.8"/>
      <path d="M62 0 L60 -2 L62 -4 L64 -2 Z" fill="${jerseySecondary}" opacity="0.8"/>
    </g>`;
}

function getBackgroundSvg(config: AvatarConfig, rarity: CardRarity): string {
  const { backgroundColor, glowColor, style } = config;

  let extraBg = "";
  switch (rarity) {
    case "ULTRA_RARE":
      extraBg = `<linearGradient id="holographic" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.3"/>
        <stop offset="33%" stop-color="#8b5cf6" stop-opacity="0.3"/>
        <stop offset="66%" stop-color="#f59e0b" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#ef4444" stop-opacity="0.3"/>
      </linearGradient>
      <rect x="0" y="0" width="92" height="130" fill="url(#holographic)" opacity="0.5"/>`;
      break;
    case "LEGENDARY":
    case "GOLDEN":
      extraBg = `<circle cx="46" cy="65" r="40" fill="${glowColor}" opacity="0.4"/>`;
      break;
    case "MOMENTUM":
      extraBg = `<circle cx="46" cy="65" r="35" fill="${glowColor}" opacity="0.3"/>
        <line x1="10" y1="20" x2="80" y2="110" stroke="${config.jerseySecondary}" stroke-width="0.5" opacity="0.2"/>
        <line x1="20" y1="10" x2="70" y2="120" stroke="${config.jerseySecondary}" stroke-width="0.5" opacity="0.15"/>`;
      break;
    default:
      extraBg = `<circle cx="46" cy="65" r="30" fill="${glowColor}" opacity="0.2"/>`;
  }

  let patternBg = "";
  switch (style) {
    case "shadow":
      patternBg = `<pattern id="hex" width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M4 0L8 2.3V6.9L4 9.2L0 6.9V2.3Z" fill="none" stroke="white" stroke-width="0.2" opacity="0.05"/>
      </pattern>
      <rect x="0" y="0" width="92" height="130" fill="url(#hex)"/>`;
      break;
    case "neon":
      patternBg = `<line x1="0" y1="0" x2="92" y2="130" stroke="#06b6d4" stroke-width="0.3" opacity="0.1"/>
        <line x1="92" y1="0" x2="0" y2="130" stroke="#8b5cf6" stroke-width="0.3" opacity="0.1"/>`;
      break;
    case "gold":
      patternBg = `<circle cx="46" cy="65" r="55" fill="none" stroke="#f59e0b" stroke-width="0.3" opacity="0.15"/>
        <circle cx="46" cy="65" r="45" fill="none" stroke="#fbbf24" stroke-width="0.2" opacity="0.1"/>`;
      break;
    default:
      break;
  }

  return `
    <rect x="0" y="0" width="92" height="130" fill="${backgroundColor}"/>
    ${extraBg}
    ${patternBg}`;
}

export function generateAvatarSvg(
  seed: string,
  rarity: CardRarity = "BASE",
  position?: CardPosition,
  style: AvatarStyle = "classic"
): string {
  const config = getAvatarConfigFromSeed(seed, rarity, position, style);
  const bgSvg = getBackgroundSvg(config, rarity);
  const faceSvg = getFaceSvg(config);
  const jerseySvg = getJerseySvg(config, position);

  const glowColor = config.glowColor;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92 130" width="92" height="130">
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="innerGlow">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    ${bgSvg}
    <circle cx="46" cy="65" r="58" fill="none" stroke="${glowColor}" stroke-width="0.5" opacity="0.3"/>
    ${faceSvg}
    ${jerseySvg}
    <rect x="0" y="0" width="92" height="130" fill="none" stroke="${glowColor}" stroke-width="0.5" opacity="0.2" rx="4"/>
    <rect x="1" y="1" width="90" height="128" fill="none" stroke="white" stroke-width="0.3" opacity="0.1" rx="3"/>
  </svg>`;
}
