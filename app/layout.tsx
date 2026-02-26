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
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}




// import type { Metadata } from "next";
// import { ThemeProvider } from "@/components/theme-provider";
// import "./globals.css";

// export const metadata: Metadata = {
//   title: "Electros Store",
//   description: "Electronics showroom",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html
//       lang="ar"
//       dir="rtl"
//       suppressHydrationWarning
//     >
//       <body className="min-h-screen">
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="light"
//           enableSystem={false}
//         >
//           {children}
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="ar" dir="rtl" suppressHydrationWarning>
//       <body>
//         {/* <ThemeProvider> */}
//           {children}
//         {/* </ThemeProvider> */}
//       </body>
//     </html>
//   );
// }