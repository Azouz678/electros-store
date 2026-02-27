"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")

  const nav = useMemo(
    () => [
      { label: "المنتجات", href: "/products" },
      { label: "تواصل", href: "/contact" },
    ],
    []
  )

  function goSearch() {
    const s = q.trim()
    router.push(s ? `/products?q=${encodeURIComponent(s)}` : "/products")
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 dark:bg-slate-950/70 border-b border-black/5 dark:border-white/10 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">

        {/* Mobile left side (Menu + Theme) */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          <ThemeToggle />
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-11 w-11 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 p-[2px] shadow-lg group-hover:scale-105 transition">
            <div className="relative h-full w-full rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Electros"
                width={34}
                height={34}
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="leading-tight">
            <div className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Electros
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              أجهزة منزلية حديثة
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {nav.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="relative hover:text-blue-600 transition"
            >
              {it.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 rounded-full px-4 py-2 shadow-sm">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="bg-transparent text-sm outline-none w-44"
              onKeyDown={(e) => e.key === "Enter" && goSearch()}
            />
            <button
              onClick={goSearch}
              className="ml-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-full transition"
            >
              بحث
            </button>
          </div>

          <ThemeToggle />
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-black/5 dark:border-white/10 bg-white dark:bg-slate-950 shadow-md">
          <div className="px-4 py-5 space-y-4">

            {/* Search */}
            <div className="flex gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ابحث..."
                className="flex-1 rounded-full border border-black/10 dark:border-white/10 px-4 py-2 text-sm bg-transparent outline-none"
                onKeyDown={(e) => e.key === "Enter" && goSearch()}
              />
              <button
                onClick={goSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold"
              >
                بحث
              </button>
            </div>

            {/* Links */}
            {nav.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setOpen(false)}
                className="block text-sm font-semibold py-2 hover:text-blue-600 transition"
              >
                {it.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}