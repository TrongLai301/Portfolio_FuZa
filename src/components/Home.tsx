import { forwardRef, useEffect, useRef } from "react";
import "../assets/css/home.css";
import TypeIt from "typeit-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faHtml5,
  faCss3Alt,
  faSquareJs,
  faReact,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import nilou from "../assets/image/nilouPr4.png";
import nilou1 from "../assets/image/OpacityNilou.png";

const Home = forwardRef<HTMLDivElement>((props, ref) => {
  const animationLeft = useRef<HTMLDivElement | null>(null);
  const animationRight = useRef<HTMLDivElement | null>(null);

  async function animation(
    element: Element | null | undefined,
    index: number | null,
    animation: string,
    isRemove: boolean
  ): Promise<void> {
    if (element instanceof Element) {
      element.classList.add(animation);
      if (index != null) {
        element.setAttribute("style", `--i:${index}`);
        element.classList.add("delay");
      }
      if (isRemove) {
        await new Promise<void>((resolve) => {
          const handleEnd = () => {
            element.classList.remove(animation);
            if (index != null) element.classList.remove("delay");
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
        animation(box, index, "fade-in-up-left", true);
      } else {
        animation(box, index, "fade-in-up", true);
      }
    });
    const avt = animationRight.current?.querySelector(".big-avt");
    animation(avt, null, "fade-in-right", true).then(() => {
      animation(avt, null, "animation-up-down-blink", false);
    });
    handleMouseenter(avt);

    const orbits = animationRight.current?.querySelectorAll(".orbit-item");
    orbits?.forEach((orbit, index) => {
      animation(orbit, index, "fade-in-up", true).then(() => {
        animation(orbit, index, "animation-up-down", false);
      });
    });
  }, []);

  return (
    <section className="snap-start" id="home" ref={ref}>
      <div className="flex items-center" style={{ minHeight: "90vh" }}>
        <div className="w-2/5" ref={animationLeft}>
          <div className="animation animation-up-left flex items-center mb-2.5">
            <span className="main-text">
              <span className="text-secondary-1 ">Hello,</span>
              <span className="text-secondary-2"> I'm FuZa</span>
            </span>
          </div>
          <div className="animation typewriter mb-2.5 ">
            <TypeIt
              options={{ loop: true }}
              getBeforeInit={(instance) => {
                instance
                  .type("Web-Developer")
                  .pause(2500)
                  .delete()
                  .pause(800)
                  .type("Front-End")
                  .pause(2500)
                  .delete()
                  .pause(800)
                  .type("Back-End")
                  .pause(2500);

                return instance;
              }}
            />
          </div>
          <div className="animation mb-6 ">
            <span className=" text-lg">Some fact about me</span>
          </div>
          <div className=" flex gap-5 ">
            <Link to="https://github.com/TrongLai301" target="_blank">
              <div className="animation contact-icon flex justify-center items-center">
                <FontAwesomeIcon icon={faGithub} />
              </div>
            </Link>
            <Link
              to="https://www.linkedin.com/in/tr%E1%BB%8Dng-l%E1%BA%A1i-61a183316/"
              target="_blank"
            >
              <div className="animation contact-icon flex justify-center items-center">
                <FontAwesomeIcon icon={faLinkedin} />
              </div>
            </Link>
          </div>
        </div>
        <div className="w-3/5" ref={animationRight}>
          <div className="orbit-container">
            <div id="bigAvt" className="big-avt avt-size">
              <img src={nilou} alt="nilou..." className=" avt-size" />
            </div>
            <div className="orbit-item flex justify-center items-center position-1">
              <FontAwesomeIcon icon={faHtml5} />
            </div>
            <div className="orbit-item flex justify-center items-center position-2">
              <FontAwesomeIcon icon={faCss3Alt} />
            </div>
            <div className="orbit-item flex justify-center items-center position-3">
              <FontAwesomeIcon icon={faSquareJs} />
            </div>
            <div className="orbit-item flex justify-center items-center position-4">
              <FontAwesomeIcon icon={faReact} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Home;
