"use client";

import { useEffect, useState } from "react";
import { useClientTheme } from "./client-theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useClientTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`rounded-2xl border px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 ${
          theme === "dark" ? "font-bold" : ""
        }`}
        aria-label="Dark mode"
      >
        🌙
      </button>

      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`rounded-2xl border px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 ${
          theme === "light" ? "font-bold" : ""
        }`}
        aria-label="Light mode"
      >
        ☀️
      </button>
    </div>
  )
}