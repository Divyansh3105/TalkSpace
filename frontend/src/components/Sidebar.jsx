import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import useUnreadCounts from "../hooks/useUnreadCounts";
import { BellIcon, HomeIcon, MessageSquareIcon, UsersIcon } from "lucide-react";

const SideBar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const { totalUnread } = useUnreadCounts();

  return (
    <aside className="w-64 bg-base-100/50 backdrop-blur-md border-r border-base-content/5 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-base-content/5">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="TalkSpace"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
            TalkSpace
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case transition-all duration-200 ${
            currentPath === "/" ? "bg-primary/10 text-primary" : "hover:bg-base-content/5"
          }`}
        >
          <HomeIcon className="size-5 text-base-content opacity-70" />
          <span>Home</span>
        </Link>

        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case transition-all duration-200 ${
            currentPath === "/friends" ? "bg-primary/10 text-primary" : "hover:bg-base-content/5"
          }`}
        >
          <UsersIcon className="size-5 text-base-content opacity-70" />
          <span>Friends</span>
          {totalUnread > 0 && (
            <span className="badge badge-error badge-sm ml-auto">
              {totalUnread > 99 ? "99+" : totalUnread}
            </span>
          )}
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case transition-all duration-200 ${
            currentPath === "/notifications" ? "bg-primary/10 text-primary" : "hover:bg-base-content/5"
          }`}
        >
          <BellIcon className="size-5 text-base-content opacity-70" />
          <span>Notifications</span>
        </Link>
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-base-content/5 mt-auto">
        <Link to="/profile" className="flex items-center gap-3 hover:bg-base-content/5 p-2 rounded-xl transition-colors">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default SideBar;
