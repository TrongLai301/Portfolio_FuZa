import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as BrandIcons from "@fortawesome/free-brands-svg-icons";
import * as SolidIcons from "@fortawesome/free-solid-svg-icons";
import AudioVisualizer from "./AudioVisualizer";
import nilou from "../assets/image/commons/nilouPr4.png";
import type { Skill } from "../services/skillService";

// Helper to resolve FontAwesome icon from string name
const getSkillIcon = (iconName: string) => {
  return (
    (BrandIcons as any)[iconName] ||
    (SolidIcons as any)[iconName] ||
    SolidIcons.faCircleQuestion
  );
};

export interface CosmicPlanetarySystemProps {
  avatarUrl?: string;
  glowColor?: string;
  isPlayingMusic?: boolean;
  isVideoPlaying?: boolean;
  onToggleVideo?: () => void;
  skills?: Skill[];
  isEntered?: boolean;
}

// 4 Concentric Orbital Tracks (Scaled relative to central star)
interface OrbitTrackDef {
  id: number;
  baseA: number; // semi-major axis (width radius)
  baseB: number; // semi-minor axis (height radius, tilted ~65 deg)
  period: number; // seconds for full 360 revolution
  color: string;
  dash: string;
}

const ORBIT_TRACKS: OrbitTrackDef[] = [
  { id: 0, baseA: 145, baseB: 64, period: 18, color: "rgba(56, 189, 248, 0.40)", dash: "3 6" },
  { id: 1, baseA: 195, baseB: 86, period: 26, color: "rgba(129, 140, 248, 0.35)", dash: "4 8" },
  { id: 2, baseA: 248, baseB: 110, period: 36, color: "rgba(192, 132, 252, 0.30)", dash: "3 7" },
  { id: 3, baseA: 300, baseB: 134, period: 48, color: "rgba(56, 189, 248, 0.25)", dash: "5 10" },
];

// Tilt angle in degrees matching isometric planetary perspective (-15 deg)
const TILT_ANGLE_DEG = -15;
const TILT_RAD = (TILT_ANGLE_DEG * Math.PI) / 180;

export const CosmicPlanetarySystem: React.FC<CosmicPlanetarySystemProps> = ({
  avatarUrl,
  glowColor = "#38bdf8",
  isPlayingMusic = false,
  isVideoPlaying = true,
  onToggleVideo,
  skills = [],
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 560, height: 420, scale: 1 });
  const [hoveredPlanetId, setHoveredPlanetId] = useState<string | null>(null);
  const [isHoveringStar, setIsHoveringStar] = useState(false);

  // Time tracking for smooth 60fps orbital revolution
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  // Evenly distribute satellites around the 360-degree orbit tracks
  const angleOffsetsRef = useRef<number[]>([15, 105, 195, 285, 60, 240]);
  const [, setRerenderTrigger] = useState(0);

  // Responsive scale factor based on screen & container width
  const updateDimensions = useCallback(() => {
    if (typeof window === "undefined") return;
    const w = window.innerWidth;
    let scale = 1;
    let width = 560;
    let height = 400;

    if (w < 480) {
      scale = 0.58;
      width = 330;
      height = 270;
    } else if (w < 640) {
      scale = 0.68;
      width = 380;
      height = 300;
    } else if (w < 768) {
      scale = 0.78;
      width = 440;
      height = 340;
    } else if (w < 1024) {
      scale = 0.88;
      width = 500;
      height = 370;
    } else {
      scale = 1.0;
      width = 560;
      height = 410;
    }

    setDimensions({ width, height, scale });
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  // Animation Loop: Updates orbital angles at physical time
  useEffect(() => {
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - lastTimeRef.current) / 1000); // delta in seconds
      lastTimeRef.current = now;

      // Slow down orbital speed if user hovers on a planet
      const speedMultiplier = hoveredPlanetId ? 0.2 : 1.0;

      angleOffsetsRef.current = angleOffsetsRef.current.map((angle, idx) => {
        const track = ORBIT_TRACKS[idx % ORBIT_TRACKS.length];
        const degPerSec = (360 / track.period) * speedMultiplier;
        return (angle + degPerSec * dt) % 360;
      });

      setRerenderTrigger((prev) => (prev + 1) % 1000000);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [hoveredPlanetId]);

  // Fallback skills if none are loaded from database yet
  const displaySkills: Skill[] = useMemo(() => {
    if (skills && skills.length >= 4) {
      return skills.slice(0, 6);
    }
    const defaultList: Skill[] = [
      { id: "s-react", name: "React", icon_name: "faReact", color_code: "#38bdf8", display_order: 1 },
      { id: "s-js", name: "JavaScript", icon_name: "faJs", color_code: "#facc15", display_order: 2 },
      { id: "s-html", name: "HTML5", icon_name: "faHtml5", color_code: "#f97316", display_order: 3 },
      { id: "s-git", name: "GitLab", icon_name: "faGitlab", color_code: "#ec4899", display_order: 4 },
      { id: "s-css", name: "CSS3", icon_name: "faCss3Alt", color_code: "#818cf8", display_order: 5 },
      { id: "s-github", name: "GitHub", icon_name: "faGithub", color_code: "#a855f7", display_order: 6 },
    ];
    // Merge provided skills with defaults
    return [...skills, ...defaultList.filter(d => !skills.some(s => s.name.toLowerCase() === d.name.toLowerCase()))].slice(0, 5);
  }, [skills]);

  // Center coordinates
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const avtSize = Math.round(180 * dimensions.scale);

  // Decorative Cosmic Stardust / Stars positions
  const cosmicStars = useMemo(() => {
    return [
      { x: centerX - 220 * dimensions.scale, y: centerY - 110 * dimensions.scale, size: 2.5, opacity: 0.8 },
      { x: centerX + 210 * dimensions.scale, y: centerY - 80 * dimensions.scale, size: 3, opacity: 0.9 },
      { x: centerX - 160 * dimensions.scale, y: centerY + 100 * dimensions.scale, size: 2, opacity: 0.7 },
      { x: centerX + 180 * dimensions.scale, y: centerY + 90 * dimensions.scale, size: 3.5, opacity: 0.85 },
      { x: centerX - 90 * dimensions.scale, y: centerY - 130 * dimensions.scale, size: 2, opacity: 0.6 },
      { x: centerX + 110 * dimensions.scale, y: centerY + 120 * dimensions.scale, size: 2, opacity: 0.75 },
    ];
  }, [centerX, centerY, dimensions.scale]);

  return (
    <div
      ref={containerRef}
      className="relative select-none flex items-center justify-center mx-auto"
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        maxWidth: "100%",
      }}
    >
      {/* 1. SVG Layer for Tilted Planetary Orbits & Tracks */}
      <svg
        className="absolute inset-0 pointer-events-none w-full h-full overflow-visible"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      >
        <defs>
          <radialGradient id="centerStarAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={glowColor} stopOpacity="0.4" />
            <stop offset="60%" stopColor={glowColor} stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Cosmic Aura around Sun */}
        <circle
          cx={centerX}
          cy={centerY}
          r={avtSize * 0.9}
          fill="url(#centerStarAura)"
        />

        {/* Concentric Tilted Elliptical Tracks (Matching Solar System reference) */}
        {ORBIT_TRACKS.map((track) => {
          const rx = track.baseA * dimensions.scale;
          const ry = track.baseB * dimensions.scale;

          return (
            <g key={track.id}>
              {/* Outer soft glow track */}
              <ellipse
                cx={centerX}
                cy={centerY}
                rx={rx}
                ry={ry}
                transform={`rotate(${TILT_ANGLE_DEG}, ${centerX}, ${centerY})`}
                fill="none"
                stroke={track.color}
                strokeWidth={1}
                strokeDasharray={track.dash}
                opacity={0.65}
              />
              {/* Subtle inner solid trace line */}
              <ellipse
                cx={centerX}
                cy={centerY}
                rx={rx}
                ry={ry}
                transform={`rotate(${TILT_ANGLE_DEG}, ${centerX}, ${centerY})`}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth={0.7}
              />
            </g>
          );
        })}

        {/* Distant Cosmic Star Sparkles along the galaxy plane */}
        {cosmicStars.map((star, i) => (
          <g key={i}>
            <circle
              cx={star.x}
              cy={star.y}
              r={star.size}
              fill="#ffffff"
              opacity={star.opacity}
              filter="url(#glowFilter)"
            />
            {/* 4-point twinkle sparkle on brighter stars */}
            {star.size >= 3 && (
              <path
                d={`M ${star.x - 5} ${star.y} L ${star.x + 5} ${star.y} M ${star.x} ${star.y - 5} L ${star.x} ${star.y + 5}`}
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth={0.8}
              />
            )}
          </g>
        ))}
      </svg>

      {/* 2. Central Celestial Star (The Sun / Avatar Profile) */}
      <div
        className="absolute rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer group"
        style={{
          width: `${avtSize}px`,
          height: `${avtSize}px`,
          left: `${centerX}px`,
          top: `${centerY}px`,
          transform: "translate(-50%, -50%)",
          zIndex: 15, // Mid-level z-index: front planets pass over (z=25), back planets pass behind (z=5)
          boxShadow: `0 0 35px 8px ${glowColor}66, inset 0 0 20px rgba(255,255,255,0.25)`,
        }}
        onMouseEnter={() => setIsHoveringStar(true)}
        onMouseLeave={() => setIsHoveringStar(false)}
        onClick={onToggleVideo}
        title="Click to toggle background video"
      >
        {/* Audio Visualizer Ring pulsing around Star */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <AudioVisualizer
            size={avtSize}
            isPlaying={isPlayingMusic}
            color={glowColor}
          />
        </div>

        {/* Inner Avatar Image */}
        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/30">
          <img
            src={avatarUrl || nilou}
            alt="Core Avatar"
            className="w-full h-full object-cover select-none pointer-events-none"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== nilou) target.src = nilou;
            }}
          />

          {/* Video Play / Pause Action Overlay */}
          <div
            className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center ${
              isHoveringStar ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 border border-white/40 flex items-center justify-center backdrop-blur-md shadow-2xl transition-transform transform hover:scale-110 active:scale-95">
              <FontAwesomeIcon
                icon={isVideoPlaying ? SolidIcons.faPause : SolidIcons.faPlay}
                className={`text-xl md:text-2xl text-white ${isVideoPlaying ? "" : "ml-1"}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Orbiting Planetary Satellites (Skills) */}
      {displaySkills.map((skill, index) => {
        const track = ORBIT_TRACKS[index % ORBIT_TRACKS.length];
        const angle = angleOffsetsRef.current[index] ?? (index * 72);

        // Parametric Ellipse Point
        const rad = (angle * Math.PI) / 180;
        const rx = track.baseA * dimensions.scale * Math.cos(rad);
        const ry = track.baseB * dimensions.scale * Math.sin(rad);

        // Rotate by inclination angle (-15 deg)
        const posX = centerX + rx * Math.cos(TILT_RAD) - ry * Math.sin(TILT_RAD);
        const posY = centerY + rx * Math.sin(TILT_RAD) + ry * Math.cos(TILT_RAD);

        // True 3D Depth Sorting:
        // sin(rad) > 0 means the planet is in the FRONT half of the orbit (in front of avatar)
        // sin(rad) < 0 means the planet is in the BACK half of the orbit (behind avatar)
        const sinVal = Math.sin(rad);
        const isFront = sinVal >= 0;
        const zIndex = isFront ? 25 : 5;
        const depthScale = 0.9 + sinVal * 0.18; // 0.72x at farthest back, 1.08x at closest front
        const depthOpacity = isFront ? 1.0 : 0.65 + (1 + sinVal) * 0.25;

        const isHovered = hoveredPlanetId === skill.id;
        const skillColor = skill.color_code || track.color || "#38bdf8";
        const planetSize = Math.round((46 * dimensions.scale));

        return (
          <div
            key={skill.id}
            className="absolute transition-transform duration-75 cursor-pointer group"
            style={{
              left: `${posX}px`,
              top: `${posY}px`,
              transform: `translate(-50%, -50%) scale(${isHovered ? 1.25 : depthScale})`,
              zIndex: isHovered ? 50 : zIndex,
              opacity: depthOpacity,
            }}
            onMouseEnter={() => setHoveredPlanetId(skill.id)}
            onMouseLeave={() => setHoveredPlanetId(null)}
            onClick={onToggleVideo}
            title={`${skill.name} • Click to toggle video`}
          >
            {/* Spherical Celestial Planet Body */}
            <div
              className="relative rounded-full flex items-center justify-center transition-all duration-300 shadow-xl"
              style={{
                width: `${planetSize}px`,
                height: `${planetSize}px`,
                background: `radial-gradient(circle at 35% 30%, ${skillColor}44 0%, rgba(15, 23, 42, 0.95) 75%)`,
                border: `1.5px solid ${isHovered ? "#ffffff" : `${skillColor}88`}`,
                boxShadow: isHovered
                  ? `0 0 25px 5px ${skillColor}, 0 0 10px #ffffff`
                  : `0 0 16px ${skillColor}66, inset 0 0 8px ${skillColor}44`,
                backdropFilter: "blur(4px)",
              }}
            >
              {/* Planetary Atmospheric Rim Lighting */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  boxShadow: `inset -2px -2px 6px rgba(0, 0, 0, 0.8), inset 2px 2px 5px ${skillColor}88`,
                }}
              />

              {/* Centered Skill Icon (Kept upright facing viewer) */}
              <FontAwesomeIcon
                icon={getSkillIcon(skill.icon_name)}
                className="transition-transform duration-300 group-hover:scale-110"
                style={{
                  color: isHovered ? "#ffffff" : skillColor,
                  fontSize: `${Math.round(planetSize * 0.48)}px`,
                  filter: `drop-shadow(0 0 6px ${skillColor})`,
                }}
              />

              {/* Tiny Orbiting Moon Particle for extra cosmic detail */}
              {index % 2 === 0 && (
                <div
                  className="absolute w-1.5 h-1.5 rounded-full bg-cyan-200 shadow-[0_0_5px_#22d3ee] pointer-events-none"
                  style={{
                    top: "-3px",
                    right: "-2px",
                  }}
                />
              )}
            </div>

            {/* Chic Glassmorphic Floating Tooltip Badge on Hover */}
            {isHovered && (
              <div
                className="absolute left-1/2 -top-9 -translate-x-1/2 px-2.5 py-1 rounded-full bg-black/85 border border-cyan-400/50 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.4)] whitespace-nowrap pointer-events-none z-50 flex items-center gap-1.5 animate-fadeIn"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-ping"
                  style={{ backgroundColor: skillColor }}
                />
                <span className="text-[11px] font-bold text-white font-mono tracking-wide">
                  {skill.name}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CosmicPlanetarySystem;

