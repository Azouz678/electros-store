import { ThemeProvider } from "@/components/theme-provider"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider storageKey="client-theme" defaultTheme="light">
      <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-500">
        {children}
      </div>
    </ThemeProvider>
  )
}