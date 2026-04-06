import { forwardRef, useEffect, useRef, useState } from "react";
import "../assets/css/home.css";
import TypeIt from "typeit-react";

import * as BrandIcons from "@fortawesome/free-brands-svg-icons";
import * as SolidIcons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SocialIcon from "../components/SocialIcon";
import OrbitIcon from "../components/OrbitIcon";
import MusicPlayer from "../components/MusicPlayer";
import AudioVisualizer from "../components/AudioVisualizer";
import nilou from "../assets/image/commons/nilouPr4.png";
import { useEnter } from "../commons/useEnterContext";
import { usePortfolio } from "../commons/PortfolioContext";
import { useMusic } from "../commons/MusicContext";
import type { Skill } from "../services/skillService";
import { hitVisitCount } from "../services/visitorApi";

// Helper to get FA icon by string name
const getIcon = (iconName: string) => {
  return (
    (BrandIcons as any)[iconName] ||
    (SolidIcons as any)[iconName] ||
    SolidIcons.faCircleQuestion
  );
};

const Home = forwardRef<HTMLDivElement>((_, ref) => {
  const { isEntered } = useEnter();
  const {
    skills: allSkills,
    socialLinks: allSocialLinks,
    heroSettings,
    typewriterTexts,
    isVideoPlaying,
    toggleVideo,
  } = usePortfolio();
  const { isPlaying } = useMusic();
  const animationLeft = useRef<HTMLDivElement | null>(null);
  const animationRight = useRef<HTMLDivElement | null>(null);
  const [orbitRadius, setOrbitRadius] = useState(
    window.innerWidth < 768 ? 100 : window.innerWidth < 1024 ? 130 : 180,
  );
  const [avtSize, setAvtSize] = useState(
    window.innerWidth < 481 ? 150 : window.innerWidth < 769 ? 180 : window.innerWidth < 1025 ? 190 : 240
  );
  const [visitorCount, setVisitorCount] = useState(0);
  const [orbitSkills, setOrbitSkills] = useState<Skill[]>([]);
  const [isHoveringOrbit, setIsHoveringOrbit] = useState(false);

  useEffect(() => {
    if (!isEntered) return;

    // Record visit
    hitVisitCount().then((count) => setVisitorCount(count));

    // Select 4 random skills from context data
    if (allSkills.length > 0) {
      const shuffled = [...allSkills].sort(() => 0.5 - Math.random());
      setOrbitSkills(shuffled.slice(0, 4));
    }

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOrbitRadius(100);
        setAvtSize(180);
      } else if (window.innerWidth < 1024) {
        setOrbitRadius(130);
        setAvtSize(190);
      } else {
        setOrbitRadius(180);
        setAvtSize(240);
      }
      
      if (window.innerWidth < 481) setAvtSize(150);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isEntered, allSkills]);

  async function animation(
    element: Element | null | undefined,
    delay: number | null,
    animation: string,
    isRemove: boolean,
  ): Promise<void> {
    if (element instanceof Element) {
      element.classList.add(animation);
      if (delay != null) {
        (element as HTMLElement).style.setProperty("--i", `${delay}s`);
        element.classList.add("delay");
      }
      if (isRemove) {
        await new Promise<void>((resolve) => {
          const handleEnd = () => {
            element.classList.add("opacity-100");
            element.classList.remove(animation);
            if (delay != null) element.classList.remove("delay");
            element.removeEventListener("animationend", handleEnd);
            resolve();
          };
          element.addEventListener("animationend", handleEnd);
        });
      }
    }
  }

  async function handleMouseenter(
    element: Element | null | undefined,
  ): Promise<void> {
    if (!(element instanceof Element)) return;
    element.addEventListener("mouseenter", () => {
      element.classList.add("paused");
    });
    element.addEventListener("mouseleave", () => {
      element.classList.remove("paused");
    });
  }
  useEffect(() => {
    if (!isEntered) return;

    const leftdiv = animationLeft.current?.querySelectorAll(".animation");
    leftdiv?.forEach((box, index) => {
      if (box.classList.contains("animation-up-left")) {
        animation(box, null, "fade-in-up-left", true);
      } else {
        animation(box, index * 0.1, "fade-in-up", true);
      }
    });
    const avt = animationRight.current?.querySelector("#animatedAvatarWrapper");
    animation(avt, null, "fade-in-right-centered", true).then(() => {
      animation(avt, null, "animation-up-down-blink-centered", false);
    });
    handleMouseenter(avt);

    const musicPlayer =
      animationRight.current?.querySelector(".music-player-bar");
    if (musicPlayer) {
      animation(musicPlayer, 0.8, "fade-in-up", true);
    }
  }, [isEntered]);

  // New Effect: Animate social links specifically when they are loaded
  useEffect(() => {
    if (allSocialLinks.length > 0 && animationLeft.current) {
      // Find all social icons within the left container
      const icons = animationLeft.current.querySelectorAll(".contact-icon");
      icons.forEach((icon, index) => {
        // Only animate if not already animated
        if (
          !icon.classList.contains("fade-in-up") &&
          !icon.classList.contains("opacity-100")
        ) {
          animation(icon, index * 0.1, "fade-in-up", true);
        }
      });
    }
  }, [allSocialLinks]);

  // New Effect: Animate orbit items specifically when they are loaded
  useEffect(() => {
    if (orbitSkills.length > 0 && animationRight.current) {
      const orbits = animationRight.current.querySelectorAll(".orbit-item");
      orbits.forEach((orbit, index) => {
        if (
          !orbit.classList.contains("fade-in-up") &&
          !orbit.classList.contains("opacity-100")
        ) {
          animation(orbit, index * 0.1, "fade-in-up", true).then(() => {
            animation(orbit, index * 0.2, "animation-up-down", false);
          });
          handleMouseenter(orbit);
        }
      });
    }
  }, [orbitSkills]);

  // Helper to determine if a string is a color or gradient and return styles
  const getTextStyle = (colorStr?: string) => {
    if (!colorStr) return {};
    const isGradient = colorStr.includes("gradient");
    if (isGradient) {
      return {
        background: colorStr,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        display: "inline-block",
      };
    }
    return { color: colorStr };
  };

  return (
    <section className="snap-start" id="home" ref={ref}>
      <div
        className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-0"
        style={{ minHeight: "90vh" }}
      >
        {/* Left: Text content */}
        <div
          className="w-full md:w-2/5 text-center md:text-left px-4 md:px-0"
          ref={animationLeft}
        >
          <div className="animation animation-up-left flex items-center justify-center md:justify-start">
            <span className="main-text">
              <span
                className="text-secondary-1"
                style={getTextStyle(heroSettings?.main_text_prefix_color)}
              >
                {heroSettings?.main_text_prefix || "Hello,"}
              </span>
              <span
                className="text-secondary-2"
                style={{
                  ...getTextStyle(heroSettings?.main_text_suffix_color),
                  marginLeft: "8px",
                }}
              >
                {heroSettings?.main_text_suffix || "I'm FuZa"}
              </span>
            </span>
          </div>
          <div className="animation typewriter mb-8 ">
            {typewriterTexts.length > 0 ? (
              <TypeIt
                key={typewriterTexts
                  .map((t) => `${t.content}-${t.content_color}`)
                  .join(",")}
                options={{ loop: true, html: true }}
                getBeforeInit={(instance) => {
                  typewriterTexts.forEach((text) => {
                    const coloredContent = `<span style="color: ${text.content_color || "#6366f1"}">${text.content}</span>`;
                    instance
                      .type(coloredContent)
                      .pause(2500)
                      .delete()
                      .pause(800);
                  });
                  return instance;
                }}
              />
            ) : (
              <TypeIt
                options={{ loop: true }}
                getBeforeInit={(instance) => {
                  instance
                    .type("Web-Developer")
                    .pause(2500)
                    .delete()
                    .pause(800)
                    .type("Full-stack")
                    .pause(2500)
                    .delete()
                    .pause(800)
                    .type("Love Anime")
                    .pause(2500);

                  return instance;
                }}
              />
            )}
          </div>
          <div className="animation mb-6">
            <span className="text-xs md:text-sm lg:text-base">
              {heroSettings?.description ||
                "A passionate developer who loves building modern and responsive web applications using React, Java, and JavaScript."}
            </span>
          </div>
          <div className="flex gap-2 md:gap-3 lg:gap-4 items-center justify-center md:justify-start flex-wrap">
            <span className="animation text-xs md:text-sm lg:text-base whitespace-nowrap">
              Follow me:
            </span>
            {allSocialLinks.map((link) => (
              <SocialIcon
                key={link.id}
                to={link.url}
                icon={getIcon(link.icon_name)}
                color={link.color_code || undefined}
              />
            ))}
          </div>
        </div>
        {/* Right: Avatar + Music Player */}
        <div className="w-full md:w-3/5" ref={animationRight}>
          <div 
            className="orbit-container"
            onMouseEnter={() => setIsHoveringOrbit(true)}
            onMouseLeave={() => setIsHoveringOrbit(false)}
          >
            {/* Wrapper for both Avt and Visualizer to move together */}
            <div 
              id="animatedAvatarWrapper" 
              className="absolute rounded-full animation opacity-0"
              style={{ 
                width: avtSize, 
                height: avtSize,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                opacity: 0,
                boxShadow: `0 0 20px 20px ${heroSettings?.orbit_animation_color || "#c8c8c8"}`,
              }}
            >
                <AudioVisualizer 
                  size={avtSize} 
                  isPlaying={isPlaying} 
                  color={heroSettings?.orbit_animation_color || "#6366f1"}
                />
                <div
                  id="bigAvt"
                  className="absolute z-10 w-full h-full rounded-full overflow-hidden"
                >
                  <img
                    src={heroSettings?.orbit_image_url || nilou}
                    alt="FuZa..."
                    className="w-full h-full object-cover"
                  />

                  {/* Video Play/Pause Overlay */}
                  <div 
                    className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center cursor-pointer ${isHoveringOrbit ? 'opacity-100' : 'opacity-0'}`}
                    onClick={toggleVideo}
                  >
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md shadow-lg transform transition-transform hover:scale-110 active:scale-95">
                      <FontAwesomeIcon
                        icon={isVideoPlaying ? SolidIcons.faPause : SolidIcons.faPlay}
                        className={`text-2xl text-white/90 ${isVideoPlaying ? '' : 'ml-1'}`}
                      />
                    </div>
                  </div>
                </div>
            </div>
            {orbitSkills.map((skill, index, arr) => (
              <OrbitIcon
                key={skill.id}
                icon={getIcon(skill.icon_name)}
                angle={(index * 360) / arr.length - 45}
                radius={orbitRadius}
                color={skill.color_code || undefined}
              />
            ))}
          </div>
          <div className="relative w-full max-w-[320px] md:max-w-[380px] lg:max-w-[500px] mx-auto mt-4 md:mt-8">
            {/* Floating Visitor Count Badge with entrance animation */}
            {visitorCount > 0 && (
              <div className="absolute -top-3 right-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] animate-visitor-entrance">
                <FontAwesomeIcon
                  icon={SolidIcons.faEye}
                  className="text-[10px]"
                  style={{ color: heroSettings?.orbit_animation_color || "#6366f1" }}
                />
                <span className="text-white/90 text-xs font-bold font-mono tracking-tight">
                  {visitorCount.toLocaleString()}
                </span>
              </div>
            )}
            <MusicPlayer />

            <style>{`
               @keyframes visitorEntrance {
                 from { opacity: 0; transform: translateY(12px); }
                 to { opacity: 1; transform: translateY(0); }
               }
               .animate-visitor-entrance {
                 animation: visitorEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                 animation-delay: 1.2s;
                 opacity: 0;
               }
               
               /* Override animation color based on DB setting */
               @keyframes animationUpDownBlinkCentered {
                 0% {
                   box-shadow: 0 0 20px 20px ${heroSettings?.orbit_animation_color || "#c8c8c8"};
                   transform: translate(-50%, -50%);
                 }
                 100% {
                   box-shadow: 0 0 20px 0 ${heroSettings?.orbit_animation_color || "#c8c8c8"};
                   transform: translate(-50%, calc(-50% + 10px));
                 }
               }
             `}</style>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Home;
