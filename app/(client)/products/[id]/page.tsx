"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Product = {
  id: string
  name: string
  price?: number | string | null
  currency?: string | null
  image?: string | null
  description?: string | null
}

function formatNumber(v: any) {
  const n = Number(v)
  if (!Number.isFinite(n)) return v ? String(v) : ""
  return new Intl.NumberFormat("en-US").format(n)
}

function normalizeCurrency(cur?: string | null) {
  if (!cur) return ""
  const c = cur.trim().toUpperCase()
  if (c === "USD") return "$"
  return c
}

function splitDescription(desc: string) {
  const cleaned = desc.replace(/\r/g, "").trim()
  const blocks = cleaned.split(/\n{2,}/g).map((s) => s.trim()).filter(Boolean)
  return blocks.length ? blocks : [cleaned]
}

function toBullets(text: string) {
  const lines = text.split("\n").map((s) => s.trim()).filter(Boolean)
  const bulletish = lines.filter((l) => /^[-•*]\s+/.test(l) || /^\d+\.\s+/.test(l))
  if (bulletish.length >= 2) {
    const items = lines
      .map((l) => l.replace(/^[-•*]\s+/, "").replace(/^\d+\.\s+/, ""))
      .filter(Boolean)
    return { isList: true as const, items }
  }
  return { isList: false as const, items: [] as string[] }
}

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id

  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [openImg, setOpenImg] = useState(false)
  const [expandDesc, setExpandDesc] = useState(false)
  const [errMsg, setErrMsg] = useState<string | null>(null)

  useEffect(() => {
    let alive = true

    async function run() {
      if (!id) return
      setLoading(true)
      setErrMsg(null)

      const { data, error } = await supabase
        .from("products")
        .select("id,name,price,currency,image,description,is_active")
        .eq("id", id)
        .eq("is_active", true)
        .maybeSingle()

      if (!alive) return

      if (error) {
        setProduct(null)
        setErrMsg(error.message || "Supabase error")
        setLoading(false)
        return
      }

      if (!data) {
        setProduct(null)
        setErrMsg("No row matched. Check is_active or id.")
        setLoading(false)
        return
      }

      setProduct(data as any)
      setLoading(false)
    }

    run()
    return () => {
      alive = false
    }
  }, [id])

  const phone = "967770498620"
  const whatsappUrl = useMemo(() => {
    const name = product?.name ?? ""
    const link = typeof window !== "undefined" ? window.location.href : ""
    return `https://wa.me/${phone}?text=${encodeURIComponent(
      `مرحبًا، أريد الاستفسار عن المنتج: ${name}\nرابط المنتج: ${link}`
    )}`
  }, [phone, product?.name])

  if (loading) {
    return (
      <div className="rounded-3xl ring-1 ring-black/10 bg-white p-6 shadow-sm dark:bg-slate-900 dark:ring-white/10">
        <div className="h-6 w-56 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-4 aspect-[4/3] w-full animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="mt-6 h-4 w-72 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-3 h-4 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="rounded-3xl ring-1 ring-black/10 bg-white p-8 text-center shadow-sm dark:bg-slate-900 dark:ring-white/10">
        <div className="text-2xl font-extrabold">المنتج غير متاح</div>
        <p className="mt-2 text-slate-500 dark:text-slate-400">السبب: {errMsg ?? "Unknown"}</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white hover:opacity-90 dark:bg-white dark:text-slate-900"
        >
          الرجوع للمنتجات
        </Link>
      </div>
    )
  }

  const currency = normalizeCurrency(product.currency)
  const hasPrice = product.price != null && product.price !== ""
  const priceText = hasPrice ? formatNumber(product.price) : ""

  const desc = (product.description ?? "").trim()
  const descBlocks = desc ? splitDescription(desc) : []
  const longDesc = desc.length > 450
  const shownBlocks = longDesc && !expandDesc ? descBlocks.slice(0, 1) : descBlocks

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:underline">الرئيسية</Link>
        <span>/</span>
        <Link href="/products" className="hover:underline">المنتجات</Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-200">{product.name}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => product.image && setOpenImg(true)}
            className="group w-full overflow-hidden rounded-3xl ring-1 ring-black/10 bg-white shadow-sm dark:bg-slate-900 dark:ring-white/10"
          >
            <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-5xl">🛒</div>
              )}
            </div>
          </button>
          <div className="text-xs text-slate-500 dark:text-slate-400">اضغط على الصورة للتكبير</div>
        </div>

        <div className="h-fit rounded-3xl ring-1 ring-black/10 bg-white p-6 shadow-sm dark:bg-slate-900 dark:ring-white/10">
          <h1 className="text-2xl font-extrabold md:text-3xl tracking-tight">{product.name}</h1>

          {hasPrice && (
            <div className="mt-6">
              <div className="group relative mt-3 inline-flex w-full">
                <div className="pointer-events-none absolute -inset-4 rounded-[42px] blur-3xl opacity-90
                  bg-gradient-to-r from-amber-500/45 via-fuchsia-500/35 to-sky-500/45
                  dark:from-amber-300/25 dark:via-fuchsia-300/22 dark:to-sky-300/25
                " />
                <div className="relative w-full rounded-[34px] px-6 py-5
                  bg-white/70 backdrop-blur ring-1 ring-black/10
                  shadow-[0_22px_55px_-28px_rgba(0,0,0,.65)]
                  transition-all duration-300
                  group-hover:-translate-y-[2px]
                  group-hover:shadow-[0_30px_70px_-30px_rgba(0,0,0,.85)]
                  dark:bg-slate-950/55 dark:ring-white/10"
                >
<div
  className="mb-2 inline-flex items-center gap-2 rounded-full px-4 py-1.5
  text-[13px] md:text-sm font-extrabold tracking-wide
  bg-slate-100 text-slate-900
  dark:bg-white/10 dark:text-slate-100
  ring-1 ring-black/5 dark:ring-white/10"
>
  <span className="h-2 w-2 rounded-full bg-green-700 dark:bg-green-700" />
  السعر
</div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-4xl md:text-5xl font-black tracking-tight leading-none
                      bg-gradient-to-r from-slate-950 via-slate-700 to-slate-950 bg-clip-text text-transparent
                      dark:from-white dark:via-slate-200 dark:to-white"
                    >
                      {priceText}
                      {currency && (
                        <span className="ml-2 text-xl md:text-2xl font-black align-baseline text-slate-700 dark:text-slate-200">
                          {currency}
                        </span>
                      )}
                    </span>

                    <span className="hidden sm:inline-flex items-center rounded-full px-4 py-2 text-xs font-extrabold
                      bg-black/5 text-slate-700 dark:bg-white/10 dark:text-slate-200"
                    >
                      عرض قوي
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {desc && (
            <div className="mt-6 rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-extrabold">الوصف</div>
                {longDesc && (
                  <button
                    type="button"
                    onClick={() => setExpandDesc((v) => !v)}
                    className="rounded-2xl border px-3 py-1.5 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/10 transition"
                  >
                    {expandDesc ? "إظهار أقل" : "قراءة المزيد"}
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-3 leading-7 text-slate-700 dark:text-slate-200">
                {shownBlocks.map((block, idx) => {
                  const b = toBullets(block)
                  if (b.isList) {
                    return (
                      <ul key={idx} className="list-disc space-y-2 pr-5">
                        {b.items.map((it, i) => <li key={i}>{it}</li>)}
                      </ul>
                    )
                  }
                  return <p key={idx}>{block}</p>
                })}
              </div>
            </div>
          )}

          <div className="mt-7 grid gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full rounded-2xl bg-green-600 px-5 py-3 text-center font-semibold text-white hover:bg-green-700 transition"
            >
              الاستفسار عبر واتساب
            </a>

            <a
              href={`tel:+${phone}`}
              className="w-full rounded-2xl border px-5 py-3 text-center font-semibold hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              اتصال مباشر
            </a>

            <Link
              href="/products"
              className="w-full rounded-2xl border px-5 py-3 text-center font-semibold hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              الرجوع للمنتجات
            </Link>
          </div>
        </div>
      </div>

      {openImg && product.image && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4" onClick={() => setOpenImg(false)}>
          <button
            type="button"
            className="absolute right-4 top-4 rounded-2xl bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/20"
            onClick={() => setOpenImg(false)}
          >
            إغلاق
          </button>
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[85vh] max-w-[95vw] rounded-3xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}