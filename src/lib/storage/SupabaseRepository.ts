import { supabase } from "@/lib/db/supabase/client";
import type { Repository } from "./Repository";
import type { PlayerCard, Team, Squad, Tournament, Match } from "@/types";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

function mapCard(row: AnyRecord): PlayerCard {
  return {
    id: row.id,
    name: row.name,
    teamName: row.team_name,
    country: row.country,
    clubName: row.club_name,
    nationalTeamName: row.national_team_name,
    position: row.position,
    rarity: row.rarity,
    cardType: row.card_type,
    attack: row.attack,
    control: row.control,
    defense: row.defense,
    total: row.total,
    imageUrl: row.image_url,
    avatarSeed: row.avatar_seed,
    avatarStyle: row.avatar_style,
    collection: row.collection,
    season: row.season,
    isSpecial: row.is_special,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTeam(row: AnyRecord): Team {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    country: row.country,
    league: row.league,
    colors: row.colors || {},
    manager: row.manager,
    createdAt: row.created_at,
  };
}

function mapSquad(row: AnyRecord): Squad {
  return {
    id: row.id,
    teamId: row.team_id,
    formation: row.formation,
    starters: row.starters || [],
    substitutes: row.substitutes || [],
    mode: row.mode,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTournament(row: AnyRecord): Tournament {
  return {
    id: row.id,
    name: row.name,
    mode: row.mode,
    format: row.format,
    teams: row.teams || [],
    groups: row.groups || [],
    standings: row.standings || [],
    knockoutBracket: row.knockout_bracket || [],
    currentRound: row.current_round || "groups",
    status: row.status || "pending",
    winner: row.winner,
    rules: row.rules || {},
    createdAt: row.created_at,
  };
}

function mapMatch(row: AnyRecord): Match {
  return {
    id: row.id,
    tournamentId: row.tournament_id,
    homeTeamId: row.home_team_id,
    awayTeamId: row.away_team_id,
    homeScore: row.home_score || 0,
    awayScore: row.away_score || 0,
    rounds: row.rounds || [],
    status: row.status || "pending",
    round: row.round || "",
    phase: row.phase || "group",
    groupId: row.group_id,
    knockoutPosition: row.knockout_position,
    penaltyWinner: row.penalty_winner,
    createdAt: row.created_at,
  };
}

async function withErrorHandling<T>(operation: () => Promise<T>): Promise<T> {
  try {
    const result = await operation();
    return result;
  } catch (error) {
    console.error("[SupabaseRepository]", error);
    throw error;
  }
}

export function createSupabaseRepository(): Repository {
  return {
    // Cards
    getCards: async () => {
      return withErrorHandling(async () => {
        const { data, error } = await supabase.from("cards").select("*").order("created_at");
        if (error) throw error;
        return (data || []).map(mapCard);
      });
    },

    getCardById: async (id) => {
      return withErrorHandling(async () => {
        const { data, error } = await supabase.from("cards").select("*").eq("id", id).single();
        if (error) throw error;
        return data ? mapCard(data) : undefined;
      });
    },

    createCard: async (card) => {
      return withErrorHandling(async () => {
        const { error } = await supabase.from("cards").insert({
          id: card.id,
          name: card.name,
          team_name: card.teamName,
          country: card.country,
          club_name: card.clubName,
          national_team_name: card.nationalTeamName,
          position: card.position,
          rarity: card.rarity,
          card_type: card.cardType,
          attack: card.attack,
          control: card.control,
          defense: card.defense,
          total: card.total,
          image_url: card.imageUrl,
          avatar_seed: card.avatarSeed,
          avatar_style: card.avatarStyle,
          collection: card.collection,
          season: card.season,
          is_special: card.isSpecial,
        });
        if (error) throw error;
      });
    },

    updateCard: async (id, data) => {
      return withErrorHandling(async () => {
        const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (data.name !== undefined) updateData.name = data.name;
        if (data.teamName !== undefined) updateData.team_name = data.teamName;
        if (data.position !== undefined) updateData.position = data.position;
        if (data.rarity !== undefined) updateData.rarity = data.rarity;
        if (data.attack !== undefined) updateData.attack = data.attack;
        if (data.control !== undefined) updateData.control = data.control;
        if (data.defense !== undefined) updateData.defense = data.defense;
        if (data.total !== undefined) updateData.total = data.total;
        const { error } = await supabase.from("cards").update(updateData).eq("id", id);
        if (error) throw error;
      });
    },

    deleteCard: async (id) => {
      return withErrorHandling(async () => {
        const { error } = await supabase.from("cards").delete().eq("id", id);
        if (error) throw error;
      });
    },

    // Teams
    getTeams: async () => {
      return withErrorHandling(async () => {
        const { data, error } = await supabase.from("teams").select("*").order("created_at");
        if (error) throw error;
        return (data || []).map(mapTeam);
      });
    },

    getTeamById: async (id) => {
      return withErrorHandling(async () => {
        const { data, error } = await supabase.from("teams").select("*").eq("id", id).single();
        if (error) throw error;
        return data ? mapTeam(data) : undefined;
      });
    },

    createTeam: async (team) => {
      return withErrorHandling(async () => {
        const { error } = await supabase.from("teams").insert({
          id: team.id,
          name: team.name,
          type: team.type,
          country: team.country,
          league: team.league,
          colors: team.colors || {},
          manager: team.manager,
        });
        if (error) throw error;
      });
    },

    updateTeam: async (id, data) => {
      return withErrorHandling(async () => {
        const { error } = await supabase.from("teams").update(data).eq("id", id);
        if (error) throw error;
      });
    },

    deleteTeam: async (id) => {
      return withErrorHandling(async () => {
        const { error } = await supabase.from("teams").delete().eq("id", id);
        if (error) throw error;
      });
    },

    // Squads
    getSquads: async () => {
      return withErrorHandling(async () => {
        const { data, error } = await supabase.from("squads").select("*");
        if (error) throw error;
        return (data || []).map(mapSquad);
      });
    },

    getSquadById: async (id) => {
      return withErrorHandling(async () => {
        const { data, error } = await supabase.from("squads").select("*").eq("id", id).single();
        if (error) throw error;
        return data ? mapSquad(data) : undefined;
      });
    },

    saveSquad: async (squad) => {
      return withErrorHandling(async () => {
        const exists = await supabase.from("squads").select("id").eq("id", squad.id).single();
        const payload = {
          id: squad.id,
          team_id: squad.teamId,
          formation: squad.formation,
          starters: squad.starters,
          substitutes: squad.substitutes,
          mode: squad.mode,
          updated_at: new Date().toISOString(),
        };
        if (exists.data) {
          const { error } = await supabase.from("squads").update(payload).eq("id", squad.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("squads").insert({ ...payload, created_at: new Date().toISOString() });
          if (error) throw error;
        }
      });
    },

    // Tournaments
    getTournaments: async () => {
      return withErrorHandling(async () => {
        const { data, error } = await supabase.from("tournaments").select("*").order("created_at");
        if (error) throw error;
        return (data || []).map(mapTournament);
      });
    },

    getTournamentById: async (id) => {
      return withErrorHandling(async () => {
        const { data, error } = await supabase.from("tournaments").select("*").eq("id", id).single();
        if (error) throw error;
        return data ? mapTournament(data) : undefined;
      });
    },

    createTournament: async (tournament) => {
      return withErrorHandling(async () => {
        const { error } = await supabase.from("tournaments").insert({
          id: tournament.id,
          name: tournament.name,
          mode: tournament.mode,
          format: tournament.format,
          teams: tournament.teams,
          groups: tournament.groups,
          standings: tournament.standings,
          knockout_bracket: tournament.knockoutBracket,
          current_round: tournament.currentRound,
          status: tournament.status,
          winner: tournament.winner,
          rules: tournament.rules,
        });
        if (error) throw error;
      });
    },

    // Matches
    getMatches: async () => {
      return withErrorHandling(async () => {
        const { data, error } = await supabase.from("matches").select("*").order("created_at");
        if (error) throw error;
        return (data || []).map(mapMatch);
      });
    },

    getMatchById: async (id) => {
      return withErrorHandling(async () => {
        const { data, error } = await supabase.from("matches").select("*").eq("id", id).single();
        if (error) throw error;
        return data ? mapMatch(data) : undefined;
      });
    },

    createMatch: async (match) => {
      return withErrorHandling(async () => {
        const { error } = await supabase.from("matches").insert({
          id: match.id,
          tournament_id: match.tournamentId,
          home_team_id: match.homeTeamId,
          away_team_id: match.awayTeamId,
          home_score: match.homeScore,
          away_score: match.awayScore,
          rounds: match.rounds,
          status: match.status,
          round: match.round,
          phase: match.phase,
          group_id: match.groupId,
          knockout_position: match.knockoutPosition,
          penalty_winner: match.penaltyWinner,
        });
        if (error) throw error;
      });
    },

    updateMatch: async (id, data) => {
      return withErrorHandling(async () => {
        const updateData: Record<string, unknown> = {};
        if (data.homeScore !== undefined) updateData.home_score = data.homeScore;
        if (data.awayScore !== undefined) updateData.away_score = data.awayScore;
        if (data.rounds !== undefined) updateData.rounds = data.rounds;
        if (data.status !== undefined) updateData.status = data.status;
        if (data.penaltyWinner !== undefined) updateData.penalty_winner = data.penaltyWinner;
        const { error } = await supabase.from("matches").update(updateData).eq("id", id);
        if (error) throw error;
      });
    },

    // System
    exportAll: () => {
      throw new Error("Export not supported in Supabase mode");
    },

    importAll: () => {
      throw new Error("Import not supported in Supabase mode");
    },

    resetAll: async () => {
      return withErrorHandling(async () => {
        await supabase.from("matches").delete().neq("id", "none");
        await supabase.from("tournaments").delete().neq("id", "none");
        await supabase.from("squads").delete().neq("id", "none");
        await supabase.from("teams").delete().neq("id", "none");
        await supabase.from("cards").delete().neq("id", "none");
      });
    },
  };
}
