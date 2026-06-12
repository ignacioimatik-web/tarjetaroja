import type { CardRarity, CardPosition, TournamentFormat, TournamentMode, RuleSet } from "@/types";

export const RARITIES: { value: CardRarity; label: string; color: string; order: number }[] = [
  { value: "BASE", label: "Base", color: "zinc", order: 0 },
  { value: "RARE", label: "Rare", color: "blue", order: 1 },
  { value: "EPIC", label: "Epic", color: "violet", order: 2 },
  { value: "LEGENDARY", label: "Legendary", color: "amber", order: 3 },
  { value: "GOLDEN", label: "Golden", color: "yellow", order: 4 },
  { value: "MOMENTUM", label: "Momentum", color: "red", order: 5 },
  { value: "ULTRA_RARE", label: "Ultra Rare", color: "cyan", order: 6 },
];

export const POSITIONS: { value: CardPosition; label: string }[] = [
  { value: "GK", label: "Portero" },
  { value: "DEF", label: "Defensa" },
  { value: "MID", label: "Medio" },
  { value: "FWD", label: "Delantero" },
];

export const FORMATIONS = [
  { value: "4-3-3", label: "4-3-3" },
  { value: "4-4-2", label: "4-4-2" },
  { value: "3-5-2", label: "3-5-2" },
  { value: "4-2-3-1", label: "4-2-3-1" },
  { value: "5-3-2", label: "5-3-2" },
];

export const TOURNAMENT_FORMATS: { value: TournamentFormat; label: string; groups: number; teamsPerGroup: number; qualifiersPerGroup: number }[] = [
  { value: 8, label: "8 equipos (2 grupos)", groups: 2, teamsPerGroup: 4, qualifiersPerGroup: 2 },
  { value: 16, label: "16 equipos (4 grupos)", groups: 4, teamsPerGroup: 4, qualifiersPerGroup: 2 },
  { value: 24, label: "24 equipos (6 grupos)", groups: 6, teamsPerGroup: 4, qualifiersPerGroup: 2 },
  { value: 32, label: "32 equipos (8 grupos)", groups: 8, teamsPerGroup: 4, qualifiersPerGroup: 2 },
];

export const TOURNAMENT_MODES: { value: TournamentMode; label: string; description: string }[] = [
  { value: "infantil", label: "Infantil", description: "7 titulares, 3 suplentes, reglas simples" },
  { value: "standard", label: "Estándar", description: "11 titulares, 5 suplentes, reglas completas" },
  { value: "advanced", label: "Avanzado", description: "Presupuesto, draft, hándicap, fatiga" },
];

export const DEFAULT_RULES: Record<TournamentMode, RuleSet> = {
  infantil: {
    mode: "infantil",
    squadSizeStarters: 7,
    squadSizeSubs: 3,
    maxUltraRare: 0,
    maxGolden: 0,
    maxMomentum: 0,
    maxEpicSpecial2: 0,
    maxRareSpecial1: 1,
    minBase: 3,
    minGoalkeepers: 1,
    maxSpecialCards: 1,
    maxRounds: 7,
    allowDuplicates: false,
    enableFatigue: false,
    enableHandicap: false,
    goalMode: "simple",
  },
  standard: {
    mode: "standard",
    squadSizeStarters: 11,
    squadSizeSubs: 5,
    maxUltraRare: 1,
    maxGolden: 1,
    maxMomentum: 1,
    maxEpicSpecial2: 3,
    maxRareSpecial1: 5,
    minBase: 5,
    minGoalkeepers: 1,
    maxSpecialCards: 0,
    maxRounds: 16,
    allowDuplicates: false,
    enableFatigue: false,
    enableHandicap: false,
    goalMode: "simple",
  },
  advanced: {
    mode: "advanced",
    squadSizeStarters: 11,
    squadSizeSubs: 5,
    maxUltraRare: 1,
    maxGolden: 1,
    maxMomentum: 1,
    maxEpicSpecial2: 3,
    maxRareSpecial1: 5,
    minBase: 5,
    minGoalkeepers: 1,
    maxSpecialCards: 0,
    maxRounds: 16,
    allowDuplicates: false,
    enableFatigue: true,
    enableHandicap: true,
    goalMode: "realistic",
    budget: 500,
  },
};

export const RARITY_STATS_RANGES: Record<CardRarity, { min: number; max: number }> = {
  BASE: { min: 50, max: 70 },
  RARE: { min: 65, max: 80 },
  EPIC: { min: 75, max: 88 },
  LEGENDARY: { min: 85, max: 95 },
  GOLDEN: { min: 88, max: 97 },
  MOMENTUM: { min: 82, max: 93 },
  ULTRA_RARE: { min: 90, max: 99 },
};

export const GROUP_NAMES = ["A", "B", "C", "D", "E", "F", "G", "H"];

export const ROUND_NAMES = [
  "Jornada 1",
  "Jornada 2",
  "Jornada 3",
  "Jornada 4",
  "Jornada 5",
  "Jornada 6",
];

export const KNOCKOUT_ROUNDS = [
  "Round of 16",
  "Quarter-finals",
  "Semi-finals",
  "Final",
];
