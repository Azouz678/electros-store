import { Navbar } from "@/components/navbar";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">{children}</main>

      <footer className="mt-10 border-t bg-white/60 py-8 text-sm text-slate-600 backdrop-blur dark:bg-slate-950/60 dark:text-slate-300">
        <div className="mx-auto max-w-6xl px-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Electros</div>
          <div className="text-slate-500 dark:text-slate-400">متجر للأجهزة المنزليه و منظومات الطاقه الشمسيه</div>
        </div>
      </footer>
    </div>
  );
}