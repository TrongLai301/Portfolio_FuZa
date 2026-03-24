import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface SkillCardProps {
  name: string;
  icon: IconDefinition;
  color?: string; // Optional hover and icon color
  delay?: number; // Delay for animation entry
}

const SkillCard = ({ name, icon, color = "#f6eaea" }: SkillCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 group">
      <div 
        className="skill-icon" 
        style={{ 
          color: color, 
          "--hover-color": color
        } as React.CSSProperties}
      >
        <FontAwesomeIcon icon={icon} />
      </div>
      <span className="text-white/70 font-medium tracking-wide opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 group-hover:text-white transition-all duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
        {name}
      </span>
    </div>
  );
};

export default SkillCard;
