import { forwardRef, useEffect, useRef, useState } from "react";
import ContactCard from "../components/ContactCard";
import { faPhoneVolume, faCommentDots, faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons";

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
      className="snap-start flex flex-col items-center justify-center pt-24 pb-20 relative" 
      id="contact" 
      style={{ minHeight: "100vh" }} 
      ref={ref}
    >
      <div className="w-[90%] md:max-w-6xl mx-auto flex flex-col items-center" ref={containerRef}>
        
        {/* Title */}
        <div className="animation opacity-0 text-center mb-10 md:mb-24 relative z-10 w-full" style={{ animationFillMode: "both" }}>
          <span className="main-text">
            <span className="text-secondary-1 text-white">Contact</span>
            <span className="text-secondary-2"> Me</span>
          </span>
          <p className="text-gray-400 mt-4 text-sm md:text-lg font-medium tracking-wide max-w-2xl mx-auto px-4">
            Feel free to reach out. I'm always open to discussing new projects or creative ideas.
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-4 lg:gap-12 w-full mt-8">
          <ContactCard 
             type="call"
             title="Call me"
             description="Prefer to talk rather than text? Just tap the button or dial the number below."
             buttonText="0392017345"
             buttonLink="tel:0392017345"
             icon={faPhoneVolume}
          />
          <ContactCard 
             type="message"
             title="Message"
             description="Let's have a quick chat online. I am available across multiple platforms."
             buttonText="Chat Now"
             buttonLink="https://www.facebook.com/lai.trong.1671"
             icon={faCommentDots}
          />
          <ContactCard 
             type="email"
             title="Email"
             description="Drop me an email with the project details and I'll get back to you within 24h."
             buttonText="Send via Gmail"
             buttonLink="https://mail.google.com/mail/?view=cm&fs=1&to=tronglai301@gmail.com"
             icon={faEnvelopeOpenText}
          />
        </div>
      </div>
    </section>
  );
});

export default Contact;
