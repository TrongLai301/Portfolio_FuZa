import { toast } from "sonner";
import { useState, useEffect } from "react";
import { mockValorantProfile } from "../mockData";
import { getValorantAccount, getValorantMMR } from "../../../services/valorantApi";

export default function ValorantInfo() {
  const profile = mockValorantProfile;

  const [liveData, setLiveData] = useState<{
    level?: number;
    rankName?: string;
    rankIcon?: string;
    rr?: number;
    playerCard?: string;
    name?: string;
    tag?: string;
  }>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"config" | "graphics">("config");

  useEffect(() => {
    async function fetchLiveProfile() {
      const [name, tag] = profile.ign.split("#");
      if (!name || !tag) {
        setLoading(false);
        return;
      }

      try {
        const [accountData, mmrData] = await Promise.all([
          getValorantAccount(name, tag),
          getValorantMMR(name, tag)
        ]);

        console.log("✅ [Valorant API] Account Data:", accountData);
        console.log("✅ [Valorant API] MMR Data:", mmrData);

        setLiveData({
          level: accountData?.account_level,
          rankName: mmrData?.currenttierpatched,
          name: accountData?.name,
          tag: accountData?.tag,
          rankIcon: mmrData?.images?.large,
          rr: mmrData?.ranking_in_tier,
          playerCard: accountData?.card?.small,
        });
      } catch {
        toast.error("Failed to sync Valorant data");
      } finally {
        setLoading(false);
      }
    }
    
    fetchLiveProfile();
  }, [profile.ign]);

  const displayRankIcon = liveData.rankIcon || profile.rankIcon;
  const displayRankName = liveData.rankName || profile.rankName;
  const displayLevel = liveData.level || profile.level;
  const ingame = (liveData.name && liveData.tag) ? `${liveData.name}#${liveData.tag}` : profile.ign;
  const displayRR = liveData.rr !== undefined ? ` - ${liveData.rr} RR` : "";
  const displayAvatar = liveData.playerCard || profile.playerCard;

  return (
    <div className="animation fade-in-up w-full h-full p-2 md:p-6 pb-10 overflow-y-auto custom-scrollbar flex flex-col gap-6">
      
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row items-center md:items-stretch gap-4 md:gap-8 bg-indigo-500/5 p-4 md:p-8 rounded-2xl md:rounded-4xl border border-indigo-500/20 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        
        {/* Left: Avatar */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-indigo-500/30 blur-2xl opacity-40 rounded-full"></div>
          <img 
            src={displayAvatar} 
            alt="Avatar" 
            className={`w-24 h-24 md:w-36 md:h-36 relative z-10 rounded-2xl border-2 border-indigo-500/50 object-cover transition-all duration-700 shadow-[0_0_15px_rgba(99,102,241,0.4)] ${loading ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}
          />
        </div>

        {/* Center: Info */}
        <div className="flex flex-col justify-center flex-1 text-center md:text-left gap-3">
          <div>
            <h2 className="text-xl md:text-2xl lg:text-4xl xl:text-5xl font-black text-white tracking-wider uppercase mb-2 drop-shadow-lg truncate">{ingame}</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className={`px-3 py-1 bg-indigo-500/10 text-indigo-200 font-bold rounded-xl text-xs md:text-sm border border-indigo-500/30 shadow-sm transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                Level {displayLevel}
              </span>
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-200 font-bold rounded-xl text-xs md:text-sm border border-indigo-500/30 shadow-sm">
                {profile.mainRole}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Rank Display */}
        <div className="flex flex-row md:flex-col items-center justify-center gap-3 border-t md:border-t-0 md:border-l border-indigo-500/20 pt-4 md:pt-0 md:pl-8 shrink-0">
          <img 
            src={displayRankIcon} 
            alt={displayRankName} 
            className={`w-16 h-16 md:w-28 md:h-28 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-700 ${loading ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}
          />
          <span className={`px-3 md:px-5 py-1.5 bg-linear-to-r from-indigo-600/40 to-purple-600/40 text-white font-extrabold rounded-xl uppercase text-xs md:text-sm border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)] tracking-wide whitespace-nowrap transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
            {displayRankName}{displayRR}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Settings / Config */}
        <div className="bg-indigo-500/5 rounded-4xl border border-indigo-500/20 backdrop-blur-md flex flex-col shadow-lg overflow-hidden">
          {/* Header & Tabs */}
          <div className="p-4 md:p-8 pb-0">
            <h3 className="text-lg md:text-2xl font-black text-white mb-4 md:mb-6 flex items-center gap-3 uppercase tracking-wide">
              <span className="w-2 h-5 md:w-2.5 md:h-7 bg-indigo-500 rounded-full inline-block shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
              Settings
            </h3>
            
            <div className="flex bg-black/30 rounded-lg p-1 border border-indigo-500/20 mb-4 md:mb-6">
              {(["config", "graphics"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 md:py-2 px-3 md:px-4 rounded-md text-xs md:text-base font-bold uppercase tracking-wider transition-all duration-300 ${
                    activeTab === tab 
                      ? "bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]" 
                      : "text-gray-400 hover:text-white hover:bg-indigo-500/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8 pt-0 flex-1 overflow-y-auto">
            {activeTab === "config" && (
              <div className="grid grid-cols-2 gap-4">
                {profile.settings.config.map((s) => (
                  <SettingItem key={s.label} label={s.label} value={s.value} />
                ))}
              </div>
            )}
            
            {activeTab === "graphics" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="text-white font-black mb-4 text-base md:text-lg flex items-center gap-2 uppercase tracking-wide">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    Display
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-6 border-t border-indigo-500/20 pt-5">
                    {profile.settings.graphics.display.map((s) => (
                      <SettingGraphicItem key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-black mb-4 text-base md:text-lg flex items-center gap-2 uppercase tracking-wide">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
                    Performance
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 border-t border-indigo-500/20 pt-5">
                    {profile.settings.graphics.performance.map((s) => (
                      <SettingGraphicItem key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-black mb-4 text-base md:text-lg flex items-center gap-2 uppercase tracking-wide">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path></svg>
                    Quality
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 border-t border-indigo-500/20 pt-5">
                    {profile.settings.graphics.quality.map((s) => (
                      <SettingGraphicItem key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gear */}
        <div className="bg-indigo-500/5 p-4 md:p-8 rounded-2xl md:rounded-4xl border border-indigo-500/20 backdrop-blur-md flex flex-col shadow-lg">
          <h3 className="text-lg md:text-2xl font-black text-white mb-4 md:mb-6 flex items-center gap-3 uppercase tracking-wide">
            <span className="w-2 h-5 md:w-2.5 md:h-7 bg-indigo-500 rounded-full inline-block shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
            Gaming Gear
          </h3>
          <div className="flex flex-col gap-4">
            {profile.gear.map((g) => (
              <GearItem key={g.name} name={g.name} value={g.value} />
            ))}
          </div>
        </div>
      </div>

      {/* Agents Tier List */}
      <div className="bg-indigo-500/5 p-4 md:p-8 rounded-2xl md:rounded-4xl border border-indigo-500/20 backdrop-blur-md shadow-lg mb-8">
        <h3 className="text-lg md:text-2xl font-black text-white mb-4 md:mb-6 flex items-center gap-3 uppercase tracking-wide">
          <span className="w-2 h-5 md:w-2.5 md:h-7 bg-indigo-500 rounded-full inline-block shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
          Most Played Agents
        </h3>
        <div className="flex flex-col gap-4">
          {profile.agentsTier.map((t) => (
            <TierRow key={t.tier} tier={t.tier} color={t.color} agents={t.agents} />
          ))}
        </div>
      </div>
    </div>
  );
}

const SettingItem = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-indigo-500/10 p-3 md:p-4 rounded-xl md:rounded-2xl border border-indigo-500/20 flex flex-col justify-center items-start shadow-md hover:border-indigo-500/50 hover:shadow-[0_0_10px_rgba(99,102,241,0.3)] transition-all duration-300">
    <span className="text-indigo-300/70 text-[10px] md:text-sm font-bold uppercase tracking-widest mb-1 md:mb-1.5">{label}</span>
    <span className="text-white font-black text-sm md:text-xl drop-shadow-sm">{value}</span>
  </div>
);

const SettingGraphicItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col">
    <span className="text-indigo-300/70 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">{label}</span>
    <span className="text-white font-black text-sm md:text-base capitalize">{value}</span>
  </div>
);

const GearItem = ({ name, value }: { name: string, value: string }) => (
  <div className="flex justify-between items-center bg-indigo-500/10 px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border border-indigo-500/20 shadow-md hover:border-indigo-500/50 hover:shadow-[0_0_10px_rgba(99,102,241,0.3)] transition-all duration-300">
    <span className="text-gray-300 font-bold tracking-wide text-xs md:text-base">{name}</span>
    <span className="text-white font-bold text-right text-[10px] md:text-base bg-indigo-500/10 px-2 md:px-3 py-1 rounded-lg border border-indigo-500/20">{value}</span>
  </div>
);

const TierRow = ({ tier, color, agents }: { tier: string, color: string, agents: {id: string, name: string, img: string}[] }) => (
  <div className="flex items-stretch bg-indigo-500/10 rounded-xl md:rounded-2xl border border-indigo-500/20 shadow-md">
    <div className={`w-12 md:w-20 ${color} rounded-l-xl md:rounded-l-2xl flex items-center justify-center font-black text-2xl md:text-4xl text-white shadow-[inset_0_0_15px_rgba(0,0,0,0.3)] border-r border-indigo-500/20`}>
      {tier}
    </div>
    <div className="flex flex-wrap items-center gap-4 p-4 flex-1">
      {agents.map(agent => (
        <div key={agent.id} className="relative group cursor-pointer inline-block z-10 hover:z-50">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-500/10 rounded-xl overflow-hidden border-2 border-indigo-500/20 group-hover:border-indigo-500 transition-all duration-300 transform group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-[0_10px_15px_-3px_rgba(99,102,241,0.5)] relative z-20">
            <img src={agent.img} alt={agent.name} className="w-full h-full object-cover scale-110" />
          </div>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-indigo-500/30 shadow-lg pointer-events-none">
            {agent.name}
          </span>
        </div>
      ))}
    </div>
  </div>
);
