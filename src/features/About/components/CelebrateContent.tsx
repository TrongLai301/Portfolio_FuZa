import React, { useEffect, useRef, useState } from "react";
import { type CelebratePhoto } from "../mockData";
import CelebrateDetail from "./CelebrateDetail";
import { celebrationService } from "../../../services/celebrationService";
import dayjs from "dayjs";

const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format("MMMM D, YYYY");
};

export default function CelebrateContent() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<CelebratePhoto | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [celebrations, setCelebrations] = useState<CelebratePhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const data = await celebrationService.getAll();
        const mappedData: CelebratePhoto[] = data.map(item => ({
          id: item.id,
          imageSrc: item.image_url,
          date: item.date,
          caption: item.caption,
          description: item.description
        }));
        setCelebrations(mappedData);
      } catch (error) {
        console.error("Failed to sync memory fragments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
  }, []);

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
        <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-indigo-300/50 text-xs font-mono tracking-widest uppercase animate-pulse">Syncing Archive...</p>
            </div>
        </div>
     );
  }

  if (celebrations.length === 0) {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-8 border border-dashed border-white/10 rounded-[40px] bg-white/2 max-w-sm">
                <p className="text-white/20 text-sm font-medium mb-2">No memory fragments detected in this sector.</p>
                <p className="text-white/10 text-[10px] uppercase tracking-tighter">Initialize database to visualize timeline.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div
        ref={gridRef}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 p-2 md:p-4 pb-10"
      >
        {celebrations.map((photo, index) => {
          const isLoaded = loadedImages[photo.id];
          return (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              style={{ "--i": `${index * 0.08}s` } as React.CSSProperties}
              className="celebrate-card fade-in-left delay relative rounded-2xl overflow-hidden aspect-square group cursor-pointer border border-white/10 shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:border-indigo-500/40 hover:scale-[1.02] hover:z-10 transition-all duration-500"
            >
              {/* Skeleton */}
              {!isLoaded && (
                <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500/80 rounded-full animate-spin"></div>
                </div>
              )}

              {/* Photo */}
              <img
                src={photo.imageSrc}
                alt={photo.caption || photo.date}
                onLoad={() => onImageLoad(photo.id)}
                className={`w-full h-full object-cover transform transition-all duration-700 ease-out ${
                  isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                } group-hover:scale-110`}
                loading="lazy"
              />

              {/* Desktop Preview Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-3">
                <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-400 ease-out text-center">
                  <p className="text-white font-bold text-xs md:text-sm truncate mb-1">
                    {photo.caption}
                  </p>
                  <p className="text-indigo-300 text-[10px] md:text-xs">
                    {formatDate(photo.date)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

