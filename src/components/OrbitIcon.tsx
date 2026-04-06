import { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const radian = (angle * Math.PI) / 180;
  
  // Center of container (50%) + offset based on angle and radius
  const leftOffset = Math.cos(radian) * radius;
  const topOffset = Math.sin(radian) * radius;
  
  const leftCorr = isMobile ? '25px' : '30px';
  const topCorr = isMobile ? '15px' : '25px';

  const left = `calc(50% ${leftOffset >= 0 ? '+' : '-'} ${Math.abs(leftOffset)}px - ${leftCorr})`;
  const top = `calc(50% ${topOffset >= 0 ? '+' : '-'} ${Math.abs(topOffset)}px - ${topCorr})`;

  return (
    <div 
      className="orbit-item flex justify-center items-center animation opacity-0" 
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
