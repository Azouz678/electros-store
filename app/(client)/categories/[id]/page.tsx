import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function formatPrice(v: any) {
  const n = Number(v)
  if (!Number.isFinite(n)) return v ? String(v) : ""
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(n)
}

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
  .select("id,name,price,image,currency")
  .eq("category_id", id)
  .eq("is_active", true)

  return (
    <div className="space-y-10">

      {/* Hero Title */}
      

        <h1 className="mb-10 text-3xl md:text-4xl
              font-extrabold bg-gradient-to-r
            from-indigo-600 via-purple-600
             to-white bg-clip-text text-transparent">
          {category.name} 
        </h1>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">

        {products && products.length === 0 && (
         <div className="col-span-full flex items-center justify-center py-20">

            <div
              className="
                relative
                text-center
                px-8 py-12
                rounded-3xl
                overflow-hidden
                backdrop-blur-xl
                transition-all duration-500
                bg-white/80
                dark:bg-slate-900/60
                ring-1 ring-black/10
                dark:ring-white/10
                shadow-xl
                dark:shadow-2xl
              "
            >

              {/* Glow Layer */}
              <div className="
                absolute inset-0 rounded-3xl
                bg-gradient-to-r
                from-indigo-500/10
                via-purple-500/10
                to-pink-500/10
                dark:from-indigo-500/20
                dark:via-purple-500/20
                dark:to-pink-500/20
                blur-2xl
                opacity-60
                pointer-events-none
              " />

              {/* Main Text */}
              <p
                className="
                  relative
                  text-2xl sm:text-3xl md:text-4xl
                  font-extrabold
                  tracking-wide
                  bg-gradient-to-r
                  from-indigo-600
                  via-purple-600
                  to-indigo-600
                  dark:from-white
                  dark:via-amber-300
                  dark:to-white
                  bg-clip-text
                  text-transparent
                  drop-shadow-md
                  dark:drop-shadow-2xl
                  animate-[fadeUp_0.6s_ease]
                "
              >
                لا يوجد منتجات في هذه الفئة
              </p>

              {/* Sub Text */}
              <p
                className="
                  relative
                  mt-4
                  text-sm md:text-base
                  font-medium
                  text-slate-600
                  dark:text-slate-300
                  transition-colors duration-300
                "
              >
                يرجى تصفح فئات أخرى أو العودة لاحقاً
              </p>

            </div>

          </div>
        )}

        {products?.map((product, index) => {

              const cur = (product.currency || "").toString().trim().toUpperCase()

              let currencySymbol = ""
              if (cur === "USD") currencySymbol = "$"
              else if (cur === "SAR") currencySymbol = "SAR"
              else if (cur === "YER") currencySymbol = "YER"
              else currencySymbol = cur

              const priceText =
                product.price != null && product.price !== ""
                  ? `${formatPrice(product.price)} ${currencySymbol}`
                  : ""

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
                transition-all
                duration-500
                hover:-translate-y-2
                hover:shadow-2xl
                active:scale-95
                animate-fadeInUp
              "
              style={{ animationDelay: `${index * 80}ms` }}
            >

              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={product.image}
                  alt={product.name}
                  className="
                    h-full w-full
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-110
                  "
                />

                {/* Price Badge */}
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

              {/* Content */}
              <div className="p-4 space-y-3">

                <h2 className="text-sm md:text-base font-bold line-clamp-2 group-hover:text-indigo-600 transition">
                  {product.name}
                </h2>

                <Link
                  href={`/products/${product.id}`}
                  className="
                    block w-full text-center
                    rounded-2xl
                    bg-gradient-to-r
                    from-indigo-600
                    to-purple-600
                    py-2
                    text-xs md:text-sm
                    font-bold
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

              </div>
            </div>
          )
        })}

      </div>

    </div>
  )
}