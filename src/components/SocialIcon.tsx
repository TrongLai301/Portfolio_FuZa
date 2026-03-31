import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface SocialIconProps {
  to: string;
  icon: IconDefinition;
  color?: string;
}

const SocialIcon = ({ to, icon, color }: SocialIconProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      to={to} 
      target="_blank"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="animation contact-icon flex justify-center items-center"
        style={{ 
          "--hover-color": (isHovered && color) ? color : undefined 
        } as React.CSSProperties}
      >
        <FontAwesomeIcon 
           icon={icon} 
           style={{ color: (isHovered && color) ? color : undefined }}
        />
      </div>
    </Link>
  );
};

export default SocialIcon;
