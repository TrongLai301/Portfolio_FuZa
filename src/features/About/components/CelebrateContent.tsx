import { useEffect, useRef, useState } from "react";
import { mockCelebrations } from "../mockData";

const formatDate = (dateStr: string) => {
  // Handle DD-MM-YYYY format
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
    const year = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }
  return dateStr; // Fallback to raw string if parsing fails
};

export default function CelebrateContent() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    // Close when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (gridRef.current && !gridRef.current.contains(e.target as Node)) {
        setSelectedId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCardClick = (id: string) => {
    const isTouch = window.matchMedia("(hover: none)").matches || window.innerWidth < 1024;
    if (isTouch) {
      setSelectedId(selectedId === id ? null : id);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div
        ref={gridRef}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 p-2 md:p-4 pb-10"
      >
        {mockCelebrations.map((photo, index) => {
          const isActive = selectedId === photo.id;
          return (
            <div
              key={photo.id}
              onClick={() => handleCardClick(photo.id)}
              style={{ "--i": `${index * 0.08}s` } as React.CSSProperties}
              className={`celebrate-card fade-in-left delay relative rounded-2xl overflow-hidden aspect-square group cursor-pointer border transition-all duration-500 ${
                isActive
                  ? "shadow-[0_0_20px_rgba(99,102,241,0.5)] border-indigo-500/60 scale-[1.02] z-10"
                  : "border-white/10 shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:border-indigo-500/40 hover:scale-[1.02] hover:z-10"
              }`}
            >
              {/* Photo */}
              <img
                src={photo.imageSrc}
                alt={photo.caption || photo.date}
                className={`w-full h-full object-cover transform transition-transform duration-700 ease-out ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}
                loading="lazy"
              />

              {/* Overlay with date */}
              <div
                className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-400 flex flex-col justify-end p-3 ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <div
                  className={`transition-transform duration-400 ease-out ${
                    isActive ? "translate-y-0" : "translate-y-3 group-hover:translate-y-0"
                  }`}
                >
                  {photo.caption && (
                    <p className="text-white font-bold text-xs md:text-sm truncate drop-shadow-md mb-1">
                      {photo.caption}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-3 h-3 text-indigo-400 shrink-0"
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
                    <span className="text-indigo-200 text-[10px] md:text-xs font-semibold tracking-wide">
                      {formatDate(photo.date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Year badge hidden by default, visible on hover/active if needed */}
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white/70 text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                {photo.date.split("-").pop()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
