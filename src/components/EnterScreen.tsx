import { useRef } from "react";
import { useEnter } from "../commons/useEnterContext";
import { usePortfolio } from "../commons/PortfolioContext";
import { useMusic } from "../commons/MusicContext";

export default function EnterScreen() {
  const { isEntered, enter } = useEnter();
  const { loading } = usePortfolio();
  const { setIsPlaying } = useMusic();
  const hasEnteredRef = useRef(false);

  const handleEnter = () => {
    if (loading || hasEnteredRef.current) return;
    hasEnteredRef.current = true;
    setIsPlaying(true);
    enter();
  };

  if (isEntered) return null;

  return (
    <div
      className={`fixed inset-0 z-9999 flex items-center justify-center transition-opacity duration-1000 ${loading ? "cursor-wait" : "cursor-pointer"}`}
      onClick={handleEnter}
      onTouchEnd={handleEnter}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity"></div>

      {/* Nội dung chính: Loading hoặc Click Icon */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {loading ? (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-1000">
            <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-white/40 text-xs tracking-[0.3em] uppercase animate-pulse">
              Synchronizing Systems...
            </span>
          </div>
        ) : (
          <span
            style={{
              animation: "fadeInUp 1s ease-out forwards, pulse 2s infinite 1s",
              opacity: 0,
            }}
            className="text-white text-3xl font-bold tracking-[0.2em] drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
          >
            Click to enter...
          </span>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
