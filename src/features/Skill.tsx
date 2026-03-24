import { forwardRef, useEffect, useRef, useState } from "react";
import SkillCard from "../components/SkillCard";
import {
  faGithub,
  faGitlab,
  faJava,
  faHtml5,
  faCss3Alt,
  faReact,
  faVuejs,
} from "@fortawesome/free-brands-svg-icons";
import {
  faLeaf,
  faLayerGroup,
  faWind,
  faBolt
} from "@fortawesome/free-solid-svg-icons";

const skillsData = [
  { name: "Java", icon: faJava, color: "#f89820" },
  { name: "Spring Boot", icon: faLeaf, color: "#6db33f" },
  { name: "HTML", icon: faHtml5, color: "#e34c26" },
  { name: "CSS", icon: faCss3Alt, color: "#264de4" },
  { name: "ReactJs", icon: faReact, color: "#61dafb" },
  { name: "Vue", icon: faVuejs, color: "#4fc08d" },
  { name: "Material UI", icon: faLayerGroup, color: "#0081cb" },
  { name: "Tailwind", icon: faWind, color: "#38bdf8" },
  { name: "Vite", icon: faBolt, color: "#646cff" },
  { name: "Github", icon: faGithub, color: "#ffffff" },
  { name: "Gitlab", icon: faGitlab, color: "#fc6d26" },
];

const Skill = forwardRef<HTMLDivElement>((_, ref) => {
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
  }, [hasAnimated]);

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
          {/* First Marquee Layer */}
          <ul className="flex items-center justify-center animate-marquee min-w-full shrink-0">
            {skillsData.map((skill, index) => (
              <li key={skill.name + index} className="mx-6 py-10 px-4">
                <SkillCard 
                  name={skill.name}
                  icon={skill.icon}
                  color={skill.color}
                />
              </li>
            ))}
          </ul>
          {/* Second Duplicate Marquee Layer for seamless loop */}
          <ul className="flex items-center justify-center animate-marquee min-w-full shrink-0" aria-hidden="true">
            {skillsData.map((skill, index) => (
              <li key={skill.name + "-dup-" + index} className="mx-6 py-10 px-4">
                <SkillCard 
                  name={skill.name}
                  icon={skill.icon}
                  color={skill.color}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
});

export default Skill;