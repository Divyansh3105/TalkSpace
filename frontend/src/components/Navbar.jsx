import { Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { LogOutIcon, SettingsIcon } from "lucide-react";
import useLogout from "../hooks/useLogout.js";
import ThemeSelector from "./ThemeSelector.jsx";
import Avatar from "./Avatar";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-100/90 backdrop-blur-md border-b border-base-content/[0.06] sticky top-0 z-30 h-16 flex items-center">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo doubles as the home link on mobile, where the sidebar is hidden */}
        <Link to="/" className="flex items-center gap-2 lg:hidden">
          <img src="/logo.png" alt="" className="size-8 object-contain" />
          <span className="text-lg font-bold tracking-tight">TalkSpace</span>
        </Link>

        <div className="flex items-center gap-1 ml-auto">
          <ThemeSelector />

          <Link
            to="/settings"
            className="btn btn-ghost btn-circle btn-sm sm:btn-md text-base-content/70"
            aria-label="Settings"
            title="Settings"
          >
            <SettingsIcon className="size-5" />
          </Link>

          <button
            className="btn btn-ghost btn-circle btn-sm sm:btn-md text-base-content/70"
            onClick={logoutMutation}
            aria-label="Log out"
            title="Log out"
          >
            <LogOutIcon className="size-5" />
          </button>

          <Link
            to="/profile"
            className="ml-1 sm:ml-2 rounded-full hover:ring-2 ring-primary/50 ring-offset-2 ring-offset-base-100 transition-shadow"
            aria-label="Your profile"
            title="Your profile"
          >
            <Avatar src={authUser?.profilePic} name={authUser?.fullName} className="size-9" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
