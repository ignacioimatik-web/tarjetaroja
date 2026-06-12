import type { Tournament, Group, Standing, KnockoutMatch, Team, Match, TournamentFormat, Squad } from "@/types";
import { GROUP_NAMES } from "@/lib/constants";
import { calculateStrengthIndex, getRules } from "@/lib/rules";
import { generateId } from "@/lib/utils";
import type { PlayerCard } from "@/types";

export function createTournamentEngine(name: string, mode: "infantil" | "standard" | "advanced", format: TournamentFormat, teams: Team[]): Tournament {
  const teamIds = teams.map((t) => t.id);
  const rules = getRules(mode);

  const tournament: Tournament = {
    id: generateId(),
    name,
    mode,
    format,
    teams: teamIds,
    groups: [],
    standings: [],
    knockoutBracket: [],
    currentRound: "groups",
    status: "pending",
    rules,
    createdAt: new Date().toISOString(),
  };

  return tournament;
}

export function calculatePotsByStrength(teams: Team[], cards: PlayerCard[], squads: Squad[]): Team[][] {
  const withStrength = teams.map((team) => {
    const squad = squads.find((s) => s.teamId === team.id);
    let strength = 0;
    if (squad) {
      const squadCards = cards.filter((c) => squad.starters.includes(c.id));
      const rarityCounts: Record<string, number> = {};
      for (const c of squadCards) {
        rarityCounts[c.rarity] = (rarityCounts[c.rarity] || 0) + 1;
      }
      strength = calculateStrengthIndex(squadCards, squad.starters, rarityCounts);
    }
    return { team, strength };
  });

  withStrength.sort((a, b) => b.strength - a.strength);

  const pots: Team[][] = [];
  const numPots = 4;
  const perPot = Math.ceil(teams.length / numPots);

  for (let i = 0; i < numPots; i++) {
    pots.push(withStrength.slice(i * perPot, (i + 1) * perPot).map((t) => t.team));
  }

  return pots;
}

export function drawGroups(tournament: Tournament, pots: Team[][]): Tournament {
  const numGroups = tournament.format <= 8 ? 2 : tournament.format <= 16 ? 4 : tournament.format <= 24 ? 6 : 8;
  const teamsPerGroup = 4;

  const availablePots = pots.map((pot) => [...pot]);
  const groups: Group[] = [];

  for (let g = 0; g < numGroups; g++) {
    const groupTeams: string[] = [];
    for (let p = 0; p < Math.min(availablePots.length, teamsPerGroup); p++) {
      if (availablePots[p].length > 0) {
        const idx = Math.floor(Math.random() * availablePots[p].length);
        groupTeams.push(availablePots[p][idx].id);
        availablePots[p].splice(idx, 1);
      }
    }
    groups.push({
      id: `group-${GROUP_NAMES[g]}`,
      name: `Grupo ${GROUP_NAMES[g]}`,
      teamIds: groupTeams,
      calendar: [],
    });
  }

  // Generate calendar for each group
  for (const group of groups) {
    group.calendar = generateGroupCalendar(group.teamIds);
  }

  // Generate initial standings
  const standings: Standing[] = [];
  for (const group of groups) {
    for (const teamId of group.teamIds) {
      standings.push({
        teamId,
        groupId: group.id,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      });
    }
  }

  return {
    ...tournament,
    groups,
    standings,
    status: "groups",
  };
}

export function generateGroupCalendar(teamIds: string[]): string[] {
  const matchIds: string[] = [];

  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      matchIds.push(generateId());
    }
  }

  return matchIds;
}

export function updateStandings(matches: Match[], tournament: Tournament): Standing[] {
  const newStandings: Standing[] = tournament.groups.flatMap((group) => {
    const groupMatches = matches.filter((m) =>
      group.teamIds.includes(m.homeTeamId) && group.teamIds.includes(m.awayTeamId) &&
      m.status === "finished"
    );

    return group.teamIds.map((teamId) => {
      const stats = { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0 };

      for (const match of groupMatches) {
        const isHome = match.homeTeamId === teamId;
        const goals = isHome ? match.homeScore : match.awayScore;
        const against = isHome ? match.awayScore : match.homeScore;
        stats.played++;
        stats.goalsFor += goals;
        stats.goalsAgainst += against;
        if (goals > against) stats.won++;
        else if (goals === against) stats.drawn++;
        else stats.lost++;
      }

      stats.goalDifference = stats.goalsFor - stats.goalsAgainst;
      stats.points = stats.won * 3 + stats.drawn;

      return { teamId, groupId: group.id, ...stats };
    });
  });

  return newStandings;
}

export function resolveTieBreakers(standings: Standing[], matches: Match[]): Standing[] {
  return standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

    const directMatch = matches.find(
      (m) =>
        (m.homeTeamId === a.teamId && m.awayTeamId === b.teamId) ||
        (m.homeTeamId === b.teamId && m.awayTeamId === a.teamId)
    );
    if (directMatch && directMatch.status === "finished") {
      const aGoals = directMatch.homeTeamId === a.teamId ? directMatch.homeScore : directMatch.awayScore;
      const bGoals = directMatch.homeTeamId === b.teamId ? directMatch.homeScore : directMatch.awayScore;
      if (aGoals !== bGoals) return bGoals - aGoals;
    }

    return a.teamId.localeCompare(b.teamId);
  });
}

export function getQualifiers(standings: Standing[], matches: Match[], format: TournamentFormat, groups: Group[]): {
  groupQualifiers: Map<string, string[]>;
  bestThird?: string[];
} {
  const groupQualifiers = new Map<string, string[]>();
  const thirdPlaced: { teamId: string; points: number; gd: number; gf: number }[] = [];

  for (const group of groups) {
    const groupStandings = standings.filter((s) => s.groupId === group.id);
    const sorted = resolveTieBreakers(groupStandings, matches);
    groupQualifiers.set(group.id, sorted.slice(0, 2).map((s) => s.teamId));

    if (format === 24 && sorted.length >= 3) {
      thirdPlaced.push({
        teamId: sorted[2].teamId,
        points: sorted[2].points,
        gd: sorted[2].goalDifference,
        gf: sorted[2].goalsFor,
      });
    }
  }

  let bestThird: string[] | undefined;
  if (format === 24) {
    thirdPlaced.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });
    bestThird = thirdPlaced.slice(0, 4).map((t) => t.teamId);
  }

  return { groupQualifiers, bestThird };
}

export function generateKnockoutBracket(groupQualifiers: Map<string, string[]>, bestThird: string[] | undefined, format: TournamentFormat): KnockoutMatch[] {
  const qualifiers: string[] = [];
  const groupKeys = Array.from(groupQualifiers.keys());

  if (format === 8) {
    for (const key of groupKeys) {
      const q = groupQualifiers.get(key)!;
      qualifiers.push(q[0], q[1]);
    }
  } else if (format === 16) {
    for (const key of groupKeys) {
      const q = groupQualifiers.get(key)!;
      qualifiers.push(q[0], q[1]);
    }
  } else if (format === 24) {
    const groupWinners: string[] = [];
    const groupRunnersUp: string[] = [];
    for (const key of groupKeys) {
      const q = groupQualifiers.get(key)!;
      groupWinners.push(q[0]);
      groupRunnersUp.push(q[1]);
    }
    qualifiers.push(...groupWinners, ...groupRunnersUp, ...(bestThird || []));
  } else if (format === 32) {
    for (const key of groupKeys) {
      const q = groupQualifiers.get(key)!;
      qualifiers.push(q[0], q[1]);
    }
  }

  const bracket: KnockoutMatch[] = [];
  const numTeams = qualifiers.length;
  const firstRound = numTeams === 16 ? "Round of 16" : numTeams === 8 ? "Quarter-finals" : numTeams === 4 ? "Semi-finals" : "Final";

  for (let i = 0; i < numTeams / 2; i++) {
    bracket.push({
      id: generateId(),
      round: firstRound,
      position: i,
      homeTeamId: qualifiers[i],
      awayTeamId: qualifiers[numTeams - 1 - i],
    });
  }

  return bracket;
}

export function advanceTeamsToKnockout(match: Match, bracket: KnockoutMatch[]): KnockoutMatch[] {
  const currentMatch = bracket.find((m) => m.matchId === match.id);
  if (!currentMatch) return bracket;

  const winner = match.homeScore > match.awayScore
    ? match.homeTeamId
    : match.awayScore > match.homeScore
    ? match.awayTeamId
    : match.penaltyWinner;

  if (!winner) return bracket;

  const nextRound = getNextRound(currentMatch.round);
  if (!nextRound) return bracket;

  const nextPosition = Math.floor(currentMatch.position / 2);
  const existingNext = bracket.find((m) => m.round === nextRound && m.position === nextPosition);

  if (existingNext) {
    if (currentMatch.position % 2 === 0) {
      existingNext.homeTeamId = winner;
    } else {
      existingNext.awayTeamId = winner;
    }
  } else {
    bracket.push({
      id: generateId(),
      round: nextRound,
      position: nextPosition,
      homeTeamId: currentMatch.position % 2 === 0 ? winner : undefined,
      awayTeamId: currentMatch.position % 2 === 0 ? undefined : winner,
    });
  }

  return bracket;
}

function getNextRound(currentRound: string): string | null {
  const rounds = ["Round of 16", "Quarter-finals", "Semi-finals", "Final"];
  const idx = rounds.indexOf(currentRound);
  return idx >= 0 && idx < rounds.length - 1 ? rounds[idx + 1] : null;
}

export function generateNextRound(bracket: KnockoutMatch[]): KnockoutMatch[] {
  const quarterFinals = bracket.filter((m) => m.round === "Quarter-finals" && !m.matchId);

  if (quarterFinals.length === 0) {
    const semis = bracket.filter((m) => m.round === "Semi-finals" && !m.matchId);
    if (semis.length === 0) {
      const finals = bracket.filter((m) => m.round === "Final" && !m.matchId);
      if (finals.length === 0) return bracket;
    }
    return bracket;
  }

  return bracket;
}
