import "./../assets/css/navbar.css";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { usePortfolio } from "./PortfolioContext";

type NavbarProps = {
  activeId: string;
  onScrollToHome: () => void;
  onScrollToAbout: () => void;
  onScrollToEntertainment: () => void;
  onScrollToCelebrates: () => void;
  onScrollToSkill: () => void;
  onScrollToContact: () => void;
};

export default function Navbar({
  activeId,
  onScrollToHome,
  onScrollToAbout,
  onScrollToEntertainment,
  onScrollToCelebrates,
  onScrollToSkill,
  onScrollToContact,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { siteSettings } = usePortfolio();

  const handleNav = (fn: () => void) => {
    fn();
    setMenuOpen(false);
  };

  const navItems = [
    { id: "home", label: "Home", fn: onScrollToHome },
    { id: "about", label: "About", fn: onScrollToAbout },
    { id: "entertainment", label: "Entertainment", fn: onScrollToEntertainment },
    { id: "celebrates", label: "Celebrates", fn: onScrollToCelebrates },
    { id: "skills", label: "Skills", fn: onScrollToSkill },
    { id: "contact", label: "Contact", fn: onScrollToContact },
  ];

  const logoText = siteSettings?.header_logo_text || "FuZa's profile";
  const isGradient = (val?: any) => Boolean(val && typeof val === "string" && val.includes("gradient"));

  const logoTextStyle: React.CSSProperties = isGradient(siteSettings?.header_logo_color)
    ? {
        background: siteSettings?.header_logo_color,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        display: "inline-block",
        paddingRight: "0.35em",
        overflow: "visible",
      }
    : {
        color: siteSettings?.header_logo_color || "var(--color-signature)",
        display: "inline-block",
        paddingRight: "0.2em",
      };

  const logoSvgStyle = {
    color: isGradient(siteSettings?.header_logo_color)
      ? "var(--color-signature-solid, #ffffff)"
      : (siteSettings?.header_logo_color || "var(--color-signature)"),
  };

  return (
    <div className="navbar-edit sticky top-0 w-full backdrop-blur-md z-50">
      <div className="flex justify-between w-full lg:max-w-4/5 lg:mx-auto py-3 md:py-4 px-3 md:px-4 items-center">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 signature cursor-pointer select-none" 
          onClick={onScrollToHome}
        >
          <span className="blink-text text-nav" style={logoTextStyle}>
            {logoText}
          </span>
          <FontAwesomeIcon className="text-nav shrink-0" icon={faCode} style={logoSvgStyle} />
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
                <span
                  style={{
                    background: activeId === item.id
                      ? (siteSettings?.menu_active_color || "var(--color-menu-active)")
                      : (siteSettings?.menu_text_color || "var(--color-menu-items)"),
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: "inline-block",
                  }}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
