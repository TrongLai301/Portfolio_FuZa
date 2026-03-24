import { forwardRef, useState, useEffect, useRef } from "react";
import GeneralContent from "./components/GeneralContent";
import AnimeContent from "./components/AnimeContent";
import GameContent from "./components/GameContent";
import ValorantInfo from "./components/ValorantInfo";

type Tab = "general" | "anime" | "game" | "valorant";

const About = forwardRef<HTMLDivElement>((_, ref) => {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const localRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-up");
            entry.target.classList.remove("opacity-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    const elements = localRef.current?.querySelectorAll(".animation");
    elements?.forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeTab]);

  const getTabClass = (tab: Tab) => {
    const isActive = activeTab === tab;
    return `px-8 py-3 text-lg font-semibold transition-all duration-300 cursor-pointer rounded-t-xl border border-b-0 relative z-10 -mb-px ${
      isActive
        ? "border-white/15 bg-[rgba(15,20,40,0.80)] text-white"
        : "border-transparent text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/10"
    }`;
  };

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralContent />;
      case "anime":
        return <AnimeContent />;
      case "game":
        return <GameContent />;
      case "valorant":
        return <ValorantInfo />;
      default:
        return null;
    }
  };

  return (
    <section
      className="snap-start flex flex-col items-center justify-center pt-20"
      id="about"
      style={{ minHeight: "100vh" }}
      ref={ref}
    >
      <div className="w-[90%] md:w-full" ref={localRef}>
        {/* Tiêu đề */}
        <div className="animation opacity-0 text-center mb-10">
          <span className="main-text">
            <span className="text-secondary-1">About</span>
            <span className="text-secondary-2"> Me</span>
          </span>
          <p className="text-gray-400 mt-4 text-base font-medium tracking-wide">
            Here's some information & personal interests about me.
          </p>
        </div>
        {/* Layout Khung */}
        <div
          className="animation opacity-0 w-full relative"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          {/* Menu Tabs */}
          <div className="flex justify-start items-end -mb-px relative z-10">
            {(["general", "anime", "game", "valorant"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={getTabClass(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Dynamic Content Area (Frame) */}
          <div className="transition-all duration-500 w-full h-[960px] border border-white/15 rounded-2xl rounded-tl-none bg-[rgba(15,20,40,0.80)] p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] relative z-0">
            {renderContent()}
          </div>
        </div>
      </div>
    </section>
  );
});

export default About;
