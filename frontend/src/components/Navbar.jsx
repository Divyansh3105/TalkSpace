import { Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, SettingsIcon } from "lucide-react";
import useLogout from "../hooks/useLogout.js";
import ThemeSelector from "./ThemeSelector.jsx";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-base-content/10 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          {/* LOGO - ALWAYS VISIBLE FOR BRANDING AND MOBILE HOME LINK */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <img
                src="/logo.png"
                alt="TalkSpace"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary hidden xs:block">
                TalkSpace
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-4 ml-auto">
            <Link to={"/notifications"} title="Notifications">
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>

            {/* THEME SELECTOR RESTORED BY USER REQUEST */}
            <ThemeSelector />

            <Link to={"/settings"} title="Settings">
              <button className="btn btn-ghost btn-circle">
                <SettingsIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>

            <Link
              to={"/profile"}
              className="avatar cursor-pointer hover:ring-2 ring-primary ring-offset-2 ring-offset-base-100 rounded-full transition-all"
              title="Profile"
            >
              <div className="w-9 rounded-full">
                <img
                  src={authUser?.profilePic}
                  alt="User Avatar"
                  rel="noreferrer"
                />
              </div>
            </Link>

            {/* Logout button */}
            <button
              className="btn btn-ghost btn-circle"
              onClick={logoutMutation}
              title="Logout"
            >
              <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
