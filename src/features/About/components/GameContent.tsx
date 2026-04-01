import { useState } from "react";
import { type Game } from "../types";
import AboutCard from "../../../components/AboutCard";
import GameDetail from "./GameDetail";
import { useMedia } from "../../../hooks/useMedia";

export default function GameContent() {
  const { medias, loading } = useMedia();
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  // Filter for game type and map to consistent structure
  // Filter for game type and map to consistent structure
  const games: Game[] = medias
    .filter(m => m.type === 'game')
    .map(m => ({
      id: m.id,
      title: m.title,
      imageSrc: m.image_url,
      year: m.year || 0,
      description: m.description || "",
      genres: m.categories?.map(c => c.name) || []
    }));

  if (selectedGameId) {
    const game = games.find((g) => g.id === selectedGameId);
    if (game) {
      return <GameDetail game={game} onBack={() => setSelectedGameId(null)} />;
    }
  }

  if (loading) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-3/4 bg-white/5 rounded-2xl animate-pulse" />
            ))}
        </div>
      );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 content-start gap-3 md:gap-6 p-2 md:p-4 pb-10 h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
      {games.length > 0 ? (
          games.map((game, index) => (
            <AboutCard
              key={game.id}
              imageSrc={game.imageSrc}
              title={game.title}
              delay={(index % 8) * 0.1}
              onClick={() => setSelectedGameId(game.id)}
            />
          ))
      ) : (
          <div className="col-span-full h-full flex flex-col items-center justify-center opacity-20 py-20">
              <span className="text-4xl mb-4">🎮</span>
              <p className="text-sm uppercase tracking-widest">No signals found in Game Frequency</p>
          </div>
      )}
    </div>
  );
}
