"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Search } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const boxRef = useRef<HTMLDivElement>(null)

  /* =========================
     اغلاق البحث عند الضغط خارج الصندوق
  ========================== */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
        setQuery("")          // ← يفضي البحث
        setResults([])
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  /* =========================
     Live Search
  ========================== */
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const run = async () => {
      const { data } = await supabase
        .from("products")
        .select("id,name")
        .ilike("name", `%${query}%`)
        .limit(6)

      setResults(data || [])
    }

    const delay = setTimeout(run, 300)
    return () => clearTimeout(delay)
  }, [query])

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="relative h-14 w-40">
            <Image
              src="/logo-dark.png"
              alt="Logo"
              fill
              className="object-contain dark:hidden"
              priority
            />
            <Image
              src="/logo-light.png"
              alt="Logo"
              fill
              className="hidden object-contain dark:block"
              priority
            />
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* 🔎 Search Icon — بدون مربعات */}
            <button
              onClick={() => {
                setSearchOpen(true)
                setQuery("")      // يفتح فاضي دائماً
                setResults([])
              }}
              className="
                relative
                text-slate-700 dark:text-white
                transition-all duration-300
                hover:scale-110
                hover:text-indigo-600
              "
            >
              <Search size={22} strokeWidth={2.5} />
            </button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ================= SEARCH OVERLAY ================= */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-start justify-center pt-28">

          <div
            ref={boxRef}
            className="
              w-[92%] max-w-2xl
              rounded-3xl
              bg-white dark:bg-slate-900
              shadow-2xl
              p-8
              animate-[fadeIn_.3s_ease]
            "
          >

            {/* Input */}
            <div className="relative">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن منتج..."
                className="
                  w-full
                  rounded-2xl
                  px-6 py-4
                  text-lg
                  ring-1 ring-black/10 dark:ring-white/10
                  bg-transparent
                  outline-none
                  transition-all
                  focus:ring-indigo-500
                "
              />
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="mt-6 space-y-2 max-h-72 overflow-y-auto">

                {results.map((r) => (
                  <Link
                    key={r.id}
                    href={`/products/${r.id}`}
                    onClick={() => {
                      setSearchOpen(false)
                      setQuery("")
                      setResults([])
                    }}
                    className="
                      block
                      px-5 py-4
                      rounded-2xl
                      font-semibold
                      transition-all duration-300
                      hover:bg-indigo-50
                      dark:hover:bg-slate-800
                      hover:translate-x-1
                    "
                  >
                    {r.name}
                  </Link>
                ))}

              </div>
            )}

            {/* Empty State */}
            {query && results.length === 0 && (
              <div className="mt-6 text-center text-slate-400 text-sm">
                لا يوجد نتائج
              </div>
            )}

          </div>
        </div>
      )}
    </>
  )
}