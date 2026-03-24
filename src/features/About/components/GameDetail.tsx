import type { Game } from "../mockData";

interface GameDetailProps {
  game: Game;
  onBack: () => void;
}

export default function GameDetail({ game, onBack }: GameDetailProps) {
  return (
    <div className="fade-in-up w-full h-full p-3 md:p-6 flex flex-col md:flex-row gap-6 overflow-y-auto custom-scrollbar">
      {/* Poster */}
      <div className="w-full md:w-1/3 shrink-0 flex justify-center items-start">
        <img 
          src={game.imageSrc} 
          alt={game.title} 
          className="w-full max-w-[200px] md:max-w-sm rounded-2xl shadow-[0_0_20px_2px_rgba(0,0,0,0.6)] object-cover border border-gray-600"
        />
      </div>

      {/* Info column */}
      <div className="w-full md:w-2/3 flex flex-col justify-start">
        <button 
          onClick={onBack}
          className="mb-4 self-start px-4 py-1.5 bg-[#1a1d2e] hover:bg-[#536976] text-white rounded-lg transition-colors border border-gray-500 shadow-md flex items-center gap-2 text-sm"
        >
          <span>&larr; Back to List</span>
        </button>

        <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 drop-shadow-md">
          {game.title}
        </h2>
        
        <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-300">
          <span className="bg-[#1a1d2e] px-4 py-1.5 rounded-full text-base font-bold border border-gray-600 shadow-sm">
            Released: {game.year}
          </span>
          <div className="flex flex-wrap gap-2">
            {game.genres.map((g) => (
              <span key={g} className="bg-linear-to-r from-[#292E49] to-[#536976] px-4 py-1.5 rounded-full text-sm font-semibold text-white shadow-sm">
                {g}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-2 bg-[#1a1d2e] bg-opacity-60 p-4 md:p-8 rounded-2xl md:rounded-3xl border border-gray-600 backdrop-blur-lg shadow-lg">
          <h3 className="text-lg md:text-2xl font-semibold mb-3 text-secondary-1">Description</h3>
          <p className="text-gray-300 leading-relaxed text-sm md:text-lg text-justify">
            {game.description}
          </p>
        </div>
      </div>
    </div>
  );
}
