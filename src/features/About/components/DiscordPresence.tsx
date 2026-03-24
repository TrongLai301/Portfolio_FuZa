import { useEffect, useState } from "react";
import { getDiscordStatus } from "../../../services/discordApi";
import type { LanyardData } from "../../../services/discordApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import {
  faGamepad,
  faQuoteLeft,
  faMusic,
  faClock,
  faHashtag,
} from "@fortawesome/free-solid-svg-icons";

const DISCORD_USER_ID = import.meta.env.VITE_USER_ID;

const USER_CONFIG = {
  pronouns: "He/Him",
  bio: "Và họ sẽ sớm nhận ra mày không phải là mảnh ghép họ tìm \n Mày là một bức tranh rời rạc hàng ngàn mẫu ghép sẽ không hoàn thiện",
};

// Component đếm thời gian chơi
const ActivityTimer = ({ startTime }: { startTime: number }) => {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = now - startTime;
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      const h = hours > 0 ? `${hours}:` : "";
      const m = `${minutes < 10 && hours > 0 ? "0" : ""}${minutes}:`;
      const s = `${seconds < 10 ? "0" : ""}${seconds}`;
      setElapsed(`${h}${m}${s}`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return <span>{elapsed}</span>;
};

export default function DiscordPresence() {
  const [discordData, setDiscordData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DISCORD_USER_ID) {
      setLoading(true);
      getDiscordStatus(DISCORD_USER_ID).then((data) => {
        setDiscordData(data);
        setLoading(false);
      });
      const interval = setInterval(() => {
        getDiscordStatus(DISCORD_USER_ID).then((data) => setDiscordData(data));
      }, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400";
      case "idle":
        return "text-yellow-400";
      case "dnd":
        return "text-red-400";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.5)]";
      case "idle":
        return "bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.5)]";
      case "dnd":
        return "bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
      default:
        return "bg-gray-500";
    }
  };

  const getBadges = (flags: number, kv?: Record<string, string>) => {
    const badgesList: { id: string; icon: string; name: string }[] = [];

    const flagMap = [
      {
        bit: 0,
        id: "staff",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordstaff.svg",
        name: "Discord Staff",
      },
      {
        bit: 1,
        id: "partner",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordpartner.svg",
        name: "Partnered Server Owner",
      },
      {
        bit: 2,
        id: "hypesquad",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/hypesquadevents.svg",
        name: "HypeSquad Events",
      },
      {
        bit: 3,
        id: "bug_hunter_1",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordbughunter1.svg",
        name: "Bug Hunter Level 1",
      },
      {
        bit: 6,
        id: "bravery",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/hypesquadbravery.svg",
        name: "HypeSquad Bravery",
      },
      {
        bit: 7,
        id: "brilliance",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/hypesquadbrilliance.svg",
        name: "HypeSquad Brilliance",
      },
      {
        bit: 8,
        id: "balance",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/hypesquadbalance.svg",
        name: "HypeSquad Balance",
      },
      {
        bit: 9,
        id: "early_supporter",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/earlysupporter.svg",
        name: "Early Supporter",
      },
      {
        bit: 14,
        id: "bug_hunter_2",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordbughunter2.svg",
        name: "Bug Hunter Level 2",
      },
      {
        bit: 17,
        id: "dev",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordcertifieddev.svg",
        name: "Verified Developer",
      },
      {
        bit: 18,
        id: "mod",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordmod.svg",
        name: "Certified Moderator",
      },
      {
        bit: 22,
        id: "active_dev",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/activedeveloper.svg",
        name: "Active Developer",
      },
    ];

    flagMap.forEach((f) => {
      if (flags & (1 << f.bit)) {
        badgesList.push({ id: f.id, icon: f.icon, name: f.name });
      }
    });

    const kvBadgeKeys = [
      {
        key: "nitro",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordnitro.svg",
        name: "Discord Nitro",
      },
      {
        key: "booster",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordboost9.svg",
        name: "Server Booster",
      },
      {
        key: "staff",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordstaff.svg",
        name: "Discord Staff",
      },
      {
        key: "partner",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordpartner.svg",
        name: "Partnered Server Owner",
      },
      {
        key: "hypesquad_events",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/hypesquadevents.svg",
        name: "HypeSquad Events",
      },
      {
        key: "balance",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/hypesquadbalance.svg",
        name: "HypeSquad Balance",
      },
      {
        key: "brilliance",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/hypesquadbrilliance.svg",
        name: "HypeSquad Brilliance",
      },
      {
        key: "bravery",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/hypesquadbravery.svg",
        name: "HypeSquad Bravery",
      },
      {
        key: "early_supporter",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/earlysupporter.svg",
        name: "Early Supporter",
      },
      {
        key: "dev",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordcertifieddev.svg",
        name: "Verified Developer",
      },
      {
        key: "mod",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordmod.svg",
        name: "Certified Moderator",
      },
    ];

    kvBadgeKeys.forEach((kb) => {
      if (kv?.[kb.key] === "true") {
        if (!badgesList.find((b) => b.name === kb.name)) {
          badgesList.push({ id: kb.key, icon: kb.icon, name: kb.name });
        }
      }
    });

    if (kv?.legacy_username) {
      badgesList.push({
        id: "legacy",
        icon: "legacy_svg",
        name: `Originally known as ${kv.legacy_username}`,
      });
    }

    return badgesList;
  };

  const currentBio = discordData?.kv?.bio || USER_CONFIG.bio;
  const currentPronouns = discordData?.kv?.pronouns || USER_CONFIG.pronouns;
  const badges = discordData
    ? getBadges(discordData.discord_user.public_flags, discordData.kv)
    : [];
  const customStatus = discordData?.activities?.find((a) => a.type === 4);

  return (
    <div className="relative group mt-14 sm:mt-0">
      <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      <div className="relative p-6 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl flex flex-col gap-6 shadow-2xl">
        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="flex flex-row items-start gap-4 sm:gap-6 w-full">
              <div className="relative shrink-0 pt-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/5 border-2 border-white/10"></div>
                <div className="absolute bottom-0.5 right-0.5 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-4 border-[#0F1428] bg-white/10"></div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <div className="h-6 w-32 bg-white/10 rounded"></div>
                  <div className="h-4 w-16 bg-white/5 rounded"></div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-4 w-4 bg-white/5 rounded-full"></div>
                  ))}
                </div>
                <div className="h-12 w-full bg-white/5 rounded-xl"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-row items-center gap-4 bg-white/3 p-3 rounded-xl border border-white/5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-16 bg-white/5 rounded"></div>
                  <div className="h-4 w-32 bg-white/10 rounded"></div>
                  <div className="h-3 w-full bg-white/5 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-row items-start gap-4 sm:gap-6 w-full">
              <div className="relative shrink-0 pt-1">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full p-1 border-2 ${discordData ? getStatusColor(discordData.discord_status).replace("text", "border") : "border-gray-500"}`}
                >
                  {discordData ? (
                    <img
                      src={`https://cdn.discordapp.com/avatars/${discordData.discord_user.id}/${discordData.discord_user.avatar}.png?size=256`}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover shadow-2xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faDiscord}
                        className="text-white/20 text-3xl"
                      />
                    </div>
                  )}
                </div>
                <div
                  className={`absolute bottom-0.5 right-0.5 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-4 border-[#0F1428] ${discordData ? getStatusBg(discordData.discord_status) : "bg-gray-500"}`}
                ></div>

                {/* Speech Bubble (Hiển thị mặc định trên Mobile, Hover trên Desktop) */}
                {(discordData?.kv?.status || customStatus) && (
                  <div className="absolute -top-14 -left-2 sm:-left-4 bg-[#232428] px-2.5 py-1.5 rounded-2xl border border-white/10 shadow-2xl w-32 sm:w-40 md:w-48 text-[10px] sm:text-[11px] leading-tight z-20 
                    opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-y-[-5px] transition-all duration-300 whitespace-normal">
                    <div className="flex items-start gap-1.5 max-h-20 overflow-hidden">
                      {!discordData?.kv?.status && customStatus?.emoji && (
                        <span className="shrink-0 mt-0.5">
                          {customStatus.emoji.id ? (
                            <img
                              src={`https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? "gif" : "webp"}`}
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                              alt="emoji"
                            />
                          ) : (
                            customStatus.emoji.name
                          )}
                        </span>
                      )}
                      <span className="text-gray-200 italic line-clamp-3 font-medium text-[9px] sm:text-[10px]">
                        {discordData?.kv?.status || customStatus?.state}
                      </span>
                    </div>
                    <div className="absolute -bottom-2 left-6 md:left-10 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-10 border-t-[#232428]"></div>
                  </div>
                )}
              </div>

              {/* Info Area */}
              <div className="text-left flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1.5">
                  <h3 className="text-white font-bold text-base sm:text-lg md:text-xl truncate">
                    {discordData?.discord_user.username || "Loading..."}
                  </h3>
                  <span className="inline-block text-[9px] sm:text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/5 whitespace-nowrap self-start sm:self-auto uppercase tracking-tighter">
                    {currentPronouns}
                  </span>
                </div>

                {/* Badges with Tooltips */}
                <div className="flex flex-wrap items-center gap-1 mb-3">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="relative group/badge flex items-center justify-center"
                    >
                      {badge.icon === "legacy_svg" ? (
                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#5865F2] rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-help">
                          <FontAwesomeIcon
                            icon={faHashtag}
                            className="text-white text-[7px] sm:text-[9px]"
                          />
                        </div>
                      ) : (
                        <img
                          src={badge.icon}
                          alt={badge.name}
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 drop-shadow-md hover:scale-110 transition-transform cursor-help"
                        />
                      )}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#111214] text-white text-[9px] font-bold rounded shadow-xl opacity-0 group-hover/badge:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 transform translate-y-1 group-hover/badge:translate-y-0">
                        {badge.name}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-[#111214]"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bio Area */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 mb-4 relative">
                  <FontAwesomeIcon
                    icon={faQuoteLeft}
                    className="absolute -top-1 -left-1 text-indigo-500/20 text-base"
                  />
                  <p className="text-gray-300 text-[10px] sm:text-[11px] leading-relaxed italic whitespace-pre-line">
                    {currentBio}
                  </p>
                </div>

                {/* Activity Detail with Timer & Images */}
                <div className="space-y-4">
                  {discordData?.activities
                    ?.filter((a) => a.type !== 4)
                    .map((activity, i) => (
                      <div
                        key={i}
                        className="flex flex-row items-center gap-4 bg-white/3 p-3 rounded-xl border border-white/5"
                      >
                        {/* Activity Image */}
                        <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-black/40 rounded-lg overflow-hidden flex items-center justify-center border border-white/5 shadow-inner">
                          {activity.assets?.large_image ? (
                            <img
                              src={
                                activity.assets.large_image.startsWith(
                                  "mp:external",
                                )
                                  ? activity.assets.large_image.replace(
                                      /mp:external\/.*\/(https?)/,
                                      "$1",
                                    )
                                  : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`
                              }
                              className="w-full h-full object-cover"
                              alt={activity.name}
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={activity.type === 2 ? faMusic : faGamepad}
                              className="text-2xl text-white/10"
                            />
                          )}
                          {activity.assets?.small_image && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#111214] rounded-full p-0.5 border-2 border-[#111214]">
                              <img
                                src={`https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`}
                                className="w-full h-full rounded-full"
                                alt="Small icon"
                              />
                            </div>
                          )}
                        </div>

                        {/* Activity Texts & Timer */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="mb-2">
                            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[8px] sm:text-[9px] font-black rounded-sm border border-indigo-500/20 uppercase tracking-widest">
                              {activity.type === 2 ? "Listening" : "Playing"}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <h4 className="text-white font-extrabold text-[12px] sm:text-[13px] truncate uppercase tracking-normal">
                              {activity.name}
                            </h4>
                            {activity.timestamps?.start && (
                              <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded-full">
                                <FontAwesomeIcon
                                  icon={faClock}
                                  className="text-[9px] opacity-60"
                                />
                                <ActivityTimer
                                  startTime={activity.timestamps.start}
                                />
                              </div>
                            )}
                          </div>
                          
                          <p className="text-gray-400 text-[10px] sm:text-[11px] truncate opacity-60 font-medium">
                            {activity.details || activity.state || ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  {!discordData?.activities?.some((a) => a.type !== 4) && (
                    <p className="text-white/10 text-[9px] uppercase tracking-[0.2em] text-center py-2 italic font-light">
                      No current activity
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Status Banner */}
            <div className="w-full pt-4 border-t border-white/5 flex justify-between items-center text-[9px] uppercase font-black tracking-[0.15em] text-white/20">
              <span>Presence Status</span>
              <span
                className={
                  discordData
                    ? getStatusColor(discordData.discord_status)
                    : ""
                }
              >
                {discordData?.discord_status || "offline"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
