import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faCopy } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";

interface ContactCardProps {
  type: "call" | "message" | "email";
  title: string;
  kaomoji: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  copyValue?: string;
  icon: IconDefinition;
}

const themeClasses = {
  call: {
    hoverBorder: "hover:border-sky-400/60",
    hoverShadow: "hover:shadow-[0_20px_45px_-10px_rgba(56,189,248,0.4)]",
    iconBg: "bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600",
    iconShadow: "shadow-[0_0_25px_rgba(34,211,238,0.6)]",
    buttonBg: "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500",
    badgeBg: "bg-sky-500/15 border-sky-400/30 text-sky-300",
    tag: "Voice Link",
  },
  message: {
    hoverBorder: "hover:border-purple-400/60",
    hoverShadow: "hover:shadow-[0_20px_45px_-10px_rgba(168,85,247,0.4)]",
    iconBg: "bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500",
    iconShadow: "shadow-[0_0_25px_rgba(168,85,247,0.6)]",
    buttonBg: "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-400 hover:to-pink-500",
    badgeBg: "bg-purple-500/15 border-purple-400/30 text-purple-300",
    tag: "Discord Realm",
  },
  email: {
    hoverBorder: "hover:border-pink-400/60",
    hoverShadow: "hover:shadow-[0_20px_45px_-10px_rgba(244,63,94,0.4)]",
    iconBg: "bg-gradient-to-br from-pink-400 via-rose-500 to-rose-600",
    iconShadow: "shadow-[0_0_25px_rgba(244,63,94,0.6)]",
    buttonBg: "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500",
    badgeBg: "bg-pink-500/15 border-pink-400/30 text-pink-300",
    tag: "Direct Mailbox",
  },
};

export default function ContactCard({
  type,
  title,
  kaomoji,
  description,
  buttonText,
  buttonLink,
  copyValue,
  icon,
}: ContactCardProps) {
  const theme = themeClasses[type];
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!copyValue) return;
    navigator.clipboard.writeText(copyValue);
    setCopied(true);
    toast.success(`Copied "${copyValue}" to clipboard! (≧◡≦)`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`animation opacity-0 relative bg-[rgba(15,20,40,0.7)] backdrop-blur-xl border border-white/15 rounded-3xl p-6 lg:p-8 pt-14 md:pt-16 flex flex-col items-center text-center shadow-[0_12px_35px_rgba(0,0,0,0.5)] transition-all duration-400 hover:-translate-y-3 group ${theme.hoverBorder} ${theme.hoverShadow}`}
      style={{ animationFillMode: "both" }}
    >
      {/* Floating Cute Mascot Icon */}
      <div
        className={`absolute -top-9 left-1/2 -translate-x-1/2 w-18 h-18 rounded-3xl flex items-center justify-center text-white border-4 border-[#0a0f20] group-hover:scale-115 group-hover:rotate-6 transition-all duration-300 ${theme.iconBg} ${theme.iconShadow}`}
      >
        <FontAwesomeIcon icon={icon} className="text-2xl" />
      </div>

      {/* Playful Kaomoji Bubble */}
      <div className="mb-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-mono font-bold border tracking-wide inline-flex items-center gap-1.5 ${theme.badgeBg} group-hover:scale-105 transition-transform`}
        >
          <span>{kaomoji}</span>
          <span>{theme.tag}</span>
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-black text-white mb-4 tracking-tight group-hover:text-indigo-200 transition-colors">
        {title}
      </h3>

      {/* Optional Description */}
      {description && (
        <p className="text-gray-300 text-xs sm:text-sm mb-6 grow leading-relaxed">
          {description}
        </p>
      )}

      {/* Action Buttons: Main Button + Copy Chip */}
      <div className="w-full mt-auto space-y-2">
        <a
          href={buttonLink}
          target={buttonLink.startsWith("http") || type === "message" ? "_blank" : undefined}
          rel="noreferrer"
          className={`text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 w-full ${theme.buttonBg} hover:scale-[1.02] active:scale-95`}
        >
          <span>{buttonText}</span>
        </a>

        {copyValue && (
          <button
            onClick={handleCopy}
            className="w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-[11px] font-mono flex items-center justify-center gap-1.5 transition-all"
            title="Copy to clipboard"
          >
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} className={copied ? "text-emerald-400" : ""} />
            <span>{copied ? "Copied! (•‿•)" : `Copy: ${copyValue}`}</span>
          </button>
        )}
      </div>
    </div>
  );
}
