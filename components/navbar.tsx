import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";


export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="font-extrabold text-lg tracking-tight">
          Electros
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link href="/products" className="hover:underline">
            المنتجات
          </Link>
          <Link href="/contact" className="hover:underline">
            تواصل
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}