import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlayerCard, Team, Squad, Tournament, Match } from "@/types";
import { SEED_CARDS, SEED_TEAMS } from "@/lib/seed";

const SEED_VERSION = 2; // Incrementar cuando cambie el seed

interface AppState {
  _hydrated: boolean;
  _seedVersion: number;
  cards: PlayerCard[];
  teams: Team[];
  squads: Squad[];
  tournaments: Tournament[];
  matches: Match[];
  settings: Record<string, unknown>;

  setHydrated: () => void;
  setCards: (cards: PlayerCard[]) => void;
  addCard: (card: PlayerCard) => void;
  updateCard: (id: string, card: Partial<PlayerCard>) => void;
  deleteCard: (id: string) => void;

  setTeams: (teams: Team[]) => void;
  addTeam: (team: Team) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  deleteTeam: (id: string) => void;

  setSquads: (squads: Squad[]) => void;
  saveSquad: (squad: Squad) => void;

  setTournaments: (tournaments: Tournament[]) => void;
  createTournament: (tournament: Tournament) => void;

  setMatches: (matches: Match[]) => void;
  addMatch: (match: Match) => void;
  updateMatch: (id: string, match: Partial<Match>) => void;

  exportBackup: () => string;
  importBackup: (json: string) => void;
  resetDemoData: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      _hydrated: false,
      _seedVersion: SEED_VERSION,
      cards: [],
      teams: [],
      squads: [],
      tournaments: [],
      matches: [],
      settings: {},

      setHydrated: () => set({ _hydrated: true }),

      setCards: (cards) => set({ cards }),
      addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
      updateCard: (id, updates) =>
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
          ),
        })),
      deleteCard: (id) =>
        set((state) => ({ cards: state.cards.filter((c) => c.id !== id) })),

      setTeams: (teams) => set({ teams }),
      addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
      updateTeam: (id, updates) =>
        set((state) => ({
          teams: state.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTeam: (id) =>
        set((state) => ({ teams: state.teams.filter((t) => t.id !== id) })),

      setSquads: (squads) => set({ squads }),
      saveSquad: (squad) =>
        set((state) => ({
          squads: state.squads.some((s) => s.id === squad.id)
            ? state.squads.map((s) => (s.id === squad.id ? squad : s))
            : [...state.squads, squad],
        })),

      setTournaments: (tournaments) => set({ tournaments }),
      createTournament: (tournament) =>
        set((state) => ({ tournaments: [...state.tournaments, tournament] })),

      setMatches: (matches) => set({ matches }),
      addMatch: (match) => set((state) => ({ matches: [...state.matches, match] })),
      updateMatch: (id, updates) =>
        set((state) => ({
          matches: state.matches.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),

      exportBackup: () => {
        const state = get();
        return JSON.stringify({
          cards: state.cards,
          teams: state.teams,
          squads: state.squads,
          tournaments: state.tournaments,
          matches: state.matches,
          settings: state.settings,
          exportedAt: new Date().toISOString(),
        });
      },

      importBackup: (json) => {
        try {
          const data = JSON.parse(json);
          set({
            cards: data.cards || [],
            teams: data.teams || [],
            squads: data.squads || [],
            tournaments: data.tournaments || [],
            matches: data.matches || [],
            settings: data.settings || {},
          });
        } catch {
          throw new Error("Invalid backup file");
        }
      },

      resetDemoData: () =>
        set({
          cards: [],
          teams: [],
          squads: [],
          tournaments: [],
          matches: [],
          settings: {},
        }),
    }),
    {
      name: "adrenalyn-cup-storage",
      partialize: (state) => ({
        cards: state.cards,
        teams: state.teams,
        squads: state.squads,
        tournaments: state.tournaments,
        matches: state.matches,
        settings: state.settings,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const needsReseed = state.cards.length === 0 && state.teams.length === 0;
        const versionMismatch = state._seedVersion !== SEED_VERSION;
        if (needsReseed || versionMismatch) {
          state.setCards(SEED_CARDS);
          state.setTeams(SEED_TEAMS);
          state._seedVersion = SEED_VERSION;
        }
        state.setHydrated();
      },
    }
  )
);
