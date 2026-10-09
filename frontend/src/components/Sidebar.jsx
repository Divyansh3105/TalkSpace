import { Link, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import useUnreadCounts from "../hooks/useUnreadCounts";
import { getFriendRequests } from "../lib/api";
import { BellIcon, HomeIcon, UsersIcon } from "lucide-react";
import Avatar from "./Avatar";

const NavItem = ({ to, icon, label, count, active }) => (
  <Link
    to={to}
    aria-current={active ? "page" : undefined}
    className={`flex items-center gap-3 h-10 px-3 rounded-xl text-sm font-medium transition-colors duration-150 ${
      active
        ? "bg-primary/10 text-primary"
        : "text-base-content/70 hover:bg-base-content/5 hover:text-base-content"
    }`}
  >
    {icon}
    <span>{label}</span>
    {count > 0 && (
      <span className="badge badge-error badge-sm ml-auto tabular-nums">
        {count > 99 ? "99+" : count}
      </span>
    )}
  </Link>
);

const SideBar = () => {
  const { authUser } = useAuthUser();
  const { pathname } = useLocation();
  const { totalUnread } = useUnreadCounts();
  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });
  const pendingRequests = friendRequests?.incomingReqs?.length ?? 0;

  return (
    <aside className="w-64 bg-base-200/40 border-r border-base-content/[0.06] hidden lg:flex flex-col h-screen sticky top-0">
      <div className="h-16 px-5 flex items-center">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            className="size-8 object-contain"
          />
          <span className="text-xl font-bold tracking-tight">TalkSpace</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <NavItem to="/" icon={<HomeIcon className="size-5" />} label="Home" active={pathname === "/"} />
        <NavItem
          to="/friends"
          icon={<UsersIcon className="size-5" />}
          label="Friends"
          count={totalUnread}
          active={pathname === "/friends" || pathname.startsWith("/chat/")}
        />
        <NavItem
          to="/notifications"
          icon={<BellIcon className="size-5" />}
          label="Notifications"
          count={pendingRequests}
          active={pathname === "/notifications"}
        />
      </nav>

      <div className="p-3 border-t border-base-content/[0.06]">
        <Link
          to="/profile"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-base-content/5 transition-colors"
        >
          <Avatar
            src={authUser?.profilePic}
            name={authUser?.fullName}
            className="size-9"
            isOnline
          />
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{authUser?.fullName}</p>
            <p className="text-xs text-base-content/60">View profile</p>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default SideBar;
