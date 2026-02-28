"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type ProductImage = {
  id: string
  image_url: string
  is_primary: boolean
}

type Product = {
  id: string
  name: string
  price?: number | string | null
  is_active?: boolean
  currency?: string | null
  product_images?: ProductImage[]
}

function formatPrice(v: any) {
  const n = Number(v)
  if (!Number.isFinite(n)) return v ? String(v) : ""
  // ✅ أرقام إنجليزية دائمًا لكل العملات
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(n)
}

export default function ProductsClient() {
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
        .select(`
                  id,
                  name,
                  price,
                  currency,
                  is_active,
                  product_images (
                    id,
                    image_url,
                    is_primary
                  )
                `)
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
    <section className="relative overflow-hidden rounded-3xl shadow-2xl">

        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600" />
        <div className="absolute inset-0 bg-black/40" />

        {/* Glow Effects */}
        <div className="absolute -top-40 -right-40 h-[24rem] w-[24rem] bg-amber-400/30 blur-3xl rounded-full" />
        <div className="absolute -bottom-40 -left-40 h-[24rem] w-[24rem] bg-indigo-400/30 blur-3xl rounded-full" />

        <div className="relative px-6 py-16 text-white text-center md:text-right">

          {/* Title */}
          <h1 className="
            text-3xl 
            sm:text-4xl 
            md:text-5xl 
            font-extrabold 
            tracking-tight
            bg-gradient-to-r from-white via-amber-300 to-white
            bg-clip-text 
            text-transparent
            drop-shadow-2xl
          ">
          كل المنتجات
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base md:text-lg text-slate-200 max-w-xl mx-auto md:mx-0">
            {qFromUrl ? (
              <>
                نتائج البحث عن: 
                <span className="font-bold text-amber-400 mt-2"> {qFromUrl}</span>
              </>
            ) : (
              "استعرض المنتجات واختر ما يناسبك "
            )}
          </p>

        </div>
      </section>

      {loading ? (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-3xl ring-1 ring-black/10 bg-white shadow-sm dark:bg-slate-900 dark:ring-white/10"
            >
              <div className="aspect-[4/3] animate-pulse bg-slate-200 dark:bg-slate-800" />
              <div className="p-4">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-3 h-9 w-full animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p, index) => {
            const pid =
              (p as any).id ??
              (p as any).product_id ??
              (p as any).uuid ??
              (p as any).productId ??
              (p as any).ID

            const cur = ((p as any).currency || "").toString().trim().toUpperCase()
            const currency = cur === "USD" ? "$" : cur

            const priceText =
              p.price != null && p.price !== ""
                ? `${formatPrice(p.price)} ${currency}`
                : ""

            return (
              <div
                key={pid ?? p.name}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-3xl
                  bg-white
                  dark:bg-slate-900
                  shadow-md
                  transition-all
                  duration-500
                  hover:-translate-y-2
                  hover:shadow-2xl
                  active:scale-95
                  animate-fadeInUp
                "
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* الصورة */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl bg-slate-100 dark:bg-slate-800">
                    {(() => {
                      const primary =
                        p.product_images?.find(i => i.is_primary)?.image_url ||
                        p.product_images?.[0]?.image_url

                      return primary ? (
                        <img
                          src={primary}
                          alt={p.name}
                          loading="lazy"
                          className="
                            h-full w-full
                            object-cover
                            transition-transform
                            duration-700
                            group-hover:scale-110
                          "
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-5xl">
                          🛒
                        </div>
                      )
                    })()}

                  {/* Badge السعر */}
                  {priceText && (
                    <div className="
                      absolute top-3 right-3
                      rounded-xl
                      bg-gradient-to-r
                      from-indigo-600
                      to-purple-600
                      px-3 py-1
                      text-xs font-extrabold
                      text-white
                      shadow-lg
                    ">
                      {priceText}
                    </div>
                  )}
                </div>

                {/* المحتوى */}
                <div className="p-4 space-y-3">
                  <h3 className="text-base md:text-lg font-bold line-clamp-2 group-hover:text-indigo-600 transition">
                    {p.name}
                  </h3>

                  {pid ? (
                    <Link
                      href={`/products/${pid}`}
                      className="
                        block w-full text-center
                        rounded-2xl
                        bg-gradient-to-r
                        from-indigo-600
                        to-purple-600
                        py-2
                        text-sm font-bold
                        text-white
                        shadow-md
                        transition-all
                        duration-300
                        hover:shadow-xl
                        hover:scale-105
                        active:scale-95
                      "
                    >
                      عرض التفاصيل
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="
                        block w-full
                        rounded-2xl
                        bg-slate-400
                        py-2
                        text-sm font-bold
                        text-white
                        opacity-70
                        cursor-not-allowed
                      "
                    >
                      المنتج بدون ID
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}