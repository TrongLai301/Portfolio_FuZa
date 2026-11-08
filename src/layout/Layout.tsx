import { Outlet } from "react-router-dom";
import Navbar from "../commons/NavBar";
import { useScroll } from "../commons/ScrollContext";
import { useScrollSpy } from "../commons/useScrollSpy";
export default function Layout() {
  const { homeRef, aboutRef, entertainmentRef, celebratesRef, skillRef, contactRef, scrollTo } = useScroll();
  const refs = [homeRef, aboutRef, entertainmentRef, celebratesRef, skillRef, contactRef];
  const activeId = useScrollSpy(refs);
  return (
    <div className="w-full">
      <Navbar
        activeId={activeId}
        onScrollToHome={() => scrollTo(homeRef)}
        onScrollToAbout={() => scrollTo(aboutRef)}
        onScrollToEntertainment={() => scrollTo(entertainmentRef)}
        onScrollToCelebrates={() => scrollTo(celebratesRef)}
        onScrollToSkill={() => scrollTo(skillRef)}
        onScrollToContact={() => scrollTo(contactRef)}
      />
      <div className="w-full lg:max-w-4/5 lg:mx-auto lg:px-8">
        <div className="min-h-screen relative">
          <div className="">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
