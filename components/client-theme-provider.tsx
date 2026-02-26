"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import * as React from "react"

export function ClientThemeProvider({ children }: { children: React.ReactNode }) {
	return (
		<NextThemesProvider
			attribute="class"
			storageKey="client-theme"
			defaultTheme="light"
			enableSystem={false}
			disableTransitionOnChange
		>
			{children}
		</NextThemesProvider>
	)
}