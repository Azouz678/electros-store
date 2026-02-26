"use client";

import React, { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";

const ShellDepthContext = createContext(0);

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const depth = useContext(ShellDepthContext);
  const isRootShell = depth === 0;

  // ✅ حماية الأدمن: أي مسار أدمن لا نعرض Navbar/Footer ولا ستايل العميل
  // عدّلي البادئة حسب مساراتك لو اختلفت
  const isAdminRoute =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  // ✅ العميل: Navbar/Footer مرة واحدة فقط حتى لو حصل nesting
  return (
    <ShellDepthContext.Provider value={depth + 1}>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        {isRootShell && <Navbar />}

        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

        {isRootShell && (
          <footer className="border-t bg-white/60 py-6 text-sm text-slate-600 backdrop-blur dark:bg-slate-950/60 dark:text-slate-300">
            <div className="mx-auto max-w-6xl px-4">
              © {new Date().getFullYear()} Electros — All rights reserved
            </div>
          </footer>
        )}
      </div>
    </ShellDepthContext.Provider>
  );
}