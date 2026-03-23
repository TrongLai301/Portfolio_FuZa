import { createContext, useContext } from "react";

type ScrollContextType = {
  homeRef: React.RefObject<HTMLDivElement | null>;
  aboutRef: React.RefObject<HTMLDivElement | null>;
  skillRef: React.RefObject<HTMLDivElement | null>;
  contactRef: React.RefObject<HTMLDivElement | null>;
  scrollTo: (ref: React.RefObject<HTMLDivElement | null>) => void;
};
export const ScrollContext = createContext<ScrollContextType | null>(null);

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
};
