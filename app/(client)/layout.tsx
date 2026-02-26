import { ClientThemeProvider } from "@/components/client-theme-provider"
import { SiteShell } from "@/components/site-shell"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientThemeProvider>
      <SiteShell>{children}</SiteShell>
    </ClientThemeProvider>
  )
}