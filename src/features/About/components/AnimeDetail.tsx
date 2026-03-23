import type { Anime } from "../mockData";

interface AnimeDetailProps {
  anime: Anime;
  onBack: () => void;
}

export default function AnimeDetail({ anime, onBack }: AnimeDetailProps) {
  return (
    <div className="fade-in-up w-full h-full p-6 flex flex-col md:flex-row gap-8 overflow-y-auto custom-scrollbar">
      {/* Cột trái: Ảnh minh họa (Poster) */}
      <div className="w-full md:w-1/3 shrink-0 flex justify-center items-start">
        <img 
          src={anime.imageSrc} 
          alt={anime.title} 
          className="w-full max-w-sm rounded-2xl shadow-[0_0_20px_2px_rgba(0,0,0,0.6)] object-cover border border-gray-600"
        />
      </div>

      {/* Cột phải: Thông tin chi tiết */}
      <div className="w-full md:w-2/3 flex flex-col justify-start">
        <button 
          onClick={onBack}
          className="mb-8 self-start px-5 py-2 bg-[#1a1d2e] hover:bg-[#536976] text-white rounded-lg transition-colors border border-gray-500 shadow-md flex items-center gap-2"
        >
          <span>&larr; Back to List</span>
        </button>

        <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 drop-shadow-md">
          {anime.title}
        </h2>
        
        <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-300">
          <span className="bg-[#1a1d2e] px-4 py-1.5 rounded-full text-base font-bold border border-gray-600 shadow-sm">
            Năm phát hành: {anime.year}
          </span>
          <div className="flex flex-wrap gap-2">
            {anime.genres.map((g) => (
              <span key={g} className="bg-linear-to-r from-[#292E49] to-[#536976] px-4 py-1.5 rounded-full text-sm font-semibold text-white shadow-sm">
                {g}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-2 bg-[#1a1d2e] bg-opacity-60 p-8 rounded-3xl border border-gray-600 backdrop-blur-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-secondary-1">Mô tả (Synopsis)</h3>
          <p className="text-gray-300 leading-relaxed text-lg text-justify">
            {anime.description}
          </p>
        </div>
      </div>
    </div>
  );
}
