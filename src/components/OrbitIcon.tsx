import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface OrbitIconProps {
  icon: IconDefinition;
  angle: number; // in degrees
  radius?: number; // distance from center in px
  color?: string;
}

const OrbitIcon = ({ icon, angle, radius = 170, color }: OrbitIconProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const radian = (angle * Math.PI) / 180;
  
  // Center of container (50%) + offset based on angle and radius - half of item size (25px)
  const leftOffset = Math.cos(radian) * radius;
  const topOffset = Math.sin(radian) * radius;
  
  const left = `calc(50% ${leftOffset >= 0 ? '+' : '-'} ${Math.abs(leftOffset)}px - 40px)`;
  const top = `calc(50% ${topOffset >= 0 ? '+' : '-'} ${Math.abs(topOffset)}px - 25px)`;

  return (
    <div 
      className="orbit-item flex justify-center items-center" 
      style={{ 
        left, 
        top,
        "--hover-color": (isHovered && color) ? color : undefined 
      } as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FontAwesomeIcon 
        icon={icon} 
        style={{ color: (isHovered && color) ? color : undefined }}
      />
    </div>
  );
};

export default OrbitIcon;
