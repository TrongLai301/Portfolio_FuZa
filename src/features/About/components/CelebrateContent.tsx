import React, { useEffect, useRef, useState, useMemo } from "react";
import { type CelebratePhoto } from "../types";
import CelebrateDetail from "./CelebrateDetail";
import { celebrationService } from "../../../services/celebrationService";
import { isVideoUrl } from "../../../utils/mediaOptimizer";
import AutoplayVideo from "../../../components/AutoplayVideo";
import dayjs from "dayjs";

const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format("MMM D, YYYY");
};

// Subtle random rotations for the "sắp xếp lộn xộn" polaroid collage effect
const ROTATIONS = [-3.5, 2.8, -2, 4, -4.5, 2, -1.8, 3.5, -3, 1.8, -2.5, 3];

interface CelebrateContentProps {
  isVisible?: boolean;
}

export default function CelebrateContent({ isVisible = true }: CelebrateContentProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<CelebratePhoto | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [celebrations, setCelebrations] = useState<CelebratePhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const data = await celebrationService.getAll();
        const mappedData: CelebratePhoto[] = (data || []).map((item) => ({
          id: item.id,
          imageSrc: item.image_url,
          date: item.date,
          caption: item.caption,
          description: item.description,
        }));
        setCelebrations(mappedData);
      } catch (error) {
        console.error("[Celebrates] Failed to fetch memories from database:", error);
        setCelebrations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
  }, []);

  // Compute randomized entrance delay for each photo (hiển thị lên từng ảnh ngẫu nhiên)
  const randomDelays = useMemo(() => {
    const n = celebrations.length;
    if (n === 0) return [];
    
    // Create random permutation of indices using Fisher-Yates
    const indices = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Assign randomized staggered delay (120ms - 160ms steps)
    const delays = new Array<number>(n);
    indices.forEach((rank, originalIdx) => {
      delays[originalIdx] = Number((rank * 0.14 + 0.1).toFixed(2));
    });
    return delays;
  }, [celebrations]);

  const onImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  if (selectedPhoto) {
    return (
      <CelebrateDetail 
        photo={selectedPhoto} 
        onBack={() => setSelectedPhoto(null)} 
      />
    );
  }

  if (loading) {
    return (
      <div className="w-full min-h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="text-cyan-300/60 text-xs font-mono tracking-widest uppercase animate-pulse">
            Đang tải dữ liệu từ database...
          </p>
        </div>
      </div>
    );
  }

  if (celebrations.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-hidden p-2 sm:p-4">
      {/* Scattered / Messy Polaroid Scrapbook Layout */}
      <div
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7 md:gap-8 pt-4 pb-12"
      >
        {celebrations.map((photo, index) => {
          const isLoaded = loadedImages[photo.id];
          const isVideo = isVideoUrl(photo.imageSrc);
          const rotationAngle = ROTATIONS[index % ROTATIONS.length];
          const delay = randomDelays[index] ?? (index * 0.1 + 0.1);

          return (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              style={
                {
                  transform: `rotate(${rotationAngle}deg)`,
                  "--rot": `${rotationAngle}deg`,
                  animationDelay: `${delay}s`,
                } as React.CSSProperties
              }
              className={`celebrate-card relative bg-white/10 backdrop-blur-md p-2.5 pb-3.5 rounded-2xl border border-white/20 shadow-xl group cursor-pointer transition-all duration-300 hover:!rotate-0 hover:scale-108 hover:z-30 hover:border-cyan-400/60 hover:shadow-[0_20px_45px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.35)] ${
                isVisible ? "polaroid-animate-pop" : "opacity-0 scale-75"
              }`}
            >
              {/* Decorative Washi Tape effect on top center */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-3 bg-white/25 backdrop-blur-sm border border-white/30 rounded-xs shadow-xs pointer-events-none rotate-[-1deg]" />

              {/* Media Container */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black/50 border border-white/10">
                {!isLoaded && !isVideo && (
                  <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-cyan-500/20 border-t-cyan-500/80 rounded-full animate-spin"></div>
                  </div>
                )}

                {isVideo ? (
                  <AutoplayVideo
                    src={photo.imageSrc}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  <img
                    src={photo.imageSrc}
                    alt={photo.caption || photo.date}
                    onLoad={() => onImageLoad(photo.id)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                )}

                {/* Subtle Live Badge for Videos */}
                {isVideo && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/20 text-[9px] font-mono text-cyan-300 font-bold uppercase">
                    LOOP
                  </div>
                )}
              </div>

              {/* Polaroid Bottom Label (Handwritten feel) */}
              <div className="pt-2.5 px-1 text-center">
                <div
                  className="text-white font-bold truncate drop-shadow-sm transition-colors group-hover:text-cyan-200"
                  style={{
                    fontFamily: "var(--font-signature, 'Caveat', cursive)",
                    fontSize: "18px",
                    lineHeight: "1.2",
                  }}
                >
                  {photo.caption || "Unforgettable Memory"}
                </div>
                <div className="text-[10px] text-gray-400 font-mono tracking-tight mt-0.5">
                  {formatDate(photo.date)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
