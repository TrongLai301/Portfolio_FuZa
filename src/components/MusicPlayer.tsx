import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStepForward,
  faStepBackward,
  faSnowflake,
} from "@fortawesome/free-solid-svg-icons";

import { usePortfolio } from "../commons/PortfolioContext";
import { useMusic } from "../commons/MusicContext";

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "#6366f1");
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "99, 102, 241";
};

export default function MusicPlayer() {
  const { songs, loading, heroSettings } = usePortfolio();
  const { 
    isPlaying, 
    setIsPlaying, 
    currentSongIndex, 
    audioRef, 
    togglePlay, 
    handleNext, 
    handlePrev 
  } = useMusic();
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Map database songs to original playlist format
  const playlist = songs.map(s => ({
    title: s.title,
    artist: s.artist,
    url: s.audio_url,
    cover: s.cover_url
  }));

  const hasSongs = playlist.length > 0;
  const currentSong = hasSongs ? playlist[currentSongIndex] : {
    title: loading ? "Synchronizing..." : "No frequency found",
    artist: loading ? "Universe is connecting..." : "Please configure in Admin",
    url: "",
    cover: ""
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => {
          console.error("Audio auto-play blocked by browser:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex, currentSong.url, audioRef, setIsPlaying]);

  // Phím Enter để play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay]);

  const onNext = () => handleNext(playlist.length);
  const onPrev = () => handlePrev(playlist.length);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      audioRef.current.currentTime = percent * duration;
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  const themeColor = heroSettings?.orbit_animation_color || "#6366f1";
  const themeRgb = hexToRgb(themeColor);

  return (
    <div 
      className="animation music-player-bar relative w-full max-w-[320px] md:max-w-[380px] lg:max-w-[500px] mx-auto mt-4 md:mt-8 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden group hover:border-white/20 transition-all duration-500"
      style={{
        "--theme-color": themeColor,
        "--theme-rgb": themeRgb,
      } as React.CSSProperties}
    >
      <style>{`
        .music-player-btn-hover:hover {
          color: var(--theme-color) !important;
        }
        .music-player-play-btn {
          background-color: rgba(var(--theme-rgb), 0.1);
          border-color: rgba(var(--theme-rgb), 0.3);
          color: var(--theme-color);
          box-shadow: 0 0 15px rgba(var(--theme-rgb), 0.2);
        }
        .music-player-play-btn:hover {
          background-color: var(--theme-color) !important;
          color: white !important;
          box-shadow: 0 0 20px rgba(var(--theme-rgb), 0.4) !important;
        }
      `}</style>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong.url}
        crossOrigin="anonymous"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onNext}
      />

      <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-4">
        {/* Album Art */}
        <div className="relative shrink-0">
          <div
            className={`absolute inset-0 blur-xl rounded-lg transition-opacity duration-500 ${isPlaying ? "opacity-100" : "opacity-0"}`}
            style={{ backgroundColor: `rgba(${themeRgb}, 0.2)` }}
          ></div>
          <img
            src={currentSong.cover}
            alt="Song Cover"
            className={`w-10 h-10 md:w-14 md:h-14 rounded-xl object-cover border border-white/20 relative z-10 transition-transform duration-500 ${isPlaying ? "scale-105" : "scale-100"}`}
          />
        </div>

        {/* Info & Progress */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Title and Metadata Icon */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
                <h4 
                  className="font-bold text-sm md:text-lg tracking-wide truncate max-w-[100px] md:max-w-[180px]"
                  style={{ color: themeColor, textShadow: `0 0 8px rgba(${themeRgb}, 0.5)` }}
                >
                    {currentSong.title}
                </h4>
                <FontAwesomeIcon
                    icon={faSnowflake}
                    className={`text-white/40 text-[10px] ${isPlaying ? "animate-spin" : ""}`}
                    style={{ animationDuration: "3s" }}
                />
            </div>
            {currentSong.artist && (
                <p className="text-white/30 text-[10px] md:text-[12px] font-medium mt-[-2px]">
                    {currentSong.artist}
                </p>
            )}
          </div>

          {/* Time & Progress Bar */}
          <div className="flex items-center gap-3">
            <span className="text-white/60 text-[10px] font-mono tabular-nums min-w-[30px]">
              {formatTime(currentTime)}
            </span>
            <div
              className="flex-1 h-[4px] bg-white/10 rounded-full relative overflow-hidden group/progress cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="absolute left-0 top-0 h-full transition-all duration-100 ease-linear"
                style={{ 
                  width: `${progressPercent}%`,
                  backgroundColor: themeColor,
                  boxShadow: `0 0 8px rgba(${themeRgb}, 0.8)`
                }}
              ></div>
              {/* Hover effect for progress bar */}
              <div className="absolute left-0 top-0 h-full w-full bg-white/20 opacity-0 group-hover/progress:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-white/60 text-[10px] font-mono tabular-nums min-w-[30px]">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 md:gap-4 ml-1 md:ml-2">
          <button
            onClick={onPrev}
            className="text-white/40 music-player-btn-hover transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faStepBackward} size="xs" />
          </button>
          <button
            onClick={togglePlay}
            className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full border transition-all duration-300 music-player-play-btn"
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size="xs" />
          </button>
          <button
            onClick={onNext}
            className="text-white/40 music-player-btn-hover transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faStepForward} size="xs" />
          </button>
        </div>
      </div>
    </div>
  );
}
