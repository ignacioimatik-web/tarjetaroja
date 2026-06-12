import type { Match, MatchRound, PlayerCard } from "@/types";
import { generateId } from "@/lib/utils";

export function startMatch(tournamentId: string, homeTeamId: string, awayTeamId: string, round: string = "", phase: "group" | "knockout" = "group"): Match {
  return {
    id: generateId(),
    tournamentId,
    homeTeamId,
    awayTeamId,
    homeScore: 0,
    awayScore: 0,
    rounds: [],
    status: "pending",
    round,
    phase,
    createdAt: new Date().toISOString(),
  };
}

export function getAvailableCards(cards: PlayerCard[], match: Match, side: "home" | "away", starters: string[]): PlayerCard[] {
  return cards.filter((c) => {
    const belongsToTeam = side === "home" ? starters.includes(c.id) && match.homeTeamId : starters.includes(c.id) && match.awayTeamId;
    const isUsed = match.rounds.some((r) => side === "home" ? r.homeCardId === c.id : r.awayCardId === c.id);
    return belongsToTeam && !isUsed;
  });
}

export function resolveRound(
  homeCard: PlayerCard,
  awayCard: PlayerCard,
  stat: "attack" | "control" | "defense",
  roundNumber: number
): MatchRound {
  let homeValue: number;
  let awayValue: number;

  switch (stat) {
    case "attack":
      homeValue = homeCard.attack;
      awayValue = awayCard.attack;
      break;
    case "control":
      homeValue = homeCard.control;
      awayValue = awayCard.control;
      break;
    case "defense":
    default:
      homeValue = homeCard.defense;
      awayValue = awayCard.defense;
      break;
  }

  // Stats bonuses based on position
  const homeBonus = getStatBonus(stat, homeCard.position);
  const awayBonus = getStatBonus(stat, awayCard.position);

  homeValue += homeBonus;
  awayValue += awayBonus;

  let winner: "home" | "away" | "draw";
  if (homeValue > awayValue) {
    winner = "home";
  } else if (awayValue > homeValue) {
    winner = "away";
  } else {
    winner = homeCard.total > awayCard.total ? "home" : awayCard.total > homeCard.total ? "away" : "draw";
  }

  const homeGoal = winner === "home";
  const awayGoal = winner === "away";

  return {
    roundNumber,
    homeCardId: homeCard.id,
    awayCardId: awayCard.id,
    statUsed: stat,
    homeValue,
    awayValue,
    winner,
    homeGoal,
    awayGoal,
  };
}

function getStatBonus(stat: string, position: string): number {
  if (position === "FWD" && stat === "attack") return 3;
  if (position === "MID" && stat === "control") return 3;
  if (position === "DEF" && stat === "defense") return 3;
  if (position === "GK" && stat === "defense") return 5;
  if (position === "GK" && stat !== "defense") return -2;
  return 0;
}

export function makeSubstitution(match: Match, side: "home" | "away", outCardId: string, inCardId: string, roundNumber: number): MatchRound[] {
  return match.rounds.map((r) => {
    if (r.roundNumber !== roundNumber) return r;
    if (side === "home") {
      return { ...r, homeSubstitution: `${outCardId}:${inCardId}` };
    }
    return { ...r, awaySubstitution: `${outCardId}:${inCardId}` };
  });
}

export function endMatch(match: Match): Match {
  const homeScore = match.rounds.filter((r) => r.winner === "home").length;
  const awayScore = match.rounds.filter((r) => r.winner === "away").length;

  return {
    ...match,
    homeScore,
    awayScore,
    status: "finished",
  };
}

export function startPenaltyShootout(): string[] {
  return ["home", "away", "home", "away", "home", "away", "home", "away", "home", "away"];
}

export function resolvePenalty(roundSeed: number, attacker: PlayerCard, goalkeeper?: PlayerCard): boolean {
  const base = attacker.attack * 0.6 + attacker.control * 0.3;
  const save = goalkeeper ? goalkeeper.defense * 0.4 + goalkeeper.control * 0.2 : 50;
  const random = Math.sin(roundSeed * 100) * 20 + 50;
  return base + random > save + 20;
}

export function getMatchTimeline(match: Match): MatchRound[] {
  return match.rounds.sort((a, b) => a.roundNumber - b.roundNumber);
}

export function calculateGoal(round: MatchRound): boolean {
  const diff = Math.abs(round.homeValue - round.awayValue);
  if (diff <= 5) return false;
  if (diff <= 15) return Math.random() > 0.5;
  return true;
}
