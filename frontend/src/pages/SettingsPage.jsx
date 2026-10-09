import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";
import { CheckIcon } from "lucide-react";

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-base-content/60 mt-1 text-sm">
            Choose how TalkSpace looks.
          </p>
        </header>

        <section className="panel p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Appearance</h2>
          <p className="text-sm text-base-content/60 mt-1 mb-5">
            Choose a theme that suits your style. The app will automatically adapt.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {THEMES.map(({ name, label }) => {
              const isActive = theme === name;
              return (
                <button
                  key={name}
                  onClick={() => setTheme(name)}
                  aria-pressed={isActive}
                  className={`group text-left rounded-xl p-1 ring-2 transition-shadow ${
                    isActive ? "ring-primary" : "ring-transparent hover:ring-base-content/20"
                  }`}
                >
                  {/* Miniature of the app, rendered in the theme itself */}
                  <div
                    data-theme={name}
                    className="rounded-lg overflow-hidden border border-base-content/10 bg-base-100"
                  >
                    <div className="flex h-14">
                      <div className="w-1/4 bg-base-200" />
                      <div className="flex-1 p-2 space-y-1.5">
                        <div className="h-1.5 w-3/4 rounded-full bg-base-content/70" />
                        <div className="h-1.5 w-1/2 rounded-full bg-base-content/25" />
                        <div className="flex gap-1 pt-0.5">
                          <div className="h-3 w-6 rounded bg-primary" />
                          <div className="h-3 w-3 rounded bg-secondary" />
                          <div className="h-3 w-3 rounded bg-accent" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-1.5 pt-2 pb-1">
                    <span className={`text-sm ${isActive ? "font-semibold text-primary" : "font-medium"}`}>
                      {label}
                    </span>
                    {isActive && <CheckIcon className="size-4 text-primary" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
