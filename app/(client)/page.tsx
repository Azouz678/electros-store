import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function Home() {
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)

  return (
    <>
      {/* HERO */}

        <section className="relative overflow-hidden rounded-3xl shadow-2xl">

          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600" />
          <div className="absolute inset-0 bg-black/40" />

          {/* Glow Effects */}
          <div className="absolute -top-40 -right-40 h-[28rem] w-[28rem] bg-amber-400/30 blur-3xl rounded-full" />
          <div className="absolute -bottom-40 -left-40 h-[28rem] w-[28rem] bg-indigo-400/30 blur-3xl rounded-full" />

            <div className="relative mx-auto max-w-6xl px-2 py-10 sm:py-20 md:py-24 text-white text-center md:text-right">
            {/* BRAND NAME — الأكبر */}
            <h1 className="
              text-4xl 
              sm:text-5xl 
              md:text-6xl 
              lg:text-7xl 
              font-extrabold 
              leading-tight 
              tracking-tight
              bg-gradient-to-r from-white via-amber-300 to-white 
              bg-clip-text 
              text-transparent
              drop-shadow-2xl
            ">
              إلكترو البيت الحديث
            </h1>

            {/* Sub Heading */}
            <h2 className="
              mt-6 
              text-2xl 
              sm:text-3xl 
              md:text-4xl 
              font-bold 
              leading-snug
            ">
              أحدث الأجهزة الإلكترونية
              <span className="block text-amber-400 mt-2">
                ومنظومات الطاقة الشمسية
              </span>
            </h2>

            {/* Description */}
            <p className="mt-6 text-lg md:text-xl text-slate-200 max-w-2xl mx-auto md:mx-0">
              جودة مضمونة • أفضل الأسعار • أحدث المنتجات
            </p>

              {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">

          {/* زر تسوق الآن */}
          <a
            href="/products"
            className="
              group relative overflow-hidden
              rounded-xl
              px-6 py-3
              text-sm sm:text-base
              font-bold
              text-black
              bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300
              shadow-lg
              transition-all duration-500
              animate-[fadeUp_0.8s_ease]
              hover:scale-105
              active:scale-95
            "
          >
            {/* Gradient متحرك */}
            <span className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-200 animate-[gradientMove_4s_linear_infinite] opacity-60"></span>

            {/* Liquid light */}
            <span className="absolute -inset-1 bg-white/20 blur-xl opacity-40 group-hover:opacity-70 transition duration-700"></span>

            {/* النص */}
            <span className="relative z-10 tracking-wide">
              تسوق الآن
            </span>
          </a>

          {/* زر واتساب */}
          <a
            href="https://wa.me/967770498620?text=مرحباً، أريد الاستفسار عن منتجاتكم"
            target="_blank"
            rel="noreferrer"
            className="
              group relative overflow-hidden
              rounded-xl
              px-6 py-3
              text-sm sm:text-base
              font-bold
              text-white
              bg-gradient-to-r from-green-500 via-emerald-600 to-green-500
              shadow-lg shadow-green-500/30
              transition-all duration-500
              animate-[fadeUp_0.8s_ease]
              hover:scale-105
              active:scale-95
            "
          >
            {/* Gradient متحرك */}
            <span className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 animate-[gradientMove_4s_linear_infinite] opacity-60"></span>

            {/* Glow بطيء */}
            <span className="absolute -inset-1 bg-green-400/30 blur-2xl opacity-40 group-hover:opacity-70 transition duration-700"></span>

            <span className="relative z-10 tracking-wide">
              تواصل عبر واتساب
            </span>
          </a>

        </div>

          </div>
        </section>

      {/* CATEGORIES */}
      <section className="mt-14">
        <h2 className="mb-8 text-2xl font-bold">أقسام المتجر</h2>

<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
  {categories?.map((category) => (
    <Link
      key={category.id}
      href={`/categories/${category.id}`}
      className="
        group
        rounded-3xl
        bg-white
        dark:bg-slate-900
        shadow-md
        hover:shadow-2xl
        transition-all duration-300
        hover:-translate-y-1
        overflow-hidden
      "
    >
      {/* Container الصورة */}
<div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">

  {category.image ? (
    <img
      src={category.image}
      alt={category.name}
      className="
        max-h-full
        max-w-full
        object-contain
        transition-transform duration-500
        group-hover:scale-105
      "
    />
  ) : (
    <div className="text-4xl">🛒</div>
  )}

</div>

      {/* الاسم */}
      <div className="p-4 text-center">
        <h3 className="text-lg font-bold group-hover:text-indigo-600 transition">
          {category.name}
        </h3>
      </div>
    </Link>
  ))}
</div>
      </section>
    </>
  )
}

