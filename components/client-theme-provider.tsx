"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

const ClientThemeContext = createContext<{
	theme: Theme
	setTheme: (t: Theme) => void
	toggleTheme: () => void
} | null>(null)

export function ClientThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("light")

	useEffect(() => {
		const saved = typeof window !== "undefined" ? (localStorage.getItem("client-theme") as Theme | null) : null
		if (saved) setThemeState(saved)
	}, [])

	useEffect(() => {
		if (typeof window === "undefined") return
		localStorage.setItem("client-theme", theme)
	}, [theme])

	function setTheme(t: Theme) {
		setThemeState(t)
	}

	function toggleTheme() {
		setThemeState(prev => (prev === "dark" ? "light" : "dark"))
	}

	return (
		<ClientThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
			<div id="client-theme-wrapper" data-client-theme={theme} className={theme === "dark" ? "dark" : ""}>
				{theme === "dark" && (
					<div className="fixed top-2 left-2 z-50 px-2 py-1 text-xs rounded bg-black text-white pointer-events-none">
						Client Dark
					</div>
				)}
				{children}
			</div>
		</ClientThemeContext.Provider>
	)
}

export function useClientTheme() {
	const ctx = useContext(ClientThemeContext)
	if (!ctx) throw new Error("useClientTheme must be used within ClientThemeProvider")
	return ctx
}