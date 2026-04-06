import React, { createContext, useContext, useState, useRef, useEffect } from "react";

interface MusicContextType {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentSongIndex: number;
  setCurrentSongIndex: (index: number) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  analyser: AnalyserNode | null;
  togglePlay: () => void;
  handleNext: (songsLength: number) => void;
  handlePrev: (songsLength: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Initialize AudioContext and Analyser only once when played
  useEffect(() => {
    if (isPlaying && !audioContextRef.current && audioRef.current) {
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const context = new AudioContextClass();
            const newAnalyser = context.createAnalyser();
            newAnalyser.fftSize = 256; // High frequency detail
            
            const source = context.createMediaElementSource(audioRef.current);
            source.connect(newAnalyser);
            newAnalyser.connect(context.destination);
            
            audioContextRef.current = context;
            sourceRef.current = source;
            setAnalyser(newAnalyser);
        } catch (e) {
            console.error("Audio Context initialization failed:", e);
        }
    }
    
    // Resume context if suspended (browser requirement)
    if (isPlaying && audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = (songsLength: number) => {
    if (songsLength === 0) return;
    setCurrentSongIndex((prev) => (prev + 1) % songsLength);
    setIsPlaying(true);
  };

  const handlePrev = (songsLength: number) => {
    if (songsLength === 0) return;
    setCurrentSongIndex((prev) => (prev - 1 + songsLength) % songsLength);
    setIsPlaying(true);
  };

  return (
    <MusicContext.Provider value={{
      isPlaying,
      setIsPlaying,
      currentSongIndex,
      setCurrentSongIndex,
      audioRef,
      analyser,
      togglePlay,
      handleNext,
      handlePrev
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};
