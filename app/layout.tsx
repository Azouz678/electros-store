// Root should not provide a global theme when client/admin need separate themes.
// Theme providers are applied per-area in (client) and (admin) layouts.
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
        {/* <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e293b" /> */}
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}




