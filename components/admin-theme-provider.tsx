"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as React from "react"

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
	return (
		<NextThemesProvider
			attribute="class"
			storageKey="admin-theme"
			defaultTheme="dark"
			enableSystem={false}
			disableTransitionOnChange
		>
			{children}
		</NextThemesProvider>
	)
}