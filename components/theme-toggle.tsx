"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const current = theme === "system" ? systemTheme : theme;

  return (
    <button
      type="button"
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      className="rounded-2xl border px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
      aria-label="Toggle theme"
    >
      {current === "dark" ? "☀️" : "🌙"}
    </button>
  );
}