import { forwardRef, useEffect, useRef } from "react";

interface AboutCardProps {
  imageSrc: string;
  title: string;
  description?: string;
  delay?: number; // For animation delay
  onClick?: () => void;
}

const AboutCard = forwardRef<HTMLDivElement, AboutCardProps>(
  ({ imageSrc, title, description, delay = 0, onClick }, ref) => {
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
        { threshold: 0.1 }
      );

      if (localRef.current) {
        localRef.current.classList.add("opacity-0");
        localRef.current.classList.remove("fade-in-up");
        observer.observe(localRef.current);
      }

      return () => observer.disconnect();
    }, []);

    const setRefs = (element: HTMLDivElement) => {
      localRef.current = element;
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
      }
    };

    return (
      <div 
        ref={setRefs}
        onClick={onClick}
        className="opacity-0 group relative w-full h-[400px] min-h-[400px] shrink-0 bg-[#1a1d2e] rounded-2xl overflow-hidden cursor-pointer shadow-[1px_1px_4px_0px_#000000] hover:shadow-[0_0_4px_2px_#f6eaea] transition-all duration-500 hover:scale-[1.04] hover:z-10"
        style={{ animationDelay: `${delay}s`, animationFillMode: "both" }}
      >
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-30 flex items-center justify-center text-gray-500" 
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <h3 className="text-2xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            {title}
          </h3>
          {description && (
            <p className="text-gray-300 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }
);

export default AboutCard;
