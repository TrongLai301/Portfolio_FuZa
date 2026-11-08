import Home from "./Home";
import About from "./About/About";
import EntertainmentSection from "./Entertainment/EntertainmentSection";
import CelebratesSection from "./Celebrates/CelebratesSection";
import Skill from "./Skill";
import Contact from "./Contact";
import { useScroll } from "../commons/ScrollContext";

export default function IntroPage() {
  const { homeRef, aboutRef, entertainmentRef, celebratesRef, skillRef, contactRef } = useScroll();
  return (
    <div className="space-y-6 md:space-y-12">
      <Home ref={homeRef} />
      <About ref={aboutRef} />
      <EntertainmentSection ref={entertainmentRef} />
      <CelebratesSection ref={celebratesRef} />
      <Skill ref={skillRef} />
      <Contact ref={contactRef} />
    </div>
  );
}
