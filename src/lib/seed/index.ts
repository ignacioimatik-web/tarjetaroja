import type { PlayerCard, Team } from "@/types";
import { generateId } from "@/lib/utils";
import { LIGA_TEAMS } from "./liga-data";
import { PREMIER_TEAMS } from "./premier-data";

const ALL_LEAGUES = [
  { data: LIGA_TEAMS, league: "LaLiga 2025/26", country: "España" },
  { data: PREMIER_TEAMS, league: "Premier League 2025/26", country: "Inglaterra" },
];

export function generateSeedTeams(): Team[] {
  const teams: Team[] = [];
  let leagueIdx = 0;

  for (const league of ALL_LEAGUES) {
    for (const t of league.data) {
      teams.push({
        id: `team-lg-${teams.length}`,
        name: t.name,
        type: "club" as const,
        country: league.country,
        league: league.league,
        colors: t.colors,
        createdAt: new Date().toISOString(),
      });
    }
    leagueIdx++;
  }

  return teams;
}

export function generateSeedCards(teams?: Team[]): PlayerCard[] {
  const teamsList = teams || generateSeedTeams();
  const cards: PlayerCard[] = [];
  let teamIdx = 0;

  for (const league of ALL_LEAGUES) {
    for (const ligaTeam of league.data) {
      const team = teamsList[teamIdx];
      if (!team) { teamIdx++; continue; }

      for (const p of ligaTeam.players) {
        cards.push({
          id: generateId(),
          name: p.name,
          teamName: team.name,
          country: league.country,
          clubName: team.name,
          position: p.position,
          rarity: p.rarity,
          attack: p.attack,
          control: p.control,
          defense: p.defense,
          total: p.total,
          avatarSeed: `${team.name}-${p.name}`,
          avatarStyle: "classic",
          collection: league.league,
          season: "2025/26",
          isSpecial: ["LEGENDARY", "GOLDEN", "MOMENTUM", "ULTRA_RARE"].includes(p.rarity),
          createdAt: new Date().toISOString(),
        });
      }
      teamIdx++;
    }
  }

  return cards;
}

export const SEED_TEAMS = generateSeedTeams();
export const SEED_CARDS = generateSeedCards(SEED_TEAMS);
