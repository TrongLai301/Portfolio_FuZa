import { useRef } from "react";
import { ScrollContext } from "./ScrollContext";

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const homeRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const skillRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const top =
        ref.current.getBoundingClientRect().top + window.pageYOffset - 90;
      console.log("top:" + top);
      console.log("current top:" + ref.current.getBoundingClientRect().top);
      console.log("offset:" + window.pageYOffset);
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <ScrollContext.Provider
      value={{ homeRef, aboutRef, skillRef, contactRef, scrollTo }}
    >
      {children}
    </ScrollContext.Provider>
  );
};
