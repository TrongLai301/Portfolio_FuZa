import { forwardRef, useEffect, useRef } from "react";
import GeneralContent from "./components/GeneralContent";

const About = forwardRef<HTMLDivElement>((_, ref) => {
  const localRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-up");
            entry.target.classList.remove("opacity-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    const elements = localRef.current?.querySelectorAll(".animation");
    elements?.forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="snap-start flex flex-col items-center justify-center pt-24 pb-20 w-full"
      id="about"
      style={{ minHeight: "100vh" }}
      ref={ref}
    >
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6" ref={localRef}>
        {/* Title */}
        <div className="animation opacity-0 text-center mb-10 md:mb-14">
          <span className="main-text">
            <span className="text-secondary-1">About</span>
            <span className="text-secondary-2"> Me</span>
          </span>
          <p className="text-gray-400 mt-4 text-sm sm:text-base font-medium tracking-wide">
            Here's some information & personal background about me.
          </p>
        </div>

        {/* Content (Frameless - Clean and seamless) */}
        <div
          className="animation opacity-0 w-full relative"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          <GeneralContent />
        </div>
      </div>
    </section>
  );
});

export default About;
