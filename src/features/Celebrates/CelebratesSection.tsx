import { forwardRef, useEffect, useRef, useState } from "react";
import CelebrateContent from "../About/components/CelebrateContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faHeart } from "@fortawesome/free-solid-svg-icons";

const CelebratesSection = forwardRef<HTMLDivElement>((_, ref) => {
  const localRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    const target = localRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="celebrates"
      ref={ref}
      className="snap-start flex flex-col items-center justify-center pt-24 pb-20 w-full relative"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-6" ref={localRef}>
        {/* Title */}
        <div className={`text-center mb-8 md:mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold mb-3">
            <FontAwesomeIcon icon={faCamera} />
            <span>Memory Scrapbook & Archive</span>
          </div>

          <span className="main-text">
            <span className="text-secondary-1">Special</span>
            <span className="text-secondary-2"> Celebrates</span>
          </span>

          <p className="text-gray-400 mt-4 text-sm md:text-base font-medium tracking-wide max-w-xl mx-auto px-4 flex items-center justify-center gap-1.5">
            <span>Precious memories, road trips, and animated highlights with friends</span>
            <FontAwesomeIcon icon={faHeart} className="text-rose-400 text-xs inline" />
          </p>
        </div>

        {/* Scattered Scrapbook (Frameless - Polaroids pop in randomly one by one) */}
        <div className="w-full relative">
          <CelebrateContent isVisible={isVisible} />
        </div>
      </div>
    </section>
  );
});

export default CelebratesSection;
