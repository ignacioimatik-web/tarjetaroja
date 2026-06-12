import { useStore } from "@/store/useStore";
import type { Repository } from "./Repository";

function store() {
  return useStore.getState();
}

export function createLocalRepository(): Repository {
  return {
    getCards: async () => store().cards,
    getCardById: async (id) => store().cards.find((c) => c.id === id),
    createCard: async (card) => store().addCard(card),
    updateCard: async (id, data) => store().updateCard(id, data),
    deleteCard: async (id) => store().deleteCard(id),

    getTeams: async () => store().teams,
    getTeamById: async (id) => store().teams.find((t) => t.id === id),
    createTeam: async (team) => store().addTeam(team),
    updateTeam: async (id, data) => store().updateTeam(id, data),
    deleteTeam: async (id) => store().deleteTeam(id),

    getSquads: async () => store().squads,
    getSquadById: async (id) => store().squads.find((s) => s.id === id),
    saveSquad: async (squad) => store().saveSquad(squad),

    getTournaments: async () => store().tournaments,
    getTournamentById: async (id) => store().tournaments.find((t) => t.id === id),
    createTournament: async (tournament) => store().createTournament(tournament),

    getMatches: async () => store().matches,
    getMatchById: async (id) => store().matches.find((m) => m.id === id),
    createMatch: async (match) => store().addMatch(match),
    updateMatch: async (id, data) => store().updateMatch(id, data),

    exportAll: async () => store().exportBackup(),
    importAll: async (json) => store().importBackup(json),
    resetAll: async () => store().resetDemoData(),
  };
}
