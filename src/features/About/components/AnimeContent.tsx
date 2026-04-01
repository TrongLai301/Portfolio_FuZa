import { useState } from "react";
import { type Anime } from "../types";
import AboutCard from "../../../components/AboutCard";
import AnimeDetail from "./AnimeDetail";
import { useMedia } from "../../../hooks/useMedia";

export default function AnimeContent() {
  const { medias, loading } = useMedia();
  const [selectedAnimeId, setSelectedAnimeId] = useState<string | null>(null);

  // Filter for anime type and map to consistent structure
  const animes: Anime[] = medias
    .filter(m => m.type === 'anime')
    .map(m => ({
      id: m.id,
      title: m.title,
      imageSrc: m.image_url,
      year: m.year || 0,
      description: m.description || "",
      genres: m.categories?.map(c => c.name) || []
    }));

  if (selectedAnimeId) {
    const anime = animes.find((a) => a.id === selectedAnimeId);
    if (anime) {
      return <AnimeDetail anime={anime} onBack={() => setSelectedAnimeId(null)} />;
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
      {animes.length > 0 ? (
          animes.map((anime, index) => (
            <AboutCard
              key={anime.id}
              imageSrc={anime.imageSrc}
              title={anime.title}
              delay={(index % 8) * 0.1}
              onClick={() => setSelectedAnimeId(anime.id)}
            />
          ))
      ) : (
          <div className="col-span-full h-full flex flex-col items-center justify-center opacity-20 py-20">
              <span className="text-4xl mb-4">🎬</span>
              <p className="text-sm uppercase tracking-widest">No signals found in Anime Frequency</p>
          </div>
      )}
    </div>
  );
}
