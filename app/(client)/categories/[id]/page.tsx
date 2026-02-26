import { SiteShell } from "@/components/site-shell"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function CategoryPage(
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single()

  if (!category) {
    return <div>Category not found</div>
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", id)
    .eq("is_active", true)

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold">
        {category.name}
      </h1>

      <div className="grid gap-6 md:grid-cols-3">

        {products && products.length === 0 && (
          <p>لا يوجد منتجات في هذه الفئة</p>
        )}

        {products?.map((product) => {

          const whatsappUrl = `https://wa.me/967770498620?text=${encodeURIComponent(
            `مرحبًا، أريد الاستفسار عن المنتج: ${product.name}`
          )}`

          return (
            <div
              key={product.id}
              className="rounded-3xl border bg-white p-6 shadow-lg dark:bg-slate-900"
            >
              <img
                src={product.image}
                alt={product.name}
                className="mb-4 h-48 w-full object-cover rounded-xl"
              />

              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-500 mb-4">{product.price}</p>

              <div className="flex gap-3">
                <a
                  href={`/products/${product.id}`}
                  className="flex-1 text-center bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                >
                  عرض التفاصيل
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  className="flex-1 text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  واتساب
                </a>
              </div>
            </div>
          )
        })}

      </div>
    </>
  )
}