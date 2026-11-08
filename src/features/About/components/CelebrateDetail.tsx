import dayjs from "dayjs";
import type { CelebratePhoto } from "../types";
import { isVideoUrl } from "../../../utils/mediaOptimizer";
import AutoplayVideo from "../../../components/AutoplayVideo";

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
  const isVideo = isVideoUrl(photo.imageSrc);

  return (
    <div className="fade-in-up w-full min-h-[500px] p-4 sm:p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 rounded-3xl border border-cyan-500/25 bg-[#0a0f1d]/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)]">
      {/* Left: Full Image / Video (Priority) */}
      <div className="w-full md:w-[58%] shrink-0 flex items-center justify-center p-1 sm:p-2">
        <div className="relative group w-full h-full flex items-center justify-center">
          {isVideo ? (
            <AutoplayVideo
              src={photo.imageSrc}
              className="w-full h-auto max-h-[380px] md:max-h-[560px] rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] object-contain border border-white/10"
            />
          ) : (
            <img
              src={photo.imageSrc}
              alt={photo.caption}
              className="w-full h-auto max-h-[380px] md:max-h-[560px] rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] object-contain border border-white/10"
            />
          )}
          {/* Subtle cosmic glow behind image */}
          <div className="absolute -inset-4 bg-cyan-500/15 blur-3xl -z-10 rounded-full pointer-events-none"></div>
        </div>
      </div>

      {/* Right: Info column */}
      <div className="w-full md:w-[42%] flex flex-col justify-start">
        {/* Back Button with subtle cyan glow */}
        <button
          onClick={onBack}
          className="mb-5 self-start px-4 sm:px-5 py-2 sm:py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 rounded-xl transition-all duration-300 border border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-center gap-2.5 text-xs sm:text-sm font-semibold group cursor-pointer"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">
            &larr;
          </span>
          <span>Back to List</span>
        </button>

        <div className="mb-4 sm:mb-6">
          {/* Memory Highlight Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/15 border border-cyan-500/30 rounded-full text-cyan-300 text-[10px] font-mono font-bold tracking-widest uppercase mb-3 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22d3ee]"></span>
            Memory Highlight
          </div>

          {/* Title with drop shadow */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
            {photo.caption}
          </h2>

          {/* Captured On Date Badge */}
          <div className="flex items-center gap-3 text-gray-300 text-sm sm:text-base mb-6">
            <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400"
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
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-cyan-400/80">
                Captured On
              </span>
              <span className="font-semibold text-gray-100">
                {formatDate(photo.date)}
              </span>
            </div>
          </div>
        </div>

        {/* The Story Box */}
        <div className="relative p-5 sm:p-7 md:p-8 rounded-2xl md:rounded-3xl border border-cyan-500/20 bg-white/[0.03] backdrop-blur-md shadow-xl overflow-hidden min-h-[140px]">
          {/* Subtle cyan glow inside the card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none"></div>

          <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 text-cyan-300 flex items-center gap-2.5">
            <span className="w-1.5 h-5 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full shadow-[0_0_8px_#22d3ee]"></span>
            <span>The Story</span>
          </h3>
          <p className="text-gray-200 leading-relaxed text-sm sm:text-base md:text-lg font-normal">
            {photo.description ||
              "Every photo tells a story of a moment captured in time, preserving emotions and memories that define our journey."}
          </p>
        </div>
      </div>
    </div>
  );
}
