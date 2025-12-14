"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button type="button" onClick={toggle} className="win95-button">
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
