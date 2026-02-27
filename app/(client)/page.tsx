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
{/* HERO */}
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
    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
        <a
          href="/products"
          className="
              relative
              rounded-2xl
              bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300
              px-10 py-4
              font-extrabold
              text-white
              shadow-2xl
              transition-all duration-300
              hover:scale-105
              hover:shadow-yellow-500/50
              active:scale-95
          "
        >
          {/* Glow layer */}
          <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition duration-300 rounded-2xl"></span>

          {/* النص */}
          <span className="relative z-10 tracking-wide">
            تسوق الآن
          </span>

          {/* أيقونة سهم */}
          <span className="relative z-10 text-lg transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>

       <a
          href="https://wa.me/967770498620?text=مرحباً، أريد الاستفسار عن منتجاتكم"
          target="_blank"
          rel="noreferrer"
          className="
            group
            relative
            flex items-center justify-center gap-3
            rounded-2xl
            px-10 py-4
            font-bold
            text-white
            bg-gradient-to-r from-green-500 via-green-600 to-emerald-600
            shadow-xl shadow-green-500/30
            transition-all duration-300
            hover:scale-105
            hover:shadow-2xl hover:shadow-green-500/50
            active:scale-95
            overflow-hidden
          "
        >
          {/* Glow effect */}
          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition duration-500" />

          {/* Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M12 2C6.48 2 2 6.03 2 11.05c0 1.98.7 3.8 1.9 5.29L2 22l5.82-1.87c1.43.78 3.05 1.22 4.68 1.22 5.52 0 10-4.03 10-9.05S17.52 2 12 2zm0 16.36c-1.43 0-2.84-.4-4.05-1.15l-.29-.18-3.45 1.1 1.12-3.34-.2-.31c-.87-1.35-1.33-2.9-1.33-4.43 0-4.17 3.66-7.56 8.17-7.56s8.17 3.39 8.17 7.56-3.66 7.56-8.17 7.56z"/>
          </svg>

          <span className="relative z-10">
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

