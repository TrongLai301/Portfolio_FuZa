import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

export default function CurrentTimeWidget({ className = "" }: { className?: string }) {
  const [timeParts, setTimeParts] = useState({
    hours: "12",
    minutes: "00",
    seconds: "00",
  });
  const [tick, setTick] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const formatted = new Intl.DateTimeFormat("en-US", options).format(now);
      const [h = "12", m = "00", s = "00"] = formatted.split(":");
      setTimeParts({ hours: h, minutes: m, seconds: s });
      setTick((prev) => !prev);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`group relative bg-[#0a0f1d]/90 backdrop-blur-xl border border-cyan-500/25 rounded-2xl p-2.5 sm:p-3.5 md:p-4 shadow-[0_12px_32px_rgba(0,0,0,0.5),0_0_15px_rgba(6,182,212,0.12)] select-none transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:border-cyan-400/50 hover:shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(6,182,212,0.3)] w-fit min-w-[170px] sm:min-w-[210px] ${className}`}
    >
      {/* Ambient Cyber Light Streak on top */}
      <div className="absolute -top-px left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />

      {/* Top Header: LIVE DOT + CURRENT TIME & GMT+7 */}
      <div className="flex items-center justify-between gap-2.5 mb-1 sm:mb-2">
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
          {/* Live pulsing radar dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
          </span>

          <FontAwesomeIcon
            icon={faClock}
            className={`text-[10px] sm:text-xs transition-transform duration-300 ${
              tick ? "scale-110 text-cyan-300" : "scale-100 text-cyan-400"
            }`}
          />
          <span className="tracking-widest">CURRENT TIME</span>
        </div>

        <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 font-semibold tracking-wide shadow-[0_0_8px_rgba(6,182,212,0.15)]">
          GMT+7
        </span>
      </div>

      {/* Animated Large Digital Digits with rhythmic pulsing colons */}
      <div className="flex items-baseline font-extrabold font-mono tracking-tight text-white mb-0.5 sm:mb-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
        <span className="text-xl sm:text-3xl md:text-4xl text-white group-hover:text-cyan-50 transition-colors">
          {timeParts.hours}
        </span>
        <span
          className={`text-cyan-400 mx-0.5 sm:mx-1 text-base sm:text-2xl md:text-3xl font-normal transition-opacity duration-200 ${
            tick ? "opacity-100 text-cyan-300 drop-shadow-[0_0_8px_#22d3ee]" : "opacity-30"
          }`}
        >
          :
        </span>
        <span className="text-xl sm:text-3xl md:text-4xl text-white group-hover:text-cyan-50 transition-colors">
          {timeParts.minutes}
        </span>
        <span
          className={`text-cyan-400 mx-0.5 sm:mx-1 text-base sm:text-2xl md:text-3xl font-normal transition-opacity duration-200 ${
            tick ? "opacity-100 text-cyan-300 drop-shadow-[0_0_8px_#22d3ee]" : "opacity-30"
          }`}
        >
          :
        </span>
        <span className="text-xl sm:text-3xl md:text-4xl text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
          {timeParts.seconds}
        </span>
      </div>

      {/* Subtext with subtle status dot */}
      <div className="flex items-center gap-1.5 text-[9px] sm:text-xs text-gray-400 font-normal tracking-wide">
        <span className="w-1 h-1 rounded-full bg-cyan-400/60 inline-block animate-pulse"></span>
        <span>Vietnam Local Standard Time</span>
      </div>
    </div>
  );
}
