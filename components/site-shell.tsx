"use client";

import React, { createContext, useContext } from "react";
import { Navbar } from "@/components/navbar";

const ShellDepthContext = createContext(0);

export function SiteShell({ children }: { children: React.ReactNode }) {
  const depth = useContext(ShellDepthContext);
  const isRootShell = depth === 0;

  return (
    <ShellDepthContext.Provider value={depth + 1}>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        {/* ✅ Navbar يظهر مرة واحدة فقط */}
        {isRootShell && <Navbar />}

        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

        {/* ✅ Footer يظهر مرة واحدة فقط */}
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