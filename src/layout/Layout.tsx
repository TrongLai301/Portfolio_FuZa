import { Outlet } from "react-router-dom";
import Navbar from "../commons/NavBar";
import { useScroll } from "../commons/ScrollContext";
import { useScrollSpy } from "../commons/useScrollSpy";
export default function Layout() {
  const { homeRef, aboutRef, skillRef, contactRef, scrollTo } = useScroll();
  const refs = [homeRef, aboutRef, skillRef, contactRef];
  const activeId = useScrollSpy(refs);
  return (
    <div className="w-full">
      <Navbar
        activeId={activeId}
        onScrollToHome={() => scrollTo(homeRef)}
        onScrollToAbout={() => scrollTo(aboutRef)}
        onScrollToSkill={() => scrollTo(skillRef)}
        onScrollToContact={() => scrollTo(contactRef)}
      />
      <div className="w-full max-w-4/5 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen relative">
          <div className="fixed inset-0 -z-1 bg-partternCraft" />
          <div className="">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
