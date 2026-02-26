import { ClientThemeProvider } from "@/components/client-theme-provider"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientThemeProvider>
      <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-500">
        {children}
      </div>
    </ClientThemeProvider>
  )
}