import { Outlet } from "react-router-dom";
import Navbar from "../commons/NavBar";
export default function Layout() {
  return (
    <div className="w-full">
      <Navbar />
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
