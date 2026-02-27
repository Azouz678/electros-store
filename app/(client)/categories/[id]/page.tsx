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
      <h1 className="mb-10 text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-white bg-clip-text text-transparent">
  {category.name}
</h1>

<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

  {products && products.length === 0 && (
    <p className="col-span-full text-center text-slate-500">
      لا يوجد منتجات في هذه الفئة
    </p>
  )}

  {products?.map((product, index) => {

    const whatsappUrl = `https://wa.me/967770498620?text=${encodeURIComponent(
      `مرحبًا، أريد الاستفسار عن المنتج: ${product.name}`
    )}`

    return (
      <div
        key={product.id}
        className="
          group
          relative
          overflow-hidden
          rounded-3xl
          bg-white
          dark:bg-slate-900
          shadow-md
          hover:shadow-2xl
          transition-all duration-500
          hover:-translate-y-2
          animate-fadeInUp
        "
        style={{ animationDelay: `${index * 80}ms` }}
      >

        {/* صورة المنتج */}
        <div className="relative h-44 md:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={product.image}
            alt={product.name}
            className="
              w-full h-full
              object-cover
              transition-transform duration-700
              group-hover:scale-110
            "
          />
        </div>

        {/* المحتوى */}
        <div className="p-4 space-y-3">

          <h2 className="font-bold text-sm md:text-base line-clamp-2 group-hover:text-indigo-600 transition">
            {product.name}
          </h2>

          {/* السعر */}
          <div className="
            inline-block
            rounded-full
            px-4 py-1
            text-xs md:text-sm
            font-extrabold
            text-white
            bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400
            shadow-md
          ">
            {product.price}
          </div>

          {/* الأزرار */}
          <div className="flex gap-2 pt-2">

            <a
              href={`/products/${product.id}`}
              className="
                flex-1
                text-center
                rounded-xl
                bg-gradient-to-r from-indigo-600 to-purple-600
                text-white
                py-2
                text-xs md:text-sm
                font-bold
                shadow-lg
                transition-all duration-300
                hover:scale-105
                active:scale-95
              "
            >
              عرض التفاصيل
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              className="
                flex-1
                text-center
                rounded-xl
                bg-gradient-to-r from-green-500 to-emerald-600
                text-white
                py-2
                text-xs md:text-sm
                font-bold
                shadow-lg
                transition-all duration-300
                hover:scale-105
                active:scale-95
              "
            >
              واتساب
            </a>

          </div>

        </div>
      </div>
    )
  })}

</div>
    </>
  )
}