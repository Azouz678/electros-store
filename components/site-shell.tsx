"use client";

import React from "react";
import { Navbar } from "@/components/navbar";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

      <footer className="border-t bg-white/60 py-6 text-sm text-slate-600 backdrop-blur dark:bg-slate-950/60 dark:text-slate-300">
        <div className="mx-auto max-w-6xl px-4">
          © {new Date().getFullYear()} Electros — All rights reserved
        </div>
      </footer>
    </div>
  );
}