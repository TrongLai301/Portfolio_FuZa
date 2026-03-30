import { forwardRef, useEffect, useRef, useState } from "react";
import SkillCard from "../components/SkillCard";
import { skillService, type Skill as SkillType } from "../services/skillService";
import * as BrandIcons from "@fortawesome/free-brands-svg-icons";
import * as SolidIcons from "@fortawesome/free-solid-svg-icons";

// Helper to get FA icon by string name
const getIcon = (iconName: string) => {
  // @ts-ignore
  return BrandIcons[iconName] || SolidIcons[iconName] || SolidIcons.faCircleQuestion;
};

const Skill = forwardRef<HTMLDivElement>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [skills, setSkills] = useState<SkillType[]>([]);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await skillService.getSkills();
        setSkills(data);
      } catch (err) {
        console.error("Failed to load skills:", err);
      }
    };
    loadSkills();
  }, []);

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

  return (
    <section 
      className="snap-start pt-24 pb-20 overflow-hidden flex flex-col items-center justify-center" 
      id="skills" 
      style={{ minHeight: "100vh" }} 
      ref={ref}
    >
      <div ref={containerRef} className="flex flex-col items-center w-full">
        {/* Tiêu đề */}
        <div className="animation opacity-0 text-center mb-20 relative z-10 w-full" style={{ animationFillMode: "both" }}>
          <span className="main-text">
            <span className="text-secondary-1 text-white">My</span>
            <span className="text-secondary-2"> Skills</span>
          </span>
        </div>
        
        {/* Infinite Marquee Wrapper */}
        <div 
          className="animation opacity-0 w-full relative overflow-hidden marquee-container flex flex-nowrap mask-[linear-gradient(to_right,transparent_0,black_128px,black_calc(100%-128px),transparent_100%)]"
          style={{ animationFillMode: "both" }}
        >
          {skills.length > 0 ? (
            <>
              {/* First Marquee Layer */}
              <ul className="flex items-center justify-center animate-marquee min-w-full shrink-0">
                {skills.map((skill, index) => (
                  <li key={skill.id + index} className="mx-2 md:mx-4 lg:mx-6 py-10 px-4">
                    <SkillCard 
                      name={skill.name}
                      icon={getIcon(skill.icon_name)}
                      color={skill.color_code}
                    />
                  </li>
                ))}
              </ul>
              {/* Second Duplicate Marquee Layer for seamless loop */}
              <ul className="flex items-center justify-center animate-marquee min-w-full shrink-0" aria-hidden="true">
                {skills.map((skill, index) => (
                  <li key={skill.id + "-dup-" + index} className="mx-2 md:mx-4 lg:mx-6 py-10 px-4">
                    <SkillCard 
                      name={skill.name}
                      icon={getIcon(skill.icon_name)}
                      color={skill.color_code}
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-20 opacity-20">
               <p className="text-sm uppercase tracking-widest text-white">Experience Void - No signals detected</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

export default Skill;