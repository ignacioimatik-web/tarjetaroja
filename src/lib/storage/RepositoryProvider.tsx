"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Repository } from "./Repository";
import { createLocalRepository } from "./LocalStorageRepository";
import { createSupabaseRepository } from "./SupabaseRepository";
import { isSupabaseConfigured, shouldUseSupabase } from "@/lib/db/supabase/client";

type BackendType = "local" | "supabase";

interface RepositoryContextValue {
  repo: Repository;
  backend: BackendType;
  isOnline: boolean;
  switchBackend: (type: BackendType) => void;
  syncFromRemote: () => Promise<void>;
  syncToRemote: () => Promise<void>;
}

const RepositoryContext = createContext<RepositoryContextValue | null>(null);

export function useRepository(): RepositoryContextValue {
  const ctx = useContext(RepositoryContext);
  if (!ctx) throw new Error("useRepository must be used within a RepositoryProvider");
  return ctx;
}

export function RepositoryProvider({ children }: { children: React.ReactNode }) {
  const isSupabase = shouldUseSupabase();
  const [backend, setBackend] = useState<BackendType>(isSupabase ? "supabase" : "local");
  const [isOnline, setIsOnline] = useState(true);

  const repo = backend === "supabase" ? createSupabaseRepository() : createLocalRepository();

  const switchBackend = useCallback((type: BackendType) => {
    if (type === "supabase" && !isSupabaseConfigured()) {
      console.warn("Supabase not configured. Staying on local backend.");
      return;
    }
    setBackend(type);
  }, []);

  const syncFromRemote = useCallback(async () => {
    if (backend !== "supabase") return;
    try {
      const supabaseRepo = createSupabaseRepository();
      const store = (await import("@/store/useStore")).useStore;
      const [cards, teams, squads, tournaments, matches] = await Promise.all([
        supabaseRepo.getCards(),
        supabaseRepo.getTeams(),
        supabaseRepo.getSquads(),
        supabaseRepo.getTournaments(),
        supabaseRepo.getMatches(),
      ]);
      const state = store.getState();
      if (cards.length > 0) state.setCards(cards);
      if (teams.length > 0) state.setTeams(teams);
      if (squads.length > 0) state.setSquads(squads);
      if (tournaments.length > 0) state.setTournaments(tournaments);
      if (matches.length > 0) state.setMatches(matches);
      setIsOnline(true);
    } catch {
      setIsOnline(false);
    }
  }, [backend]);

  const syncToRemote = useCallback(async () => {
    if (backend !== "supabase") return;
    try {
      const supabaseRepo = createSupabaseRepository();
      const store = (await import("@/store/useStore")).useStore;
      const state = store.getState();
      await Promise.all([
        ...state.cards.map((c) => supabaseRepo.createCard(c).catch(() => {})),
        ...state.teams.map((t) => supabaseRepo.createTeam(t).catch(() => {})),
        ...state.tournaments.map((t) => supabaseRepo.createTournament(t).catch(() => {})),
      ]);
      setIsOnline(true);
    } catch {
      setIsOnline(false);
    }
  }, [backend]);

  useEffect(() => {
    if (backend === "supabase") {
      syncFromRemote();
    }
  }, [backend, syncFromRemote]);

  return (
    <RepositoryContext.Provider
      value={{ repo, backend, isOnline, switchBackend, syncFromRemote, syncToRemote }}
    >
      {children}
    </RepositoryContext.Provider>
  );
}
