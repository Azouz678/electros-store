import { ClientThemeProvider } from "@/components/client-theme-provider"
import { SiteShell } from "@/components/site-shell"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientThemeProvider>
      <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e293b" />
      <SiteShell>{children}</SiteShell>
    </ClientThemeProvider>
  )
}