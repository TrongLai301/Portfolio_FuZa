import "./../assets/css/navbar.css";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

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
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (fn: () => void) => {
    fn();
    setMenuOpen(false);
  };

  const navItems = [
    { id: "home", label: "Home", fn: onScrollToHome },
    { id: "about", label: "About", fn: onScrollToAbout },
    { id: "skills", label: "Skills", fn: onScrollToSkill },
    { id: "contact", label: "Contact", fn: onScrollToContact },
  ];

  return (
    <div className="navbar-edit sticky top-0 w-full backdrop-blur-md z-50">
      <div className="flex justify-between w-full lg:max-w-4/5 lg:mx-auto py-3 md:py-4 px-3 md:px-4 items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 signature cursor-pointer" onClick={onScrollToHome}>
          <span className="blink-text text-nav">FuZa's portfolio</span>
          <FontAwesomeIcon className="text-nav" icon={faCode} />
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:block">
          <ul className="menu-list-items flex items-center gap-6">
            {navItems.map((item) => (
              <li
                key={item.id}
                className={`text-nav cursor-pointer ${activeId === item.id ? "active" : ""}`}
                onClick={() => handleNav(item.fn)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </nav>

        {/* Hamburger Button (mobile only) */}
        <button
          className="md:hidden text-white text-2xl p-2 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(15,20,40,0.95)] backdrop-blur-md border-t border-white/10">
          <ul className="flex flex-col items-center gap-0">
            {navItems.map((item) => (
              <li
                key={item.id}
                className={`w-full text-center py-4 text-nav cursor-pointer border-b border-white/5 ${activeId === item.id ? "active" : ""}`}
                onClick={() => handleNav(item.fn)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
