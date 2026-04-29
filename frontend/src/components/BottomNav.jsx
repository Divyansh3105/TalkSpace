import { Link, useLocation } from "react-router";
import { BellIcon, HomeIcon, UsersIcon } from "lucide-react";
import useUnreadCounts from "../hooks/useUnreadCounts";

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { totalUnread } = useUnreadCounts();

  return (
    <nav className="fixed bottom-0 w-full bg-base-100/90 backdrop-blur-lg border-t border-base-content/10 z-50 lg:hidden pb-safe">
      <div className="flex justify-around items-center h-16 px-2 sm:px-6">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            currentPath === "/" ? "text-primary" : "text-base-content/60 hover:text-base-content"
          }`}
        >
          <HomeIcon className={`size-5 ${currentPath === "/" ? "fill-primary/20" : ""}`} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <Link
          to="/friends"
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            currentPath === "/friends" ? "text-primary" : "text-base-content/60 hover:text-base-content"
          }`}
        >
          <div className="relative">
            <UsersIcon className={`size-5 ${currentPath === "/friends" ? "fill-primary/20" : ""}`} />
            {totalUnread > 0 && (
              <span className="absolute -top-1.5 -right-2 badge badge-error badge-xs text-[9px] min-w-[16px] h-[16px] flex items-center justify-center">
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Friends</span>
        </Link>

        <Link
          to="/notifications"
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            currentPath === "/notifications" ? "text-primary" : "text-base-content/60 hover:text-base-content"
          }`}
        >
          <div className="relative">
            <BellIcon className={`size-5 ${currentPath === "/notifications" ? "fill-primary/20" : ""}`} />
            {/* Optional: Add a red dot badge here if there are unseen notifications */}
          </div>
          <span className="text-[10px] font-medium">Alerts</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
