"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  function toggleTheme() {
    const nextTheme = !isDark;

    setIsDark(nextTheme);

    if (nextTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <button
      type="button"
      className="theme-switcher"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}