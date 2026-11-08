import { forwardRef, useState } from "react";
import AnimeContent from "../About/components/AnimeContent";
import GameContent from "../About/components/GameContent";
import ValorantInfo from "../About/components/ValorantInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, faTv } from "@fortawesome/free-solid-svg-icons";
import { faBilibili } from "@fortawesome/free-brands-svg-icons";

type EntertainmentTab = "anime" | "game" | "valorant";

const EntertainmentSection = forwardRef<HTMLDivElement>((_, ref) => {
  const [activeTab, setActiveTab] = useState<EntertainmentTab>("anime");

  const tabs = [
    { id: "anime", label: "Anime Watchlist", icon: faBilibili },
    { id: "game", label: "Favorite Games", icon: faGamepad },
    { id: "valorant", label: "Valorant Career", icon: faTv },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
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
      id="entertainment"
      ref={ref}
      className="snap-start flex flex-col items-center justify-center pt-24 pb-20 w-full relative"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-full">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-widest font-semibold mb-3">
            <FontAwesomeIcon icon={faGamepad} />
            <span>Digital Leisure & Passions</span>
          </div>

          <span className="main-text">
            <span className="text-secondary-1">My</span>
            <span className="text-secondary-2"> Entertainment</span>
          </span>

          <p className="text-gray-400 mt-4 text-sm md:text-base font-medium tracking-wide max-w-xl mx-auto px-4">
            Curated anime series, favorite gaming adventures, and competitive Valorant progression.
          </p>
        </div>

        {/* Tab Frame */}
        <div className="w-full relative">
          {/* Tab Navigation */}
          <div className="flex justify-start items-end -mb-px relative z-10 gap-1 overflow-x-auto custom-scrollbar pb-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as EntertainmentTab)}
                  className={`px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer rounded-t-2xl border border-b-0 relative z-10 -mb-px whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? "border-white/15 bg-[rgba(15,20,40,0.85)] text-white shadow-lg"
                      : "border-transparent text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/10"
                  }`}
                >
                  <FontAwesomeIcon icon={tab.icon} className={isActive ? "text-indigo-400" : "text-gray-500"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Content Frame */}
          <div className="transition-all duration-500 w-full h-[540px] md:h-[680px] border border-white/15 rounded-2xl rounded-tl-none bg-[rgba(15,20,40,0.75)] backdrop-blur-xl p-4 md:p-8 shadow-[0_12px_40px_0_rgba(0,0,0,0.6)] relative z-0 overflow-hidden">
            {renderContent()}
          </div>
        </div>
      </div>
    </section>
  );
});

export default EntertainmentSection;

