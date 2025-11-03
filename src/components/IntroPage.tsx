import Skill from "./Skill"
import About from "./about"
import { useScroll } from "../commons/ScrollContext";
import Contact from "./Contact";
import Home from "./Home";

export default function IntroPage() {
  const { homeRef, aboutRef, skillRef, contactRef } = useScroll();
  return (
    <div className="">
      <Home ref={homeRef} />
      <About ref={aboutRef} />
      <Skill ref={skillRef} />
      <Contact ref={contactRef}/>
    </div>
  )
}