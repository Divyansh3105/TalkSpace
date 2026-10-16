import Navbar from "./Navbar";
import SideBar from "./Sidebar";
import BottomNav from "./BottomNav";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen flex">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 btn btn-primary btn-sm"
      >
        Skip to content
      </a>
      {showSidebar && <SideBar />}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar />
        {/* pb-16 lg:pb-0 ensures content doesn't get hidden behind the BottomNav on mobile */}
        <main id="main" tabIndex={-1} className="flex-1 overflow-y-auto pb-16 lg:pb-0 focus:outline-none">{children}</main>
        {showSidebar && <BottomNav />}
      </div>
    </div>
  );
};

export default Layout;
