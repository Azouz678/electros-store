"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}

// "use client"

// import * as React from "react"
// import { ThemeProvider as NextThemesProvider } from "next-themes"

// export function ThemeProvider({
//   children,
//   ...props
// }: React.ComponentProps<typeof NextThemesProvider>) {
//   return (
//     <NextThemesProvider {...props}>
//       {children}
//     </NextThemesProvider>
//   )
// }

















// "use client";

// import { ThemeProvider as NextThemesProvider } from "next-themes";
// import * as React from "react";

// export function ThemeProvider({
//   children,
//   ...props
// }: React.ComponentProps<typeof NextThemesProvider>) {
//   return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
// }


// "use client"

// import { createContext, useContext, useEffect, useState } from "react"

// type Theme = "light" | "dark"

// const ThemeContext = createContext({
//   theme: "light" as Theme,
//   toggleTheme: () => {}
// })

// export function ThemeProvider({ children }: { children: React.ReactNode }) {

//   const [theme, setTheme] = useState<Theme>("light")

//   // عند تحميل الموقع
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme") as Theme | null

//     if (savedTheme) {
//       setTheme(savedTheme)
//       document.documentElement.classList.toggle("dark", savedTheme === "dark")
//     }
//   }, [])

//   function toggleTheme() {
//     const newTheme = theme === "light" ? "dark" : "light"

//     setTheme(newTheme)
//     localStorage.setItem("theme", newTheme)

//     document.documentElement.classList.toggle("dark", newTheme === "dark")
//   }

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   )
// }

// export function useTheme() {
//   return useContext(ThemeContext)
// }

