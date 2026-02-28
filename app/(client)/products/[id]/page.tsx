export const dynamic = "force-dynamic"
export const revalidate = 0

import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
import ProductDetailsClient from "./product-details.client"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string }
}) {

  const { id } = await Promise.resolve(params)

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      price,
      currency,
      description,
      is_active,
      product_images (
        id,
        image_url,
        is_primary
      )
    `)
    .eq("id", id)
    .maybeSingle()

  const active =
    product &&
    (product.is_active === true ||
      product.is_active === 1 ||
      product.is_active === "1")

  if (error || !product || !active) {
    return (
      <div className="rounded-3xl ring-1 ring-black/10 bg-white p-8 text-center shadow-sm dark:bg-slate-900 dark:ring-white/10">
        <div className="text-2xl font-extrabold">المنتج غير متاح</div>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {error ? `السبب: ${error.message}` : "قد يكون غير مُفعّل أو غير موجود."}
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white hover:opacity-90 dark:bg-white dark:text-slate-900"
        >
          الرجوع للمنتجات
        </Link>
      </div>
    )
  }

  return <ProductDetailsClient product={product as any} />
}