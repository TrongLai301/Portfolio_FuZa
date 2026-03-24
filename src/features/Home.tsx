import { forwardRef, useEffect, useRef } from "react";
import "../assets/css/home.css";
import TypeIt from "typeit-react";

import {
  faGithub,
  faLinkedin,
  faHtml5,
  faCss3Alt,
  faSquareJs,
  faReact,
  faFacebook,
  faInstagram,
  faTiktok
} from "@fortawesome/free-brands-svg-icons";
import SocialIcon from "../components/SocialIcon";
import OrbitIcon from "../components/OrbitIcon";
import MusicPlayer from "../components/MusicPlayer";
import nilou from "../assets/image/nilouPr4.png";

const Home = forwardRef<HTMLDivElement>((_, ref) => {
  const animationLeft = useRef<HTMLDivElement | null>(null);
  const animationRight = useRef<HTMLDivElement | null>(null);

  async function animation(
    element: Element | null | undefined,
    delay: number | null,
    animation: string,
    isRemove: boolean
  ): Promise<void> {
    if (element instanceof Element) {
      element.classList.add(animation);
      if (delay != null) {
        (element as HTMLElement).style.setProperty("--i", `${delay}s`);
        element.classList.add("delay");
      }
      if (isRemove) {
        await new Promise<void>((resolve) => {
          const handleEnd = () => {
            element.classList.remove(animation);
            if (delay != null) element.classList.remove("delay");
            element.removeEventListener("animationend", handleEnd);
            resolve();
          };
          element.addEventListener("animationend", handleEnd);
        });
      }
    }
  }

  async function handleMouseenter(
    element: Element | null | undefined
  ): Promise<void> {
    if (!(element instanceof Element)) return;
    element.addEventListener("mouseenter", () => {
      element.classList.add("paused");
    });
    element.addEventListener("mouseleave", () => {
      element.classList.remove("paused");
    });
  }
  useEffect(() => {
    const leftdiv = animationLeft.current?.querySelectorAll(".animation");
    leftdiv?.forEach((box, index) => {
      if (box.classList.contains("animation-up-left")) {
        animation(box, null, "fade-in-up-left", true);
      } else {
        animation(box, index * 0.1, "fade-in-up", true);
      }
    });
    const avt = animationRight.current?.querySelector(".big-avt");
    animation(avt, null, "fade-in-right", true).then(() => {
      animation(avt, null, "animation-up-down-blink", false);
    });
    handleMouseenter(avt);

    const orbits = animationRight.current?.querySelectorAll(".orbit-item");
    orbits?.forEach((orbit, index) => {
      animation(orbit, index * 0.1, "fade-in-up", true).then(() => {
        animation(orbit, index * 0.2, "animation-up-down", false);
      });
      handleMouseenter(orbit);
    });

    const musicPlayer = animationRight.current?.querySelector(".music-player-bar");
    if (musicPlayer) {
      animation(musicPlayer, 0.8, "fade-in-up", true);
    }
  }, []);

  return (
    <section className="snap-start" id="home" ref={ref}>
      <div className="flex items-center" style={{ minHeight: "90vh" }}>
        <div className="w-2/5" ref={animationLeft}>
          <div className="animation animation-up-left flex items-center">
            <span className="main-text">
              <span className="text-secondary-1 ">Hello,</span>
              <span className="text-secondary-2"> I'm FuZa</span>
            </span>
          </div>
          <div className="animation typewriter mb-8 ">
            <TypeIt
              options={{ loop: true }}
              getBeforeInit={(instance) => {
                instance
                  .type("Web-Developer")
                  .pause(2500)
                  .delete()
                  .pause(800)
                  .type("Full-stack")
                  .pause(2500)
                  .delete()
                  .pause(800)
                  .type("Love Anime")
                  .pause(2500);

                return instance;
              }}
            />
          </div>
          <div className="animation mb-8 ">
            <span className=" text-lg">
              A passionate developer who loves building modern and responsive
              web applications using React, Java, and JavaScript.
            </span>
          </div>
          <div className=" flex gap-4 items-center">
            <span className="animation ">Follow me:</span>
            <SocialIcon to="https://github.com/TrongLai301" icon={faGithub} />
            <SocialIcon
              to="https://www.linkedin.com/in/tr%E1%BB%8Dng-l%E1%BA%A1i-61a183316/"
              icon={faLinkedin}
            />
            <SocialIcon to="https://www.facebook.com/lai.trong.1671" icon={faFacebook} />
            <SocialIcon to="https://www.instagram.com/tronglai_04/" icon={faInstagram} />
            <SocialIcon to="https://www.tiktok.com/@fuza04" icon={faTiktok} />
          </div>
        </div>
        <div className="w-3/5" ref={animationRight}>
          <div className="orbit-container">
            <div id="bigAvt" className="big-avt avt-size">
              <img src={nilou} alt="nilou..." className=" avt-size" />
            </div>
            {[faHtml5, faCss3Alt, faSquareJs, faReact].map((icon, index, arr) => (
              <OrbitIcon 
                key={index} 
                icon={icon} 
                angle={(index * 360) / arr.length - 45} 
                radius={180} 
              />
            ))}
          </div>
          <MusicPlayer />
        </div>
      </div>
    </section>
  );
});

export default Home;
