export type CardRarity =
  | "BASE"
  | "RARE"
  | "EPIC"
  | "LEGENDARY"
  | "GOLDEN"
  | "MOMENTUM"
  | "ULTRA_RARE";

export type CardPosition = "GK" | "DEF" | "MID" | "FWD";

export type TeamType = "national" | "club" | "draft";

export type TournamentFormat = 8 | 16 | 24 | 32;

export type TournamentMode = "infantil" | "standard" | "advanced";

export type MatchStatus = "pending" | "live" | "finished";

export type MatchRoundStatus = "pending" | "played" | "draw";

export interface PlayerCard {
  id: string;
  name: string;
  teamName: string;
  country?: string;
  clubName?: string;
  nationalTeamName?: string;
  position: CardPosition;
  rarity: CardRarity;
  cardType?: string;
  attack: number;
  control: number;
  defense: number;
  total: number;
  imageUrl?: string;
  avatarSeed?: string;
  avatarStyle?: string;
  collection?: string;
  season?: string;
  isSpecial?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Team {
  id: string;
  name: string;
  type: TeamType;
  country?: string;
  league?: string;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  manager?: string;
  createdAt?: string;
}

export interface Squad {
  id: string;
  teamId: string;
  formation: string;
  starters: string[];
  substitutes: string[];
  mode: TournamentMode;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tournament {
  id: string;
  name: string;
  mode: TournamentMode;
  format: TournamentFormat;
  teams: string[];
  groups: Group[];
  standings: Standing[];
  knockoutBracket: KnockoutMatch[];
  currentRound: string;
  status: "pending" | "groups" | "knockout" | "finished";
  winner?: string;
  rules: RuleSet;
  createdAt?: string;
}

export interface Group {
  id: string;
  name: string;
  teamIds: string[];
  calendar: string[];
}

export interface Standing {
  teamId: string;
  groupId?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface KnockoutMatch {
  id: string;
  round: string;
  position: number;
  homeTeamId?: string;
  awayTeamId?: string;
  matchId?: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  rounds: MatchRound[];
  status: MatchStatus;
  round: string;
  phase: "group" | "knockout";
  groupId?: string;
  knockoutPosition?: number;
  penaltyWinner?: string;
  createdAt?: string;
}

export interface MatchRound {
  roundNumber: number;
  homeCardId?: string;
  awayCardId?: string;
  statUsed: "attack" | "control" | "defense";
  homeValue: number;
  awayValue: number;
  winner: "home" | "away" | "draw";
  homeGoal: boolean;
  awayGoal: boolean;
  homeSubstitution?: string;
  awaySubstitution?: string;
}

export interface RuleSet {
  mode: TournamentMode;
  squadSizeStarters: number;
  squadSizeSubs: number;
  maxUltraRare: number;
  maxGolden: number;
  maxMomentum: number;
  maxEpicSpecial2: number;
  maxRareSpecial1: number;
  minBase: number;
  minGoalkeepers: number;
  maxSpecialCards: number;
  budget?: number;
  maxRounds: number;
  allowDuplicates: boolean;
  enableFatigue: boolean;
  enableHandicap: boolean;
  goalMode: "simple" | "realistic";
}

export interface AvatarConfig {
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  expression: string;
  jerseyColor: string;
  jerseySecondary: string;
  backgroundColor: string;
  glowColor: string;
  style: AvatarStyle;
}

export type AvatarStyle = "classic" | "neon" | "gold" | "shadow" | "rookie" | "legend";
