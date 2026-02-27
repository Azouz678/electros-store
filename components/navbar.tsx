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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-black/5 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">

        {/* LEFT: Logo only */}
            <Link href="/" className="flex items-center">
              <div className="relative h-14 w-40">
                
                {/* يظهر في الوضع الفاتح */}
                <Image
                  src="/logo-dark.png"
                  alt="Electro Modern Home"
                  fill
                  className="object-contain dark:hidden"
                  priority
                />

                {/* يظهر في الوضع الليلي */}
                <Image
                  src="/logo-light.png"
                  alt="Electro Modern Home"
                  fill
                  className="hidden object-contain dark:block"
                  priority
                />

              </div>
            </Link>

        {/* CENTER Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {nav.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="relative group"
            >
              {it.label}
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-slate-900 dark:bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* RIGHT Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full bg-white dark:bg-slate-900 px-4 py-2 shadow-sm ring-1 ring-black/10 dark:ring-white/10">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث..."
              className="bg-transparent text-sm outline-none w-40"
              onKeyDown={(e) => e.key === "Enter" && goSearch()}
            />
          </div>
          <ThemeToggle />
        </div>

        {/* MOBILE: Menu + Theme */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />

          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-xl ring-1 ring-black/10 dark:ring-white/10"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {open && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-t border-black/5 dark:border-white/10">
          <div className="px-4 py-5 space-y-4">

            <div className="flex gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="flex-1 rounded-xl px-4 py-2 ring-1 ring-black/10 dark:ring-white/10 bg-transparent outline-none"
                onKeyDown={(e) => e.key === "Enter" && goSearch()}
              />
              <button
                onClick={goSearch}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              >
                بحث
              </button>
            </div>

            {nav.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 font-semibold"
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