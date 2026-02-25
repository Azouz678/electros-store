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
      <body className="min-h-screen">
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
          {children}
     
      </body>
    </html>
  );
}


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