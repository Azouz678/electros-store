"use client"

import { useEffect, useState } from "react"
import { useClientTheme } from "./client-theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useClientTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-2xl border px-3 py-2 text-sm
        hover:bg-black/5 dark:hover:bg-white/10
        transition"
      aria-label="Toggle theme"
      title={theme === "dark" ? "الوضع الفاتح" : "الوضع الليلي"}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  )
}