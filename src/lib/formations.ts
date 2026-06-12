import type { CardPosition } from "@/types";

export interface PitchSlot {
  id: string;
  label: string;
  position: CardPosition;
  x: number; // 0-100 percentage from left
  y: number; // 0-100 percentage from top
}

const FORMATION_MAP: Record<string, PitchSlot[]> = {
  "4-3-3": [
    { id: "gk", label: "GK", position: "GK", x: 50, y: 92 },
    { id: "lb", label: "LB", position: "DEF", x: 15, y: 72 },
    { id: "cb1", label: "CB", position: "DEF", x: 35, y: 75 },
    { id: "cb2", label: "CB", position: "DEF", x: 65, y: 75 },
    { id: "rb", label: "RB", position: "DEF", x: 85, y: 72 },
    { id: "cm1", label: "CM", position: "MID", x: 25, y: 52 },
    { id: "cm2", label: "CM", position: "MID", x: 50, y: 48 },
    { id: "cm3", label: "CM", position: "MID", x: 75, y: 52 },
    { id: "lw", label: "LW", position: "FWD", x: 15, y: 25 },
    { id: "st", label: "ST", position: "FWD", x: 50, y: 18 },
    { id: "rw", label: "RW", position: "FWD", x: 85, y: 25 },
  ],
  "4-4-2": [
    { id: "gk", label: "GK", position: "GK", x: 50, y: 92 },
    { id: "lb", label: "LB", position: "DEF", x: 15, y: 72 },
    { id: "cb1", label: "CB", position: "DEF", x: 35, y: 75 },
    { id: "cb2", label: "CB", position: "DEF", x: 65, y: 75 },
    { id: "rb", label: "RB", position: "DEF", x: 85, y: 72 },
    { id: "lm", label: "LM", position: "MID", x: 12, y: 48 },
    { id: "cm1", label: "CM", position: "MID", x: 38, y: 45 },
    { id: "cm2", label: "CM", position: "MID", x: 62, y: 45 },
    { id: "rm", label: "RM", position: "MID", x: 88, y: 48 },
    { id: "st1", label: "ST", position: "FWD", x: 35, y: 22 },
    { id: "st2", label: "ST", position: "FWD", x: 65, y: 22 },
  ],
  "3-5-2": [
    { id: "gk", label: "GK", position: "GK", x: 50, y: 92 },
    { id: "cb1", label: "CB", position: "DEF", x: 25, y: 75 },
    { id: "cb2", label: "CB", position: "DEF", x: 50, y: 78 },
    { id: "cb3", label: "CB", position: "DEF", x: 75, y: 75 },
    { id: "lwb", label: "LWB", position: "MID", x: 5, y: 55 },
    { id: "cm1", label: "CM", position: "MID", x: 30, y: 48 },
    { id: "cm2", label: "CM", position: "MID", x: 50, y: 42 },
    { id: "cm3", label: "CM", position: "MID", x: 70, y: 48 },
    { id: "rwb", label: "RWB", position: "MID", x: 95, y: 55 },
    { id: "st1", label: "ST", position: "FWD", x: 35, y: 22 },
    { id: "st2", label: "ST", position: "FWD", x: 65, y: 22 },
  ],
  "4-2-3-1": [
    { id: "gk", label: "GK", position: "GK", x: 50, y: 92 },
    { id: "lb", label: "LB", position: "DEF", x: 15, y: 72 },
    { id: "cb1", label: "CB", position: "DEF", x: 35, y: 75 },
    { id: "cb2", label: "CB", position: "DEF", x: 65, y: 75 },
    { id: "rb", label: "RB", position: "DEF", x: 85, y: 72 },
    { id: "cdm1", label: "CDM", position: "MID", x: 35, y: 55 },
    { id: "cdm2", label: "CDM", position: "MID", x: 65, y: 55 },
    { id: "lw", label: "LW", position: "MID", x: 15, y: 35 },
    { id: "cam", label: "CAM", position: "MID", x: 50, y: 30 },
    { id: "rw", label: "RW", position: "MID", x: 85, y: 35 },
    { id: "st", label: "ST", position: "FWD", x: 50, y: 15 },
  ],
  "5-3-2": [
    { id: "gk", label: "GK", position: "GK", x: 50, y: 92 },
    { id: "lcb", label: "LCB", position: "DEF", x: 15, y: 72 },
    { id: "cb1", label: "CB", position: "DEF", x: 35, y: 78 },
    { id: "cb2", label: "CB", position: "DEF", x: 65, y: 78 },
    { id: "rcb", label: "RCB", position: "DEF", x: 85, y: 72 },
    { id: "lm", label: "LM", position: "MID", x: 5, y: 50 },
    { id: "cm1", label: "CM", position: "MID", x: 35, y: 48 },
    { id: "cm2", label: "CM", position: "MID", x: 65, y: 48 },
    { id: "rm", label: "RM", position: "MID", x: 95, y: 50 },
    { id: "st1", label: "ST", position: "FWD", x: 35, y: 22 },
    { id: "st2", label: "ST", position: "FWD", x: 65, y: 22 },
  ],
};

export function getFormationSlots(formation: string): PitchSlot[] {
  return FORMATION_MAP[formation] || FORMATION_MAP["4-4-2"];
}

export function getFormationPositions(formation: string): { position: CardPosition; count: number }[] {
  const slots = getFormationSlots(formation);
  const counts: Record<string, number> = {};
  for (const s of slots) {
    counts[s.position] = (counts[s.position] || 0) + 1;
  }
  return Object.entries(counts).map(([position, count]) => ({ position: position as CardPosition, count }));
}
