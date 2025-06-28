import { Outlet} from "react-router-dom";
import TopBar from "../components/MainNav/topbar";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <nav>
      <TopBar/>
      </nav>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
};

export default Layout;