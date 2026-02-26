"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

type Theme = "light" | "dark"

type Ctx = {
  theme: Theme
  setTheme: (t: Theme) => void
}

const ClientThemeContext = createContext<Ctx | null>(null)
const STORAGE_KEY = "client-theme"

export function ClientThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")

  // Load saved theme on mount
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null
      if (saved === "dark" || saved === "light") setTheme(saved)
    } catch {}
  }, [])

  // Keep multiple tabs in sync
  useEffect(() => {
    if (typeof window === "undefined") return
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return
      const v = e.newValue as Theme | null
      if (v === "dark" || v === "light") setTheme(v)
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  // Apply theme to <html> and persist
  useEffect(() => {
    if (typeof window === "undefined") return

    const root = document.documentElement
    if (theme === "dark") root.classList.add("dark")
    else root.classList.remove("dark")

    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {}
  }, [theme])

  const value = useMemo<Ctx>(() => ({ theme, setTheme }), [theme])

  return <ClientThemeContext.Provider value={value}>{children}</ClientThemeContext.Provider>
}

export function useClientTheme() {
  const ctx = useContext(ClientThemeContext)
  if (!ctx) throw new Error("useClientTheme must be used within ClientThemeProvider")
  return ctx
}