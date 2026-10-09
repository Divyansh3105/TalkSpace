import { Link, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { BellIcon, HomeIcon, UsersIcon } from "lucide-react";
import useUnreadCounts from "../hooks/useUnreadCounts";
import { getFriendRequests } from "../lib/api";

const Tab = ({ to, icon, label, count, active }) => (
  <Link
    to={to}
    aria-current={active ? "page" : undefined}
    className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
      active ? "text-primary" : "text-base-content/60 hover:text-base-content"
    }`}
  >
    <span className="relative">
      {icon}
      {count > 0 && (
        <span className="absolute -top-1.5 -right-2.5 badge badge-error badge-xs h-4 min-w-4 px-1 text-[10px] tabular-nums">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </span>
    <span className="text-[11px] font-medium">{label}</span>
  </Link>
);

const BottomNav = () => {
  const { pathname } = useLocation();
  const { totalUnread } = useUnreadCounts();
  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });
  const pendingRequests = friendRequests?.incomingReqs?.length ?? 0;

  return (
    <nav className="fixed bottom-0 w-full bg-base-100/95 backdrop-blur-lg border-t border-base-content/[0.06] z-50 lg:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16 px-2 sm:px-6">
        <Tab to="/" icon={<HomeIcon className="size-5" />} label="Home" active={pathname === "/"} />
        <Tab
          to="/friends"
          icon={<UsersIcon className="size-5" />}
          label="Friends"
          count={totalUnread}
          active={pathname === "/friends" || pathname.startsWith("/chat/")}
        />
        <Tab
          to="/notifications"
          icon={<BellIcon className="size-5" />}
          label="Alerts"
          count={pendingRequests}
          active={pathname === "/notifications"}
        />
      </div>
    </nav>
  );
};

export default BottomNav;
