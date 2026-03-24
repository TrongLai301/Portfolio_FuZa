import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ContactCardProps {
  type: "call" | "message" | "email";
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  icon: IconDefinition;
}

const themeClasses = {
  call: {
    hoverBorder: "hover:border-sky-400/50",
    hoverShadow: "hover:shadow-[0_20px_40px_-15px_rgba(56,189,248,0.3)]",
    iconBg: "bg-linear-to-br from-cyan-400 to-blue-600",
    iconShadow: "shadow-[0_0_20px_rgba(34,211,238,0.5)]",
    buttonBg: "bg-blue-600/80 hover:bg-blue-500",
  },
  message: {
    hoverBorder: "hover:border-purple-400/50",
    hoverShadow: "hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.3)]",
    iconBg: "bg-linear-to-br from-purple-400 to-pink-600",
    iconShadow: "shadow-[0_0_20px_rgba(168,85,247,0.5)]",
    buttonBg: "bg-purple-600/80 hover:bg-purple-500",
  },
  email: {
    hoverBorder: "hover:border-emerald-400/50",
    hoverShadow: "hover:shadow-[0_20px_40px_-15px_rgba(52,211,153,0.3)]",
    iconBg: "bg-linear-to-br from-emerald-400 to-teal-600",
    iconShadow: "shadow-[0_0_20px_rgba(52,211,153,0.5)]",
    buttonBg: "bg-emerald-600/80 hover:bg-emerald-500",
  }
};

export default function ContactCard({ type, title, description, buttonText, buttonLink, icon }: ContactCardProps) {
  const theme = themeClasses[type];

  return (
    <div 
      className={`animation opacity-0 relative bg-[#292E49] bg-opacity-30 backdrop-blur-md border border-gray-600 rounded-2xl p-8 pt-16 flex flex-col items-center text-center shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-2 group ${theme.hoverBorder} ${theme.hoverShadow}`}
      style={{ animationFillMode: "both" }}
    >
      <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center text-white border-4 border-[#1a1f35] group-hover:scale-110 transition-transform duration-300 ${theme.iconBg} ${theme.iconShadow}`}>
        <FontAwesomeIcon icon={icon} className="text-3xl" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300 text-sm mb-6 grow">
        {description}
      </p>
      <a 
        href={buttonLink} 
        target={(buttonLink.startsWith("http") || type === "message") ? "_blank" : undefined}
        rel="noreferrer"
        className={`mt-auto text-white px-8 py-2.5 rounded-xl font-semibold tracking-wide transition-all shadow-md w-full ${theme.buttonBg}`}
      >
        {buttonText}
      </a>
    </div>
  );
}
