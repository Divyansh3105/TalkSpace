import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";
import { BellIcon, CheckCircle2Icon, LockIcon, PaletteIcon } from "lucide-react";

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-5xl space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Settings
            </h1>
            <p className="text-base-content/60 mt-1 text-sm">
              Manage your preferences and app appearance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings Column (Themes) */}
          <div className="lg:col-span-2 space-y-6">
            <section className="glass-panel p-6 rounded-2xl">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <PaletteIcon className="size-5 text-primary" />
                Appearance
              </h2>
              <p className="text-sm opacity-70 mb-6">
                Choose a theme that suits your style. The app will automatically
                adapt.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {THEMES.map((themeOption) => {
                  const isActive = theme === themeOption.name;
                  return (
                    <button
                      key={themeOption.name}
                      onClick={() => setTheme(themeOption.name)}
                      className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                        isActive
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                          : "border-base-content/10 hover:border-primary/50 hover:bg-base-content/5"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute -top-2 -right-2">
                          <CheckCircle2Icon className="size-5 text-primary bg-base-100 rounded-full" />
                        </div>
                      )}

                      <div className="flex justify-center gap-1.5">
                        {themeOption.colors.map((color, i) => (
                          <div
                            key={i}
                            className="size-4 md:size-5 rounded-full shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        {themeOption.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Side Settings Column (Preferences) */}
          <div className="space-y-6">
            <section className="glass-panel p-6 rounded-2xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BellIcon className="size-5 text-primary" />
                Notifications
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">In-App Sounds</p>
                    <p className="text-xs opacity-70">Play sound on new messages</p>
                  </div>
                  <input type="checkbox" className="toggle toggle-primary toggle-sm" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Desktop Alerts</p>
                    <p className="text-xs opacity-70">Show push notifications</p>
                  </div>
                  <input type="checkbox" className="toggle toggle-primary toggle-sm" />
                </div>
              </div>
            </section>

            <section className="glass-panel p-6 rounded-2xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <LockIcon className="size-5 text-primary" />
                Privacy
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Online Status</p>
                    <p className="text-xs opacity-70">Let friends see when you're online</p>
                  </div>
                  <input type="checkbox" className="toggle toggle-primary toggle-sm" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Read Receipts</p>
                    <p className="text-xs opacity-70">Show when you've read messages</p>
                  </div>
                  <input type="checkbox" className="toggle toggle-primary toggle-sm" defaultChecked />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
