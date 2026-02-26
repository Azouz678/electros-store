"use client";

import { useEffect, useState } from "react";
import { useClientTheme } from "./client-theme-provider";

export function ThemeToggle() {
  const ctx = useClientTheme()
  const { theme, toggleTheme } = ctx
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <button
      type="button"
      onClick={() => toggleTheme()}
      className="rounded-2xl border px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  )
}