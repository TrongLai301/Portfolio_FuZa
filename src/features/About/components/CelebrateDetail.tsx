import dayjs from "dayjs";
import type { CelebratePhoto } from "../mockData";

interface CelebrateDetailProps {
  photo: CelebratePhoto;
  onBack: () => void;
}

const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format("MMMM D, YYYY");
};

export default function CelebrateDetail({
  photo,
  onBack,
}: CelebrateDetailProps) {
  return (
    <div className="fade-in-up w-full h-full p-4 md:p-8 flex flex-col md:flex-row gap-8 overflow-y-auto custom-scrollbar bg-linear-to-br from-[#0f1428] via-[#151b36] to-[#0f1428]">
      {/* Left: Full Image (Priority) */}
      <div className="w-full md:w-[60%] shrink-0 flex items-center justify-center p-2">
        <div className="relative group w-full h-full flex items-center justify-center">
          <img
            src={photo.imageSrc}
            alt={photo.caption}
            className="w-full h-auto max-h-[400px] md:max-h-[600px] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] object-contain border border-white/10"
          />
          {/* Subtle glow behind image */}
          <div className="absolute -inset-4 bg-indigo-500/10 blur-3xl -z-10 rounded-full"></div>
        </div>
      </div>

      {/* Right: Info column */}
      <div className="w-full md:w-[40%] flex flex-col justify-start">
        <button
          onClick={onBack}
          className="mb-8 self-start px-5 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-xl transition-all duration-300 border border-indigo-500/30 shadow-lg flex items-center gap-3 text-sm font-semibold group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">
            &larr;
          </span>
          <span>Back to List</span>
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-400 text-[10px] font-bold tracking-widest uppercase mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            Memory Highlight
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight drop-shadow-2xl">
            {photo.caption}
          </h2>

          <div className="flex items-center gap-3 text-gray-400 text-base mb-8">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <svg
                className="w-5 h-5 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-tighter text-indigo-500/70">
                Captured On
              </span>
              <span className="font-semibold text-gray-200">
                {formatDate(photo.date)}
              </span>
            </div>
          </div>
        </div>

        <div className="relative mt-2 p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl overflow-hidden min-h-[150px]">
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full"></div>

          <h3 className="text-lg md:text-xl font-bold mb-4 text-indigo-300 flex items-center gap-2">
            <span className="w-1 h-5 bg-indigo-500 rounded-full"></span>
            The Story
          </h3>
          <p className="text-gray-300 leading-relaxed text-base md:text-lg text-justify font-medium">
            {photo.description ||
              "Every photo tells a story of a moment captured in time, preserving emotions and memories that define our journey."}
          </p>
        </div>

        <div className="mt-auto pt-8 flex items-center justify-between text-[11px] text-gray-500 font-mono tracking-widest uppercase opacity-40">
          <span>{photo.id} • FUZA_ARCHIVE</span>
          <span>© 2026</span>
        </div>
      </div>
    </div>
  );
}
