"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

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
    <header
      className="
        sticky top-0 z-50
        bg-white/80 backdrop-blur dark:bg-slate-950/75
        shadow-sm
        ring-1 ring-black/5 dark:ring-white/10
      "
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl ring-1 ring-black/10 bg-white dark:bg-slate-900">
          <Image src="/logo.png" alt="Electros" fill className="object-contain p-1" priority />     
     </div>
          <div className="leading-tight">
            <div className="text-lg font-extrabold tracking-tight">Electros</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">أجهزة منزلية حديثة</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 text-sm md:flex">
          {nav.map((it) => (
            <Link key={it.href} href={it.href} className="font-semibold hover:underline">
              {it.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <div className="flex items-center gap-2 rounded-2xl ring-1 ring-black/10 bg-white px-3 py-2 dark:bg-slate-950 dark:ring-white/10">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-44 bg-transparent text-sm outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") goSearch()
              }}
            />
            <button
              type="button"
              onClick={goSearch}
              className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:opacity-90 dark:bg-white dark:text-slate-900"
            >
              بحث
            </button>
          </div>

          <ThemeToggle />
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl ring-1 ring-black/10 px-3 py-2 text-sm font-semibold dark:ring-white/10 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? "إغلاق" : "قائمة"}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="ring-1 ring-black/5 bg-white dark:bg-slate-950 dark:ring-white/10 md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="grid gap-3">
              {/* Search on mobile */}
              <div className="rounded-2xl ring-1 ring-black/10 bg-white p-3 dark:bg-slate-950 dark:ring-white/10">
                <div className="text-sm font-bold mb-2">بحث عن منتج</div>
                <div className="flex gap-2">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="اكتب اسم المنتج..."
                    className="w-full rounded-2xl ring-1 ring-black/10 bg-transparent px-3 py-2 text-sm outline-none dark:ring-white/10"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") goSearch()
                    }}
                  />
                  <button
                    type="button"
                    onClick={goSearch}
                    className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-bold text-white dark:bg-white dark:text-slate-900"
                  >
                    بحث
                  </button>
                </div>
              </div>

              {nav.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl ring-1 ring-black/10 px-4 py-3 font-semibold hover:bg-black/5 dark:ring-white/10 dark:hover:bg-white/10"
                >
                  {it.label}
                </Link>
              ))}

              <div className="flex items-center justify-between rounded-2xl ring-1 ring-black/10 px-4 py-3 dark:ring-white/10">
                <span className="font-semibold">المظهر</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}