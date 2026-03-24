import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStepForward,
  faStepBackward,
  faSnowflake,
} from "@fortawesome/free-solid-svg-icons";

import muaDangRoi from "../assets/audio/MuaDangRoi.mp3";
import imgMuaDangRoi from "../assets/image/muadangroi.jpg";
import mrUBuon from "../assets/audio/MrUBuon.mp3";
import imgMrUBuon from "../assets/image/mrUbuon.jpg";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Data for UI representation
  const playlist = [
    {
      title: "Mr. U buồn",
      url: mrUBuon,
      cover: imgMrUBuon,
    },
    {
      title: "Mưa Đang Rơi",
      url: muaDangRoi,
      cover: imgMuaDangRoi,
    },
  ];

  const currentSong = playlist[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => {
          console.error("Audio auto-play blocked by browser:", e);
          setIsPlaying(false); // Reset UI if browser blocks auto-play
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentSongIndex(
      (prev) => (prev - 1 + playlist.length) % playlist.length,
    );
    setIsPlaying(true);
  };

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

  return (
    <div className="animation music-player-bar relative w-full max-w-[320px] md:max-w-[380px] lg:max-w-[500px] mx-auto mt-4 md:mt-8 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden group hover:border-white/20 transition-all duration-500">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
      />

      <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-4">
        {/* Album Art */}
        <div className="relative shrink-0">
          <div
            className={`absolute inset-0 bg-cyan-400/20 blur-xl rounded-lg transition-opacity duration-500 ${isPlaying ? "opacity-100" : "opacity-0"}`}
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
          <div className="flex items-center gap-2">
            <h4 className="text-cyan-300 font-bold text-sm md:text-lg tracking-wide drop-shadow-[0_0_8px_rgba(103,232,249,0.5)] truncate max-w-[100px] md:max-w-[180px]">
              {currentSong.title}
            </h4>
            <FontAwesomeIcon
              icon={faSnowflake}
              className={`text-white/40 text-[10px] ${isPlaying ? "animate-spin" : ""}`}
              style={{ animationDuration: "3s" }}
            />
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
                className="absolute left-0 top-0 h-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-100 ease-linear"
                style={{ width: `${progressPercent}%` }}
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
            onClick={handlePrev}
            className="text-white/40 hover:text-cyan-300 transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faStepBackward} size="xs" />
          </button>
          <button
            onClick={togglePlay}
            className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size="xs" />
          </button>
          <button
            onClick={handleNext}
            className="text-white/40 hover:text-cyan-300 transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faStepForward} size="xs" />
          </button>
        </div>
      </div>
    </div>
  );
}
