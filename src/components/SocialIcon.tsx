import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface SocialIconProps {
  to: string;
  icon: IconDefinition;
}

const SocialIcon = ({ to, icon }: SocialIconProps) => {
  return (
    <Link to={to} target="_blank">
      <div className="animation contact-icon flex justify-center items-center">
        <FontAwesomeIcon icon={icon} />
      </div>
    </Link>
  );
};

export default SocialIcon;
