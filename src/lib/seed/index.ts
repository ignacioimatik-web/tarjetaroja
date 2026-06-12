import type { PlayerCard, Team } from "@/types";
import { generateId } from "@/lib/utils";
import { LIGA_TEAMS } from "./liga-data";

export function generateSeedTeams(): Team[] {
  return LIGA_TEAMS.map((t, i) => ({
    id: `team-liga-${i}`,
    name: t.name,
    type: "club" as const,
    country: t.country,
    league: "LaLiga",
    colors: t.colors,
    createdAt: new Date().toISOString(),
  }));
}

export function generateSeedCards(teams?: Team[]): PlayerCard[] {
  const allTeams = teams || generateSeedTeams();
  const cards: PlayerCard[] = [];

  for (let ti = 0; ti < allTeams.length; ti++) {
    const team = allTeams[ti];
    const ligaTeam = LIGA_TEAMS[ti];
    if (!ligaTeam) continue;

    for (const p of ligaTeam.players) {
      cards.push({
        id: generateId(),
        name: p.name,
        teamName: team.name,
        country: "España",
        clubName: team.name,
        position: p.position,
        rarity: p.rarity,
        attack: p.attack,
        control: p.control,
        defense: p.defense,
        total: p.total,
        avatarSeed: `${team.name}-${p.name}`,
        avatarStyle: "classic",
        collection: "LaLiga 2025/26",
        season: "2025/26",
        isSpecial: ["LEGENDARY", "GOLDEN", "MOMENTUM", "ULTRA_RARE"].includes(p.rarity),
        createdAt: new Date().toISOString(),
      });
    }
  }

  return cards;
}

export const SEED_TEAMS = generateSeedTeams();
export const SEED_CARDS = generateSeedCards(SEED_TEAMS);
