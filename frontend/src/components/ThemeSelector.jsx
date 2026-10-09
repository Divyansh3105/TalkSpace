import { CheckIcon, PaletteIcon } from "lucide-react";
import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";

// Swatches render inside the theme itself, so they always match what you get.
const ThemeSwatches = ({ name, className = "size-2" }) => (
  <span data-theme={name} className="flex gap-1 bg-transparent">
    {["bg-base-100", "bg-primary", "bg-secondary", "bg-accent"].map((bg) => (
      <span key={bg} className={`${className} ${bg} rounded-full ring-1 ring-base-content/15`} />
    ))}
  </span>
);

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();
  return (
    <div className="dropdown dropdown-end">
      <button
        tabIndex={0}
        className="btn btn-ghost btn-circle btn-sm sm:btn-md text-base-content/70"
        aria-label="Change theme"
        title="Change theme"
      >
        <PaletteIcon className="size-5" />
      </button>

      <ul
        tabIndex={0}
        className="dropdown-content z-40 mt-2 p-1.5 shadow-xl shadow-black/20 bg-base-200 rounded-2xl w-56 border border-base-content/10 max-h-80 overflow-y-auto"
      >
        {THEMES.map(({ name, label }) => {
          const isActive = theme === name;
          return (
            <li key={name}>
              <button
                className={`w-full px-3 py-2 rounded-xl flex items-center gap-3 text-sm transition-colors ${
                  isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-base-content/5"
                }`}
                onClick={() => setTheme(name)}
              >
                <ThemeSwatches name={name} />
                <span>{label}</span>
                {isActive && <CheckIcon className="size-4 ml-auto" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ThemeSelector;
