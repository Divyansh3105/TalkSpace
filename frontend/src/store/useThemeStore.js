import { create } from "zustand";

const savedTheme = localStorage.getItem("TalkSpaceTheme") || "forest";
// Apply theme to <html> immediately so overscroll area matches the theme
document.documentElement.setAttribute("data-theme", savedTheme);

export const useThemeStore = create((set) => ({
  theme: savedTheme,
  setTheme: (theme) => {
    localStorage.setItem("TalkSpaceTheme", theme);
    // Keep <html> in sync so overscroll background is always correct
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  },
}));
