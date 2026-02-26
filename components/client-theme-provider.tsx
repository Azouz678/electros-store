"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

type Theme = "light" | "dark"

type Ctx = {
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}

const ClientThemeContext = createContext<Ctx | null>(null)
const STORAGE_KEY = "client-theme"

export function ClientThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")

  // load saved theme
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null
      if (saved === "dark" || saved === "light") setThemeState(saved)
    } catch {}
  }, [])

  // sync across tabs
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return
      const v = e.newValue as Theme | null
      if (v === "dark" || v === "light") setThemeState(v)
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  // apply to <html> + persist
  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") root.classList.add("dark")
    else root.classList.remove("dark")

    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {}
  }, [theme])

  const value = useMemo<Ctx>(() => {
    const setTheme = (t: Theme) => setThemeState(t)
    const toggleTheme = () => setThemeState((p) => (p === "dark" ? "light" : "dark"))
    return { theme, setTheme, toggleTheme }
  }, [theme])

  return <ClientThemeContext.Provider value={value}>{children}</ClientThemeContext.Provider>
}

export function useClientTheme() {
  const ctx = useContext(ClientThemeContext)
  if (!ctx) throw new Error("useClientTheme must be used within ClientThemeProvider")
  return ctx
}