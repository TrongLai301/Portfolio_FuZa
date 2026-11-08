import { forwardRef, useEffect, useRef, useState } from "react";
import SkillCard from "../components/SkillCard";
import * as BrandIcons from "@fortawesome/free-brands-svg-icons";
import * as SolidIcons from "@fortawesome/free-solid-svg-icons";
import { usePortfolio } from "../commons/PortfolioContext";

// Helper to get FA icon by string name
const getIcon = (iconName: string) => {
  return (BrandIcons as any)[iconName] || (SolidIcons as any)[iconName] || SolidIcons.faCircleQuestion;
};

const Skill = forwardRef<HTMLDivElement>((_, ref) => {
  const { skills } = usePortfolio();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          const elements = containerRef.current?.querySelectorAll(".animation");
          elements?.forEach((box, index) => {
            box.classList.remove("opacity-0");
            box.classList.add("fade-in-up");
            (box as HTMLElement).style.setProperty("--i", `${index * 0.2}s`);
            box.classList.add("delay");
          });
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAnimated, skills]);

  // Split skills into two rows for opposing marquee directions
  const row1 = skills.filter((_, i) => i % 2 === 0);
  const row2 = skills.filter((_, i) => i % 2 !== 0);
  const firstRow = row1.length >= 2 ? row1 : skills;
  const secondRow = row2.length >= 2 ? row2 : [...skills].reverse();

  return (
    <section 
      className="snap-start pt-24 pb-20 overflow-hidden flex flex-col items-center justify-center" 
      id="skills" 
      style={{ minHeight: "100vh" }} 
      ref={ref}
    >
      <div ref={containerRef} className="flex flex-col items-center w-full">
        {/* Tiêu đề */}
        <div className="animation opacity-0 text-center mb-16 relative z-10 w-full" style={{ animationFillMode: "both" }}>
          <span className="main-text">
            <span className="text-secondary-1">My</span>
            <span className="text-secondary-2"> Skills</span>
          </span>
          <p className="text-gray-400 mt-3 text-xs sm:text-sm font-medium tracking-wide">
            Technologies & tools powering my digital craftsmanship
          </p>
        </div>
        
        {skills.length > 0 ? (
          <div className="w-full space-y-6">
            {/* Row 1: Right to Left */}
            <div 
              className="animation opacity-0 w-full relative overflow-hidden marquee-container flex flex-nowrap mask-[linear-gradient(to_right,transparent_0,black_128px,black_calc(100%-128px),transparent_100%)]"
              style={{ animationFillMode: "both" }}
            >
              <ul className="flex items-center justify-center animate-marquee min-w-full shrink-0">
                {firstRow.map((skill, index) => (
                  <li key={"r1-" + skill.id + index} className="mx-2 md:mx-4 lg:mx-6 py-4 px-2">
                    <SkillCard 
                      name={skill.name}
                      icon={getIcon(skill.icon_name)}
                      color={skill.color_code}
                    />
                  </li>
                ))}
              </ul>
              <ul className="flex items-center justify-center animate-marquee min-w-full shrink-0" aria-hidden="true">
                {firstRow.map((skill, index) => (
                  <li key={"r1-dup-" + skill.id + index} className="mx-2 md:mx-4 lg:mx-6 py-4 px-2">
                    <SkillCard 
                      name={skill.name}
                      icon={getIcon(skill.icon_name)}
                      color={skill.color_code}
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* Row 2: Left to Right (Reverse) */}
            <div 
              className="animation opacity-0 w-full relative overflow-hidden marquee-container flex flex-nowrap mask-[linear-gradient(to_right,transparent_0,black_128px,black_calc(100%-128px),transparent_100%)]"
              style={{ animationFillMode: "both" }}
            >
              <ul className="flex items-center justify-center animate-marquee-reverse min-w-full shrink-0">
                {secondRow.map((skill, index) => (
                  <li key={"r2-" + skill.id + index} className="mx-2 md:mx-4 lg:mx-6 py-4 px-2">
                    <SkillCard 
                      name={skill.name}
                      icon={getIcon(skill.icon_name)}
                      color={skill.color_code}
                    />
                  </li>
                ))}
              </ul>
              <ul className="flex items-center justify-center animate-marquee-reverse min-w-full shrink-0" aria-hidden="true">
                {secondRow.map((skill, index) => (
                  <li key={"r2-dup-" + skill.id + index} className="mx-2 md:mx-4 lg:mx-6 py-4 px-2">
                    <SkillCard 
                      name={skill.name}
                      icon={getIcon(skill.icon_name)}
                      color={skill.color_code}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-20 opacity-20">
             <p className="text-sm uppercase tracking-widest text-white">Experience Void - No signals detected</p>
          </div>
        )}
      </div>
    </section>
  );
});

export default Skill;