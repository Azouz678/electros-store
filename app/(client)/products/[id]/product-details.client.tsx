"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type ProductImage = {
  id: string
  image_url: string
  is_primary: boolean
}

type Product = {
  id: string
  name: string
  price?: number | string | null
  currency?: string | null
  description?: string | null
  product_images?: ProductImage[]
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

export default function ProductDetailsClient({ product }: { product: Product }) {

  const images = product.product_images || []
  const primaryImage =
    images.find(i => i.is_primary)?.image_url ||
    images[0]?.image_url

  const [activeImage, setActiveImage] = useState(primaryImage)
  const [openImg, setOpenImg] = useState(false)

  const phone = "967770498620"
  const currency = normalizeCurrency(product.currency)
  const hasPrice = product.price != null && product.price !== ""
  const priceText = hasPrice ? formatNumber(product.price) : ""

  const [pageUrl, setPageUrl] = useState("")

  useEffect(() => {
    setPageUrl(window.location.href)
  }, [])

  const whatsappUrl = useMemo(() => {
    const base = `https://wa.me/${phone}?text=`
    const msg = `مرحبًا، أريد الاستفسار عن المنتج: ${product.name}\nرابط المنتج: ${pageUrl}`
    return base + encodeURIComponent(msg)
  }, [phone, product.name, pageUrl])

  return (
    <div className="space-y-6">

      <div className="grid gap-8 lg:grid-cols-2">

        {/* Images */}
        <div className="space-y-4">

          <button
            type="button"
            onClick={() => activeImage && setOpenImg(true)}
            className="group w-full overflow-hidden rounded-3xl ring-1 ring-black/10 bg-white shadow-sm dark:bg-slate-900 dark:ring-white/10"
          >
            <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-5xl">🛒</div>
              )}
            </div>
          </button>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 flex-wrap">
              {images.map((img) => (
                <img
                  key={img.id}
                  src={img.image_url}
                  onClick={() => setActiveImage(img.image_url)}
                  className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 ${
                    activeImage === img.image_url
                      ? "border-green-500"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>
          )}

        </div>

        {/* Details */}
        <div className="space-y-5">
          <h1 className="text-3xl font-extrabold">{product.name}</h1>

          {hasPrice && (
            <div className="text-3xl font-black text-green-600">
              {priceText} {currency}
            </div>
          )}

          {product.description && (
            <p className="text-slate-600 dark:text-slate-300 leading-7">
              {product.description}
            </p>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            className="block w-full text-center bg-green-600 text-white py-3 rounded-2xl font-semibold hover:bg-green-700 transition"
          >
            الاستفسار عبر واتساب
          </a>
        </div>

      </div>

      {/* Lightbox */}
      {openImg && activeImage && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpenImg(false)}
        >
          <img
            src={activeImage}
            className="max-h-[85vh] max-w-[95vw] rounded-3xl object-contain"
          />
        </div>
      )}

    </div>
  )
}