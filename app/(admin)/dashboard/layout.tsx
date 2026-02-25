// import { ThemeProvider } from "@/components/theme-provider"
import DashboardShell from "./dashboard-shell"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <ThemeProvider
    //   defaultTheme="dark"
    //   storageKey="admin-theme"
    // >
      <DashboardShell>
        {children}
      </DashboardShell>
    // </ThemeProvider>
  )
} 