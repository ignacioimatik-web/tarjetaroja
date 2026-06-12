import type { PlayerCard, Team } from "@/types";
import { generateId, seededRandom } from "@/lib/utils";

const COUNTRIES = [
  "España", "Francia", "Argentina", "Brasil", "Alemania",
  "Italia", "Inglaterra", "Portugal", "Países Bajos", "Uruguay",
];

const CLUBS = [
  "Real Madrid FC", "FC Barcelona", "Manchester City", "Liverpool FC",
  "Bayern Munich", "Paris Saint-Germain", "Inter Milan", "AC Milan",
  "Ajax Amsterdam", "Benfica Lisbon",
];

const PLAYER_FIRST_NAMES = [
  "Alejandro", "Hugo", "Martín", "Lucas", "Mateo", "Leo", "Daniel", "Pablo",
  "Adrián", "Álvaro", "Sergio", "David", "Diego", "Javier", "Carlos",
  "Rafael", "Miguel", "Ángel", "José", "Manuel",
];

const PLAYER_LAST_NAMES = [
  "Silva", "Martínez", "García", "Rodríguez", "López", "Fernández",
  "González", "Pérez", "Sánchez", "Ramírez", "Torres", "Díaz",
  "Moreno", "Álvarez", "Romero", "Navarro", "Jiménez", "Ruiz",
  "Santos", "Costa",
];

const BASE_PLAYERS_PER_TEAM = 16;

function generatePlayerCards(teamName: string, country?: string, clubName?: string): PlayerCard[] {
  const seedBase = teamName.replace(/\s/g, "");
  const cards: PlayerCard[] = [];
  const positions: ("GK" | "DEF" | "MID" | "FWD")[] = ["GK", "DEF", "DEF", "DEF", "DEF", "MID", "MID", "MID", "MID", "FWD", "FWD", "FWD", "DEF", "MID", "FWD", "DEF"];
  const rarities: ("BASE" | "RARE" | "EPIC" | "LEGENDARY" | "GOLDEN" | "MOMENTUM" | "ULTRA_RARE")[] = [
    "BASE", "BASE", "RARE", "BASE", "RARE", "EPIC", "BASE", "RARE",
    "LEGENDARY", "BASE", "RARE", "BASE", "EPIC", "BASE", "RARE", "GOLDEN",
  ];

  for (let i = 0; i < BASE_PLAYERS_PER_TEAM; i++) {
    const seed = `${seedBase}-${i}`;
    const rng = seededRandom(seed);
    const firstName = PLAYER_FIRST_NAMES[Math.floor(rng() * PLAYER_FIRST_NAMES.length)];
    const lastName = PLAYER_LAST_NAMES[Math.floor(rng() * PLAYER_LAST_NAMES.length)];

    const position = positions[i % positions.length];
    const rarity = rarities[i % rarities.length];

    const statRanges: Record<string, { min: number; max: number }> = {
      BASE: { min: 50, max: 70 },
      RARE: { min: 65, max: 80 },
      EPIC: { min: 75, max: 88 },
      LEGENDARY: { min: 85, max: 95 },
      GOLDEN: { min: 88, max: 97 },
      MOMENTUM: { min: 82, max: 93 },
      ULTRA_RARE: { min: 90, max: 99 },
    };

    const range = statRanges[rarity];

    const positionBonuses = {
      GK: { attack: -5, control: 0, defense: 10 },
      DEF: { attack: -3, control: 0, defense: 8 },
      MID: { attack: 3, control: 5, defense: 0 },
      FWD: { attack: 10, control: 0, defense: -5 },
    };

    const bonus = positionBonuses[position];
    const baseAttack = Math.floor(rng() * (range.max - range.min) + range.min);
    const baseControl = Math.floor(rng() * (range.max - range.min) + range.min);
    const baseDefense = Math.floor(rng() * (range.max - range.min) + range.min);

    const attack = Math.min(99, Math.max(1, baseAttack + bonus.attack));
    const control = Math.min(99, Math.max(1, baseControl + bonus.control));
    const defense = Math.min(99, Math.max(1, baseDefense + bonus.defense));
    const total = Math.round((attack + control + defense) / 3);

    cards.push({
      id: generateId(),
      name: `${firstName} ${lastName}`,
      teamName,
      country,
      clubName,
      position,
      rarity,
      attack,
      control,
      defense,
      total,
      avatarSeed: seed,
      avatarStyle: "classic",
      collection: "Temporada 1",
      season: "2025/26",
      isSpecial: ["LEGENDARY", "GOLDEN", "MOMENTUM", "ULTRA_RARE"].includes(rarity),
      createdAt: new Date().toISOString(),
    });
  }

  return cards;
}

export function generateSeedTeams(): Team[] {
  const nationalTeams: Team[] = COUNTRIES.map((country, i) => ({
    id: `team-national-${i}`,
    name: country,
    type: "national" as const,
    country,
    colors: {
      primary: ["#c60b1e", "#002395", "#75aadb", "#009c3b", "#000000", "#008c45", "#cf081f", "#006600", "#ff6600", "#003da5"][i],
      secondary: ["#ffc400", "#ffffff", "#ffffff", "#ffdf00", "#dd0000", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"][i],
      accent: ["#000000", "#ff0000", "#000000", "#002776", "#dd0000", "#000000", "#000000", "#000000", "#000000", "#000000"][i],
    },
    createdAt: new Date().toISOString(),
  }));

  const clubTeams: Team[] = CLUBS.map((name, i) => ({
    id: `team-club-${i}`,
    name,
    type: "club" as const,
    country: COUNTRIES[i % COUNTRIES.length],
    colors: {
      primary: ["#febd11", "#a50044", "#6cabdd", "#c8102e", "#dc052d", "#004170", "#0068b4", "#000000", "#d31245", "#cc0000"][i],
      secondary: ["#ffffff", "#004d98", "#ffffff", "#ffffff", "#ffffff", "#000000", "#000000", "#ffffff", "#ffffff", "#ffffff"][i],
      accent: ["#000000", "#000000", "#000000", "#000000", "#000000", "#cccccc", "#dd0000", "#dd0000", "#000000", "#ffffff"][i],
    },
    createdAt: new Date().toISOString(),
  }));

  return [...nationalTeams, ...clubTeams];
}

export function generateSeedCards(teams?: Team[]): PlayerCard[] {
  const allTeams = teams || generateSeedTeams();
  const cards: PlayerCard[] = [];

  for (const team of allTeams) {
    const teamCards = generatePlayerCards(
      team.name,
      team.type === "national" ? team.country || team.name : undefined,
      team.type === "club" ? team.name : undefined,
    );
    cards.push(...teamCards);
  }

  return cards;
}

export const SEED_TEAMS = generateSeedTeams();
export const SEED_CARDS = generateSeedCards(SEED_TEAMS);
