import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Electros Store",
  description: "Electronics showroom",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
         <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}