import { useState } from "react";
import AboutCard from "../../../components/AboutCard";
import GameDetail from "./GameDetail";
import { mockGames } from "../mockData";

export default function GameContent() {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  if (selectedGameId) {
    const game = mockGames.find((g) => g.id === selectedGameId);
    if (game) {
      return <GameDetail game={game} onBack={() => setSelectedGameId(null)} />;
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 content-start gap-6 p-4 h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
      {mockGames.map((game, index) => (
        <AboutCard
          key={game.id}
          imageSrc={game.imageSrc}
          title={game.title}
          delay={(index % 8) * 0.1}
          onClick={() => setSelectedGameId(game.id)}
        />
      ))}
    </div>
  );
}
