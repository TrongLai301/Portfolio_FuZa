import "./../assets/css/navbar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";

type NavbarProps = {
  activeId: string;
  onScrollToHome: () => void;
  onScrollToAbout: () => void;
  onScrollToSkill: () => void;
  onScrollToContact: () => void;
};

export default function Navbar({
  activeId,
  onScrollToHome,
  onScrollToAbout,
  onScrollToSkill,
  onScrollToContact,
}: NavbarProps) {
  return (
    <div className="navbar-edit sticky top-0 w-full backdrop-blur-md">
      <div className="flex justify-between max-w-4/5 mx-auto py-4 items-center">
        <div className="flex items-center gap-2 signature" onClick={onScrollToHome}>
          <span className="blink-text text-nav">FuZa portfolio</span>
          <FontAwesomeIcon className="text-nav" icon={faCode} />
        </div>
        <div className="menu flex items-center max-w-1/3">
          <nav>
            <ul className="menu-list-items flex items-center gap-6">
               <li
                className={`text-nav ${activeId === "home" ? "active" : ""}`}
                onClick={onScrollToHome}
              >
                Home
              </li>
              <li
                className={`text-nav ${activeId === "about" ? "active" : ""}`}
                onClick={onScrollToAbout}
              >
                About
              </li>
              <li
                className={`text-nav ${activeId === "skills" ? "active" : ""}`}
                onClick={onScrollToSkill}
              >
                Skills
              </li>
              <li
                className={`text-nav ${activeId === "contact" ? "active" : ""}`}
                onClick={onScrollToContact}
              >
                Contact
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
