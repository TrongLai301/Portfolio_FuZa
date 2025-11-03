import "./../assets/css/navbar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
export default function Navbar() {
  return (
    <div className="navbar-edit sticky top-0 w-full backdrop-blur-md">
      <div className="flex justify-between max-w-4/5 mx-auto py-4">
        <div className="flex items-center gap-2 signature">
          <span className="blink-text text-nav">FuZa portfolio</span>
          <FontAwesomeIcon className="text-nav signature-icon" icon={faCode}/>
        </div>
        <div className="menu flex items-center max-w-1/3">
          <nav>
            <ul className="menu-list-items flex items-center gap-6">
              <li className="text-nav">Home</li>
              <li className="text-nav">About</li>
              <li className="text-nav">Contact</li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
