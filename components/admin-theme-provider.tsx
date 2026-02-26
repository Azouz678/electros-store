"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

const AdminThemeContext = createContext<{
	theme: Theme
	setTheme: (t: Theme) => void
	toggleTheme: () => void
} | null>(null)

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("dark")

	useEffect(() => {
		const saved = typeof window !== "undefined" ? (localStorage.getItem("admin-theme") as Theme | null) : null
		if (saved) setThemeState(saved)
	}, [])

	useEffect(() => {
		if (typeof window === "undefined") return
		localStorage.setItem("admin-theme", theme)
	}, [theme])

	function setTheme(t: Theme) {
		setThemeState(t)
	}

	function toggleTheme() {
		setThemeState(prev => (prev === "dark" ? "light" : "dark"))
	}

	return (
		<AdminThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
			<div id="admin-theme-wrapper" data-admin-theme={theme} className={theme === "dark" ? "dark" : ""}>
				{theme === "dark" && (
					<div className="fixed top-2 left-2 z-50 px-2 py-1 text-xs rounded bg-black text-white pointer-events-none">
						Admin Dark
					</div>
				)}
				{children}
			</div>
		</AdminThemeContext.Provider>
	)
}

export function useAdminTheme() {
	const ctx = useContext(AdminThemeContext)
	if (!ctx) throw new Error("useAdminTheme must be used within AdminThemeProvider")
	return ctx
}