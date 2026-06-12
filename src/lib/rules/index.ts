import type { PlayerCard, Squad, RuleSet, Team } from "@/types";
import { DEFAULT_RULES } from "@/lib/constants";

export interface SquadValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
  strengthIndex: number;
  abuseIndex: number;
  totals: { attack: number; control: number; defense: number };
  rarityCounts: Record<string, number>;
  positionCounts: Record<string, number>;
}

export function getRules(mode: "infantil" | "standard" | "advanced"): RuleSet {
  return DEFAULT_RULES[mode];
}

export function validateSquad(
  squad: Squad,
  cards: PlayerCard[],
  team: Team,
  mode: "infantil" | "standard" | "advanced"
): SquadValidation {
  const rules = getRules(mode);
  const errors: string[] = [];
  const warnings: string[] = [];

  const squadCards = cards.filter((c) => [...squad.starters, ...squad.substitutes].includes(c.id));
  const starters = cards.filter((c) => squad.starters.includes(c.id));
  const subs = cards.filter((c) => squad.substitutes.includes(c.id));

  if (starters.length !== rules.squadSizeStarters) {
    errors.push(`Debes tener exactamente ${rules.squadSizeStarters} titulares (tienes ${starters.length})`);
  }

  if (subs.length > rules.squadSizeSubs) {
    warnings.push(`Máximo ${rules.squadSizeSubs} suplentes (tienes ${subs.length})`);
  }

  const keepers = squadCards.filter((c) => c.position === "GK");
  if (keepers.length < rules.minGoalkeepers) {
    errors.push(`Mínimo ${rules.minGoalkeepers} portero(s) en la plantilla`);
  }

  if (!squad.starters.some((id) => cards.find((c) => c.id === id)?.position === "GK")) {
    errors.push("Debe haber un portero entre los titulares");
  }

  const rarityCounts: Record<string, number> = {};
  const positionCounts: Record<string, number> = {};
  for (const card of squadCards) {
    rarityCounts[card.rarity] = (rarityCounts[card.rarity] || 0) + 1;
    positionCounts[card.position] = (positionCounts[card.position] || 0) + 1;
  }

  if ((rarityCounts["ULTRA_RARE"] || 0) > rules.maxUltraRare) {
    errors.push(`Máximo ${rules.maxUltraRare} carta(s) Ultra Rare`);
  }
  if ((rarityCounts["GOLDEN"] || 0) > rules.maxGolden) {
    errors.push(`Máximo ${rules.maxGolden} carta(s) Golden`);
  }
  if ((rarityCounts["MOMENTUM"] || 0) > rules.maxMomentum) {
    errors.push(`Máximo ${rules.maxMomentum} carta(s) Momentum`);
  }
  if ((rarityCounts["EPIC"] || 0) > rules.maxEpicSpecial2) {
    errors.push(`Máximo ${rules.maxEpicSpecial2} carta(s) Epic`);
  }
  if ((rarityCounts["RARE"] || 0) > rules.maxRareSpecial1) {
    errors.push(`Máximo ${rules.maxRareSpecial1} carta(s) Rare`);
  }
  if ((rarityCounts["BASE"] || 0) < rules.minBase) {
    errors.push(`Mínimo ${rules.minBase} carta(s) Base`);
  }

  // Duplicate detection
  const cardIds = [...squad.starters, ...squad.substitutes];
  const uniqueIds = new Set(cardIds);
  if (uniqueIds.size !== cardIds.length) {
    errors.push("No puedes duplicar jugadores dentro de la misma plantilla");
  }

  // Team identity
  if (team.type === "national") {
    const wrongTeam = squadCards.filter((c) => c.country && c.country !== team.name);
    if (wrongTeam.length > 0) {
      errors.push(`Todas las cartas deben ser de la selección ${team.name}`);
    }
  }

  if (team.type === "club") {
    const wrongTeam = squadCards.filter((c) => c.clubName && c.clubName !== team.name);
    if (wrongTeam.length > 0) {
      errors.push(`Todas las cartas deben ser del club ${team.name}`);
    }
  }

  const totals = calculateTeamTotals(squadCards, squad.starters);
  const strengthIndex = calculateStrengthIndex(squadCards, squad.starters, rarityCounts);
  const abuseIndex = calculateAbuseIndex(rarityCounts);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    strengthIndex,
    abuseIndex,
    totals,
    rarityCounts,
    positionCounts,
  };
}

export function calculateTeamTotals(squadCards: PlayerCard[], starterIds: string[]) {
  const starters = squadCards.filter((c) => starterIds.includes(c.id));
  return {
    attack: Math.round(starters.reduce((a, c) => a + c.attack, 0) / starters.length),
    control: Math.round(starters.reduce((a, c) => a + c.control, 0) / starters.length),
    defense: Math.round(starters.reduce((a, c) => a + c.defense, 0) / starters.length),
  };
}

export function calculateStrengthIndex(
  squadCards: PlayerCard[],
  starterIds: string[],
  rarityCounts: Record<string, number>
): number {
  const starters = squadCards.filter((c) => starterIds.includes(c.id));
  if (starters.length === 0) return 0;

  const avgTotal = starters.reduce((a, c) => a + c.total, 0) / starters.length;
  const rarityBonus = (rarityCounts["ULTRA_RARE"] || 0) * 5 +
    (rarityCounts["GOLDEN"] || 0) * 4 +
    (rarityCounts["MOMENTUM"] || 0) * 3 +
    (rarityCounts["EPIC"] || 0) * 2 +
    (rarityCounts["RARE"] || 0) * 1;

  const imbalancePenalty = calculateImbalancePenalty(starters);
  const abusePenalty = calculateAbuseIndex(rarityCounts) * 0.5;

  return Math.round(avgTotal + rarityBonus - imbalancePenalty - abusePenalty);
}

export function calculateAbuseIndex(rarityCounts: Record<string, number>): number {
  return (
    (rarityCounts["ULTRA_RARE"] || 0) * 20 +
    (rarityCounts["GOLDEN"] || 0) * 15 +
    (rarityCounts["MOMENTUM"] || 0) * 15 +
    (rarityCounts["EPIC"] || 0) * 8 +
    (rarityCounts["RARE"] || 0) * 4
  );
}

function calculateImbalancePenalty(starters: PlayerCard[]): number {
  if (starters.length === 0) return 0;
  const avg = starters.reduce((a, c) => a + c.total, 0) / starters.length;
  const variance = starters.reduce((a, c) => a + Math.pow(c.total - avg, 2), 0) / starters.length;
  return Math.round(variance / 100);
}

export function detectDuplicatePlayers(squadCards: PlayerCard[]): string[] {
  const names = squadCards.map((c) => c.name);
  return names.filter((n, i) => names.indexOf(n) !== i);
}

export function validateTeamIdentity(cards: PlayerCard[], team: Team): string[] {
  const errors: string[] = [];
  if (team.type === "national") {
    const wrong = cards.filter((c) => c.country && c.country !== team.name);
    if (wrong.length > 0) errors.push(`${wrong.length} carta(s) no pertenecen a esta selección`);
  }
  if (team.type === "club") {
    const wrong = cards.filter((c) => c.clubName && c.clubName !== team.name);
    if (wrong.length > 0) errors.push(`${wrong.length} carta(s) no pertenecen a este club`);
  }
  return errors;
}

export function getSquadLegalitySummary(validation: SquadValidation): string {
  if (validation.valid) {
    return "✓ Plantilla válida";
  }
  return `✗ ${validation.errors.length} error(es), ${validation.warnings.length} advertencia(s)`;
}

export function suggestFixes(validation: SquadValidation): string[] {
  const suggestions: string[] = [];
  if (validation.errors.length === 0) return [];

  for (const error of validation.errors) {
    if (error.includes("portero")) suggestions.push("Añade un portero (GK) a los titulares");
    if (error.includes("Base")) suggestions.push("Reemplaza cartas de rareza superior por cartas Base");
    if (error.includes("Ultra Rare")) suggestions.push("Elimina una carta Ultra Rare");
    if (error.includes("Golden")) suggestions.push("Elimina una carta Golden");
    if (error.includes("Momentum")) suggestions.push("Elimina una carta Momentum");
    if (error.includes("Epic")) suggestions.push("Elimina una carta Epic");
    if (error.includes("Rare")) suggestions.push("Elimina una carta Rare");
    if (error.includes("titulares")) suggestions.push("Ajusta el número de titulares");
    if (error.includes("duplicar")) suggestions.push("Elimina jugadores duplicados");
    if (error.includes("selección") || error.includes("club")) suggestions.push("Usa solo cartas del equipo seleccionado");
  }

  return suggestions;
}
