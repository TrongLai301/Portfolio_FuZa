import { forwardRef, useEffect, useRef, useState } from "react";
import ContactCard from "../components/ContactCard";
import {
  faPhoneVolume,
  faEnvelopeOpenText,
  faPaperPlane,
  faHeart,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Contact = forwardRef<HTMLDivElement>((_, ref) => {
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
            (box as HTMLElement).style.setProperty("--i", `${index * 0.15}s`);
            box.classList.add("delay");
          });
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      className="snap-start flex flex-col items-center justify-center pt-24 pb-24 relative overflow-hidden"
      id="contact"
      style={{ minHeight: "100vh" }}
      ref={ref}
    >
      {/* Decorative Playful Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />

      <div
        className="w-[92%] md:max-w-6xl mx-auto flex flex-col items-center relative z-10"
        ref={containerRef}
      >
        {/* Playful Pill Sub-Badge */}
        <div className="animation opacity-0 flex items-center justify-center gap-2 mb-3">
          <span className="cosmic-badge !bg-pink-500/15 !border-pink-500/30 !text-pink-300">
            <FontAwesomeIcon icon={faComments} />
            <span>(づ｡◕‿‿◕｡)づ Let's Have A Chat!</span>
          </span>
        </div>

        {/* Title */}
        <div
          className="animation opacity-0 text-center mb-10 md:mb-16 relative z-10 w-full"
          style={{ animationFillMode: "both" }}
        >
          <span className="main-text">
            <span className="text-secondary-1">Contact</span>
            <span className="text-secondary-2"> Me</span>
          </span>
          <p className="text-gray-300 mt-4 text-xs sm:text-sm md:text-base font-medium tracking-wide max-w-xl mx-auto px-4 leading-relaxed">
            Got an exciting project, a game invite, or just want to discuss anime & tech? Drop me a ping anytime! ✨
          </p>
        </div>

        {/* 3 Playful Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-5 lg:gap-8 w-full mt-4">
          <ContactCard
            type="call"
            title="Call Me Direct"
            kaomoji="(◕‿◕)੭"
            buttonText="Call: 0392017345"
            buttonLink="tel:0392017345"
            copyValue="0392017345"
            icon={faPhoneVolume}
          />
          <ContactCard
            type="email"
            title="Send An Email"
            kaomoji="(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧"
            buttonText="Open in Gmail"
            buttonLink="https://mail.google.com/mail/?view=cm&fs=1&to=tronglai301@gmail.com"
            copyValue="tronglai301@gmail.com"
            icon={faEnvelopeOpenText}
          />
          <ContactCard
            type="message"
            title="Discord Hangout"
            kaomoji="(つ✧ω✧)つ"
            buttonText="Join Discord Community"
            buttonLink="https://discord.gg/xU2UYY6BBW"
            copyValue="https://discord.gg/xU2UYY6BBW"
            icon={faDiscord}
          />
        </div>

        {/* Bottom Playful Footer Banner */}
        <div className="animation opacity-0 mt-14 text-center flex items-center gap-2 text-xs font-mono text-gray-400">
          <FontAwesomeIcon icon={faPaperPlane} className="text-indigo-400 animate-bounce" />
          <span>Always online, eager to collaborate and build cool things</span>
          <FontAwesomeIcon icon={faHeart} className="text-rose-400 text-[10px]" />
        </div>
      </div>
    </section>
  );
});

export default Contact;
