import type { Game } from "../types";

interface GameDetailProps {
  game: Game;
  onBack: () => void;
}

export default function GameDetail({ game, onBack }: GameDetailProps) {
  return (
    <div className="fade-in-up w-full min-h-[480px] p-4 sm:p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 rounded-3xl border border-cyan-500/25 bg-[#0a0f1d]/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)]">
      {/* Poster with subtle cosmic glow */}
      <div className="w-full md:w-1/3 shrink-0 flex justify-center items-start">
        <div className="relative group">
          <img 
            src={game.imageSrc} 
            alt={game.title} 
            className="w-full max-w-[220px] md:max-w-sm rounded-2xl md:rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] object-cover border border-cyan-500/30"
          />
          <div className="absolute -inset-4 bg-cyan-500/15 blur-3xl -z-10 rounded-full pointer-events-none"></div>
        </div>
      </div>

      {/* Info column */}
      <div className="w-full md:w-2/3 flex flex-col justify-start">
        {/* Back button */}
        <button 
          onClick={onBack}
          className="mb-5 self-start px-4 sm:px-5 py-2 sm:py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 rounded-xl transition-all duration-300 border border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-center gap-2.5 text-xs sm:text-sm font-semibold group cursor-pointer"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">&larr;</span>
          <span>Back to List</span>
        </button>

        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
          {game.title}
        </h2>
        
        <div className="flex flex-wrap items-center gap-3 mb-6 text-gray-300">
          <span className="bg-cyan-500/15 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-mono font-bold border border-cyan-500/30 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            Released: {game.year}
          </span>
          <div className="flex flex-wrap gap-2">
            {game.genres.map((g) => (
              <span key={g} className="bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-cyan-200 border border-cyan-500/30 shadow-sm">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Description Box */}
        <div className="relative p-5 sm:p-7 md:p-8 rounded-2xl md:rounded-3xl border border-cyan-500/20 bg-white/[0.03] backdrop-blur-md shadow-xl overflow-hidden min-h-[140px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none"></div>

          <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 text-cyan-300 flex items-center gap-2.5">
            <span className="w-1.5 h-5 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full shadow-[0_0_8px_#22d3ee]"></span>
            <span>Description</span>
          </h3>
          <p className="text-gray-200 leading-relaxed text-sm sm:text-base md:text-lg font-normal">
            {game.description}
          </p>
        </div>
      </div>
    </div>
  );
}
