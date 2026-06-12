import type { PlayerCard, Team } from "@/types";
import { generateId } from "@/lib/utils";
import { LIGA_TEAMS } from "./liga-data";
import { PREMIER_TEAMS } from "./premier-data";
import { NATIONAL_TEAMS } from "./national-teams-data";
import { getPlayerNationality } from "./nationalities";
import type { LigaPlayerData } from "./liga-data";

const ALL_LEAGUES = [
  { data: LIGA_TEAMS, league: "LaLiga 2025/26", country: "España" },
  { data: PREMIER_TEAMS, league: "Premier League 2025/26", country: "Inglaterra" },
];

export function generateSeedTeams(): Team[] {
  const teams: Team[] = [];

  for (const league of ALL_LEAGUES) {
    for (const t of league.data) {
      teams.push({
        id: `team-${teams.length}`,
        name: t.name,
        type: "club",
        country: league.country,
        league: league.league,
        colors: t.colors,
        createdAt: new Date().toISOString(),
      });
    }
  }

  // Add national teams
  for (const nt of NATIONAL_TEAMS) {
    teams.push({
      id: `team-${teams.length}`,
      name: nt.name,
      type: "national",
      country: nt.country,
      colors: nt.colors,
      createdAt: new Date().toISOString(),
    });
  }

  return teams;
}

export function generateSeedCards(teams?: Team[]): PlayerCard[] {
  const teamsList = teams || generateSeedTeams();
  const cards: PlayerCard[] = [];
  const seen = new Set<string>();

  // Generate club cards with dual affiliation
  let teamIdx = 0;
  for (const league of ALL_LEAGUES) {
    for (const ligaTeam of league.data) {
      const team = teamsList[teamIdx];
      if (!team) { teamIdx++; continue; }

      for (const p of ligaTeam.players) {
        const nat = getPlayerNationality(p.name, league.country);
        const key = `${p.name}|club:${team.name}`;
        if (seen.has(key)) continue;
        seen.add(key);

        cards.push({
          id: generateId(),
          name: p.name,
          teamName: team.name,
          country: nat.country,
          clubName: team.name,
          nationalTeamName: nat.nationalTeam,
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

  // Generate national team cards (for players not already in a club)
  const clubPlayerNames = new Set(cards.map((c) => c.name));

  for (const nt of NATIONAL_TEAMS) {
    const ntTeam = teamsList.find((t) => t.name === nt.name);
    if (!ntTeam) continue;

    for (const p of nt.players) {
      const key = `${p.name}|nat:${nt.name}`;
      if (seen.has(key)) continue;
      seen.add(key);

      // Check if this player already exists in a club
      const existingClub = cards.find((c) => c.name === p.name);
      if (existingClub) {
        // Update the existing card with national team info
        existingClub.nationalTeamName = nt.name;
        continue;
      }

      // Create standalone national team card
      cards.push({
        id: generateId(),
        name: p.name,
        teamName: ntTeam.name,
        country: nt.country,
        nationalTeamName: nt.name,
        position: p.position,
        rarity: p.rarity,
        attack: p.attack,
        control: p.control,
        defense: p.defense,
        total: p.total,
        avatarSeed: `nt-${nt.name}-${p.name}`,
        avatarStyle: "classic",
        collection: "International",
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
