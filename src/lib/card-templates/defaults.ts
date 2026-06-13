import type { CardTemplate } from "@/types";
import { DEFAULT_LAYOUT } from "./storage";

function generateBuiltin(): CardTemplate[] {
  const gradientTemplates: CardTemplate[] = [
    {
      id: "builtin-legendary-black-gold",
      name: "Legendary Black Gold",
      rarity: "legendary",
      imageUrl: "",
      createdAt: "2025-01-01T00:00:00Z",
      isDefault: true,
      source: "builtin",
      layoutConfig: DEFAULT_LAYOUT,
    },
    {
      id: "builtin-epic-blue-neon",
      name: "Epic Blue Neon",
      rarity: "epic",
      imageUrl: "",
      createdAt: "2025-01-01T00:00:00Z",
      isDefault: false,
      source: "builtin",
      layoutConfig: DEFAULT_LAYOUT,
    },
    {
      id: "builtin-mythic-red-fire",
      name: "Mythic Red Fire",
      rarity: "mythic",
      imageUrl: "",
      createdAt: "2025-01-01T00:00:00Z",
      isDefault: false,
      source: "builtin",
      layoutConfig: DEFAULT_LAYOUT,
    },
  ];

  for (const t of gradientTemplates) {
    t.imageUrl = getPlaceholderDataURL(t.rarity);
  }

  return gradientTemplates;
}

export function getBuiltinTemplates(): CardTemplate[] {
  return generateBuiltin();
}

export function getPlaceholderDataURL(rarity: CardTemplate["rarity"]): string {
  const gradients: Record<string, string> = {
    legendary: "linear-gradient(135deg, #1a1200 0%, #2a1f00 30%, #1a1200 60%, #0d0a00 100%)",
    epic: "linear-gradient(135deg, #000d1a 0%, #001a3a 30%, #000d1a 60%, #000510 100%)",
    mythic: "linear-gradient(135deg, #1a0008 0%, #2a0015 25%, #0a001a 50%, #2a0015 75%, #1a0008 100%)",
    rare: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 30%, #0a0a1a 60%, #050510 100%)",
    common: "linear-gradient(135deg, #111115 0%, #1a1a22 30%, #111115 60%, #0a0a0f 100%)",
    custom: "linear-gradient(135deg, #0f0f15 0%, #1a1a25 30%, #0f0f15 60%, #0a0a0f 100%)",
  };

  const overlays: Record<string, string> = {
    legendary:
      "radial-gradient(circle at 50% 30%, rgba(245,158,11,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(251,191,36,0.1) 0%, transparent 40%)",
    epic: "radial-gradient(circle at 50% 30%, rgba(59,130,246,0.15) 0%, transparent 60%), radial-gradient(circle at 20% 20%, rgba(139,92,246,0.1) 0%, transparent 40%)",
    mythic:
      "radial-gradient(circle at 50% 30%, rgba(236,72,153,0.15) 0%, transparent 60%), radial-gradient(circle at 30% 20%, rgba(139,92,246,0.1) 0%, transparent 40%)",
    rare: "radial-gradient(circle at 50% 30%, rgba(59,130,246,0.08) 0%, transparent 50%)",
    common: "radial-gradient(circle at 50% 30%, rgba(160,160,176,0.05) 0%, transparent 50%)",
    custom: "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.03) 0%, transparent 50%)",
  };

  const borders: Record<string, string> = {
    legendary: "#f59e0b",
    epic: "#3b82f6",
    mythic: "#ec4899",
    rare: "#6366f1",
    common: "#6b6b7b",
    custom: "#555566",
  };

  const borderColor = borders[rarity] || "#555566";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="768" viewBox="0 0 512 768">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gradients[rarity]?.match(/#[\da-f]{6}/g)?.[0] || '#111115'}"/>
        <stop offset="50%" stop-color="${gradients[rarity]?.match(/#[\da-f]{6}/g)?.[1] || '#1a1a22'}"/>
        <stop offset="100%" stop-color="${gradients[rarity]?.match(/#[\da-f]{6}/g)?.[2] || '#111115'}"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    <rect width="512" height="768" fill="url(#bg)" rx="16"/>
    <rect width="506" height="762" x="3" y="3" rx="14" fill="none" stroke="${borderColor}" stroke-width="2" opacity="0.5"/>
    <rect width="510" height="766" x="1" y="1" rx="15" fill="none" stroke="${borderColor}" stroke-width="1" opacity="0.2"/>
    <ellipse cx="256" cy="200" rx="180" ry="120" fill="${borderColor}" opacity="0.06"/>
    <ellipse cx="256" cy="200" rx="120" ry="80" fill="${borderColor}" opacity="0.04"/>
    <line x1="0" y1="580" x2="512" y2="580" stroke="${borderColor}" stroke-width="0.5" opacity="0.15"/>
    <rect x="30" y="600" width="452" height="3" rx="1.5" fill="${borderColor}" opacity="0.1"/>
    <rect x="30" y="610" width="452" height="3" rx="1.5" fill="${borderColor}" opacity="0.06"/>
    <rect x="30" y="620" width="452" height="3" rx="1.5" fill="${borderColor}" opacity="0.04"/>
    <text x="256" y="400" font-family="Impact, Arial Black, sans-serif" font-size="28" fill="${borderColor}" opacity="0.12" text-anchor="middle" dominant-baseline="middle" letter-spacing="8">${rarity.toUpperCase()}</text>
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
