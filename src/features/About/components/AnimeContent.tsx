import { useState } from "react";
import AboutCard from "../../../components/AboutCard";
import AnimeDetail from "./AnimeDetail";
import { mockAnimes } from "../mockData";

export default function AnimeContent() {
  const [selectedAnimeId, setSelectedAnimeId] = useState<string | null>(null);

  if (selectedAnimeId) {
    const anime = mockAnimes.find((a) => a.id === selectedAnimeId);
    if (anime) {
      return <AnimeDetail anime={anime} onBack={() => setSelectedAnimeId(null)} />;
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 content-start gap-6 p-4 h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
      {mockAnimes.map((anime, index) => (
        <AboutCard
          key={anime.id}
          imageSrc={anime.imageSrc}
          title={anime.title}
          delay={(index % 8) * 0.1}
          onClick={() => setSelectedAnimeId(anime.id)}
        />
      ))}
    </div>
  );
}
