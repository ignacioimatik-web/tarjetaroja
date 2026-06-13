"use client";

import { PlayerCard, type Player } from "@/components/cards/PlayerCard";

const demoPlayers: Player[] = [
  {
    name: "Aiko Tanaka",
    position: "FWD",
    overall: 99,
    team: "Tokyo Storm",
    nationality: "Japan",
    rarity: "mythic",
    imageUrl: "https://picsum.photos/seed/aiko/400/500",
    stats: { pace: 97, shooting: 99, passing: 91, dribbling: 98, defense: 30, physical: 72 },
  },
  {
    name: "Ryuji Kazama",
    position: "MID",
    overall: 94,
    team: "Osaka Rising",
    nationality: "Japan",
    rarity: "legendary",
    imageUrl: "https://picsum.photos/seed/ryuji/400/500",
    stats: { pace: 85, shooting: 92, passing: 96, dribbling: 90, defense: 70, physical: 78 },
  },
  {
    name: "Marco Delgado",
    position: "MID",
    overall: 88,
    team: "Buenos Aires FC",
    nationality: "Argentina",
    rarity: "epic",
    imageUrl: "https://picsum.photos/seed/marco/400/500",
    stats: { pace: 76, shooting: 84, passing: 91, dribbling: 88, defense: 65, physical: 80 },
  },
  {
    name: "Sergio Valenzuela",
    position: "DEF",
    overall: 86,
    team: "Madrid United",
    nationality: "Spain",
    rarity: "epic",
    imageUrl: "https://picsum.photos/seed/sergio/400/500",
    stats: { pace: 72, shooting: 55, passing: 78, dribbling: 68, defense: 93, physical: 90 },
  },
  {
    name: "Kenji Nakamura",
    position: "GK",
    overall: 91,
    team: "Tokyo Storm",
    nationality: "Japan",
    rarity: "legendary",
    imageUrl: "https://picsum.photos/seed/kenji/400/500",
    stats: { pace: 45, shooting: 40, passing: 68, dribbling: 55, defense: 94, physical: 88 },
  },
  {
    name: "Liam Sterling",
    position: "DEF",
    overall: 82,
    team: "London Athletic",
    nationality: "England",
    rarity: "rare",
    imageUrl: "https://picsum.photos/seed/liam/400/500",
    stats: { pace: 80, shooting: 50, passing: 72, dribbling: 65, defense: 85, physical: 82 },
  },
  {
    name: "Oliver Schmidt",
    position: "FWD",
    overall: 78,
    team: "Berlin Eagles",
    nationality: "Germany",
    rarity: "rare",
    imageUrl: "https://picsum.photos/seed/oliver/400/500",
    stats: { pace: 88, shooting: 80, passing: 70, dribbling: 82, defense: 35, physical: 72 },
  },
  {
    name: "Pierre Dubois",
    position: "MID",
    overall: 72,
    team: "Paris Glory",
    nationality: "France",
    rarity: "common",
    imageUrl: "https://picsum.photos/seed/pierre/400/500",
    stats: { pace: 68, shooting: 70, passing: 75, dribbling: 72, defense: 60, physical: 65 },
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            MANGA <span className="text-gradient-blue">SPORTS</span> CARDS
          </h1>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            Layered player card system. AI image is visual-only — all data rendered by the app.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {demoPlayers.map((player) => (
            <PlayerCard key={player.name} player={player} />
          ))}
        </div>
      </div>
    </div>
  );
}
