"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Search, Sparkles } from "lucide-react"
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

  /* إغلاق البحث عند الضغط خارج الصندوق */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  /* Live Search */
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const run = async () => {
      const { data } = await supabase
        .from("products")
        .select("id,name,image")
        .ilike("name", `%${query}%`)
        .limit(6)

      setResults(data || [])
    }

    const delay = setTimeout(run, 300)
    return () => clearTimeout(delay)
  }, [query])

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/60 dark:bg-slate-950/60 border-b border-white/10 shadow-lg shadow-black/5">

        {/* subtle glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">

   
           {/* LOGO */}
<Link
  href="/"
  className="relative flex items-center overflow-visible"
>
  <div
    className="
      relative
      w-[170px] h-[42px]      /* حجم افتراضي للناف */
      sm:w-[190px] sm:h-[44px]
      md:w-[200px] md:h-[46px]
    "
  >
    {/* Light Mode */}
    <Image
      src="/logo-light.svg"
      alt="Electro Modern Home"
      fill
      priority
      className="
        object-contain
        scale-[1.35]           /* تكبير بصري */
        sm:scale-[1.4]
        md:scale-[1.25]
        transition-transform duration-500
        drop-shadow-[0_0_18px_rgba(255,200,0,0.45)]
        dark:hidden
      "
    />

    {/* Dark Mode */}
    <Image
      src="/logo-dark.svg"
      alt="Electro Modern Home"
      fill
      priority
      className="
        hidden dark:block
        object-contain
        scale-[1.5]
        sm:scale-[1.4]
        md:scale-[1.25]
        transition-transform duration-500
        drop-shadow-[0_0_22px_rgba(120,120,255,0.5)]
      "
    />
  </div>
</Link>

          {/* ICONS */}
          <div className="flex items-center gap-6">

            {/* Search Icon */}
            <button
              onClick={() => {
                setSearchOpen(true)
                setQuery("")
              }}
              className="group relative"
            >
              <Search
                size={22}
                className="transition-all duration-300 group-hover:scale-125 group-hover:text-indigo-600"
              />
            </button>

            {/* Fancy Decorative Sparkle (بدون مربع) */}
            <Sparkles
              size={20}
              className="text-amber-400 animate-pulse hidden sm:block"
            />

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-start justify-center pt-32">

          <div
            ref={boxRef}
            className="w-[92%] max-w-2xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl p-6 animate-[fadeIn_0.3s_ease]"
          >

            {/* Input */}
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full rounded-2xl px-5 py-4 bg-transparent text-lg ring-1 ring-black/10 dark:ring-white/10 outline-none focus:ring-indigo-500 transition"
            />

            {/* Results */}
            {results.length > 0 && (
              <div className="mt-6 space-y-3 max-h-80 overflow-y-auto">

                {results.map((r) => (
                  <Link
                    key={r.id}
                    href={`/products/${r.id}`}
                    onClick={() => {
                      setSearchOpen(false)
                      setQuery("")
                    }}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-indigo-50 dark:hover:bg-white/5 transition-all duration-300 group"
                  >

                    {/* صورة المنتج */}
                    <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                      {r.image ? (
                        <img
                          src={r.image}
                          alt={r.name}
                          className="object-cover group-hover:scale-110 transition duration-500"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xl">
                          🛒
                        </div>
                      )}
                    </div>

                    <span className="font-semibold group-hover:text-indigo-600 transition">
                      {r.name}
                    </span>

                  </Link>
                ))}

              </div>
            )}

          </div>
        </div>
      )}
    </>
  )
}