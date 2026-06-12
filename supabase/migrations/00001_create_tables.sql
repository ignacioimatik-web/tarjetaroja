-- ADRENALYN CUP - Database Schema
-- Migration 00001: Create all core tables

-- Cards table
CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  team_name TEXT NOT NULL,
  country TEXT,
  club_name TEXT,
  national_team_name TEXT,
  position TEXT NOT NULL CHECK (position IN ('GK', 'DEF', 'MID', 'FWD')),
  rarity TEXT NOT NULL CHECK (rarity IN ('BASE', 'RARE', 'EPIC', 'LEGENDARY', 'GOLDEN', 'MOMENTUM', 'ULTRA_RARE')),
  card_type TEXT,
  attack INTEGER NOT NULL DEFAULT 50,
  control INTEGER NOT NULL DEFAULT 50,
  defense INTEGER NOT NULL DEFAULT 50,
  total INTEGER NOT NULL DEFAULT 50,
  image_url TEXT,
  avatar_seed TEXT,
  avatar_style TEXT DEFAULT 'classic',
  collection TEXT DEFAULT 'Temporada 1',
  season TEXT DEFAULT '2025/26',
  is_special BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('national', 'club', 'draft')),
  country TEXT,
  league TEXT,
  colors JSONB DEFAULT '{}',
  manager TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Squads table
CREATE TABLE IF NOT EXISTS squads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  formation TEXT NOT NULL DEFAULT '4-4-2',
  starters TEXT[] NOT NULL DEFAULT '{}',
  substitutes TEXT[] NOT NULL DEFAULT '{}',
  mode TEXT NOT NULL DEFAULT 'standard',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mode TEXT NOT NULL,
  format INTEGER NOT NULL,
  teams TEXT[] NOT NULL DEFAULT '{}',
  groups JSONB DEFAULT '[]',
  standings JSONB DEFAULT '[]',
  knockout_bracket JSONB DEFAULT '[]',
  current_round TEXT DEFAULT 'groups',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'groups', 'knockout', 'finished')),
  winner TEXT,
  rules JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  home_team_id TEXT NOT NULL,
  away_team_id TEXT NOT NULL,
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  rounds JSONB DEFAULT '[]',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'live', 'finished')),
  round TEXT DEFAULT '',
  phase TEXT DEFAULT 'group' CHECK (phase IN ('group', 'knockout')),
  group_id TEXT,
  knockout_position INTEGER,
  penalty_winner TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cards_rarity ON cards(rarity);
CREATE INDEX IF NOT EXISTS idx_cards_position ON cards(position);
CREATE INDEX IF NOT EXISTS idx_cards_team_name ON cards(team_name);
CREATE INDEX IF NOT EXISTS idx_squads_team_id ON squads(team_id);
CREATE INDEX IF NOT EXISTS idx_matches_tournament_id ON matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);

-- Enable Row Level Security
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Default policies (allow all for MVP - tighten for production)
CREATE POLICY "Enable all for authenticated" ON cards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated" ON squads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated" ON tournaments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for authenticated" ON matches FOR ALL USING (true) WITH CHECK (true);
