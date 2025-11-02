import { Outlet } from "react-router-dom";
import Menu from "../commons/Menu";
export default function Layout() {
    return (
    <div>
        <Menu />
        <Outlet />
    </div> 
    );
}