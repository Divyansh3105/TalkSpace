import Navbar from "./Navbar";
import SideBar from "./Sidebar";
import BottomNav from "./BottomNav";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen flex">
      {showSidebar && <SideBar />}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar />
        {/* pb-16 lg:pb-0 ensures content doesn't get hidden behind the BottomNav on mobile */}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">{children}</main>
        {showSidebar && <BottomNav />}
      </div>
    </div>
  );
};

export default Layout;
