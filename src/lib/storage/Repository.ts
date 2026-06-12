import type { PlayerCard, Team, Squad, Tournament, Match } from "@/types";

export interface Repository {
  getCards(): Promise<PlayerCard[]>;
  getCardById(id: string): Promise<PlayerCard | undefined>;
  createCard(card: PlayerCard): Promise<void>;
  updateCard(id: string, data: Partial<PlayerCard>): Promise<void>;
  deleteCard(id: string): Promise<void>;

  getTeams(): Promise<Team[]>;
  getTeamById(id: string): Promise<Team | undefined>;
  createTeam(team: Team): Promise<void>;
  updateTeam(id: string, data: Partial<Team>): Promise<void>;
  deleteTeam(id: string): Promise<void>;

  getSquads(): Promise<Squad[]>;
  getSquadById(id: string): Promise<Squad | undefined>;
  saveSquad(squad: Squad): Promise<void>;

  getTournaments(): Promise<Tournament[]>;
  getTournamentById(id: string): Promise<Tournament | undefined>;
  createTournament(tournament: Tournament): Promise<void>;

  getMatches(): Promise<Match[]>;
  getMatchById(id: string): Promise<Match | undefined>;
  createMatch(match: Match): Promise<void>;
  updateMatch(id: string, data: Partial<Match>): Promise<void>;

  exportAll(): Promise<string>;
  importAll(json: string): Promise<void>;
  resetAll(): Promise<void>;
}
