"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Product = {
  id: string
  name: string
  price?: number | string | null
  image?: string | null
  is_active?: boolean
}

const CURRENCY = "ر.ي"

function formatPrice(v: any) {
  const n = Number(v)
  if (!Number.isFinite(n)) return v ? String(v) : ""
  return new Intl.NumberFormat("ar-YE").format(n)
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const qFromUrl = (searchParams.get("q") ?? "").trim()

  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    let alive = true
    async function run() {
      setLoading(true)
      const { data } = await supabase
        .from("products")
        .select("id,name,price,image,currency,is_active")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (!alive) return
      setProducts((data as any) ?? [])
      setLoading(false)
    }
    run()
    return () => {
      alive = false
    }
  }, [])

  const filtered = useMemo(() => {
    if (!qFromUrl) return products
    const s = qFromUrl.toLowerCase()
    return products.filter((p) => (p.name ?? "").toLowerCase().includes(s))
  }, [products, qFromUrl])

  return (
    <div className="space-y-6">
      <div className="rounded-3xl ring-1 ring-black/10 bg-white p-6 shadow-sm dark:bg-slate-900 dark:ring-white/10">
        <h1 className="text-2xl font-extrabold md:text-3xl">المنتجات</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {qFromUrl ? <>نتائج البحث عن: <span className="font-bold">{qFromUrl}</span></> : "استعرض المنتجات واضغط لعرض التفاصيل"}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-3xl ring-1 ring-black/10 bg-white shadow-sm dark:bg-slate-900 dark:ring-white/10">
              <div className="aspect-[4/3] animate-pulse bg-slate-200 dark:bg-slate-800" />
              <div className="p-4">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-3 h-9 w-full animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
          const currency = (p as any).currency || ""
          const priceText =
            p.price != null && p.price !== "" ? `${formatPrice(p.price)} ${currency}` : ""

            return (
              <div
                key={p.id}
                className="overflow-hidden rounded-3xl ring-1 ring-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900 dark:ring-white/10"
              >
                {/* ✅ الصورة كاملة في الكرت */}
                <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-5xl">🛒</div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-lg font-extrabold">{p.name}</div>
                    {priceText && (
                      <div className="shrink-0 rounded-2xl bg-slate-900 px-3 py-1 text-sm font-extrabold text-white dark:bg-white dark:text-slate-900">
                        {priceText}
                      </div>
                    )}
                  </div>

                  {/* ✅ زر التفاصيل */}
                  <Link
                    href={`/products/${p.id}`}
                    className="mt-4 block w-full rounded-2xl bg-slate-900 py-2 text-center text-sm font-bold text-white hover:opacity-90 dark:bg-white dark:text-slate-900"
                  >
                    عرض التفاصيل
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}