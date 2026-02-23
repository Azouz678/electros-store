export const dynamic = "force-dynamic"

import { SiteShell } from "@/components/site-shell"
import { createClient } from "@supabase/supabase-js"

export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function ProductsPage() {

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
  return (
    <SiteShell>
      <h1 className="mb-8 text-3xl font-bold">كل المنتجات</h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

        {products && products.length === 0 && (
          <p>لا يوجد منتجات حالياً</p>
        )}

        {products?.map((product) => {

          const whatsappUrl = `https://wa.me/967770498620?text=${encodeURIComponent(
            `مرحبًا، أريد الاستفسار عن المنتج: ${product.name}`
          )}`

          return (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-3xl border bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-900"
            >

              <div className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <h2 className="text-lg font-semibold">{product.name}</h2>

                <p className="mt-2 text-indigo-600 font-bold">
                  {product.price}
                </p>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  className="mt-4 inline-block w-full rounded-2xl bg-black py-3 text-center text-white transition hover:bg-indigo-600 dark:bg-white dark:text-black"
                >
                  استفسار عبر واتساب
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </SiteShell>
  )
}