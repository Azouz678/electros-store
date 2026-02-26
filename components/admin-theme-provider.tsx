"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

type Theme = "light" | "dark"
type Ctx = { theme: Theme; setTheme: (t: Theme) => void }

const AdminThemeContext = createContext<Ctx | null>(null)
const STORAGE_KEY = "admin-theme"

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null
      if (saved === "dark" || saved === "light") setTheme(saved)
    } catch {}
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") root.classList.add("dark")
    else root.classList.remove("dark")

    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {}
  }, [theme])

  const value = useMemo(() => ({ theme, setTheme }), [theme])

  return <AdminThemeContext.Provider value={value}>{children}</AdminThemeContext.Provider>
}

export function useAdminTheme() {
  const ctx = useContext(AdminThemeContext)
  if (!ctx) throw new Error("useAdminTheme must be used within AdminThemeProvider")
  return ctx
}