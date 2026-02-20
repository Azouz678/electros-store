import { SiteShell } from "@/components/site-shell";
import Link from "next/link";

export default function Home() {
  return (
    <SiteShell>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-10 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
            أحدث الأجهزة المنزلية
          </h1>
          <p className="mt-4 text-lg text-white/90">
            ثلاجات، غسالات، شاشات، مكانس والمزيد. تصفح المنتجات وتواصل مباشرة عبر واتساب.
          </p>

          <div className="mt-6 flex gap-4">
            <Link
              href="/products"
              className="rounded-2xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105 hover:shadow-xl"
            >
              استعرض المنتجات
            </Link>

            <Link
              href="/contact"
              className="rounded-2xl border border-white px-6 py-3 transition hover:bg-white hover:text-black"
            >
              تواصل معنا
            </Link>
          </div>
        </div>

        {/* background glow */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/20 blur-3xl"></div>
      </section>

      {/* FEATURE CATEGORIES */}
      <section className="mt-14">
        <h2 className="mb-8 text-2xl font-bold">أقسام المتجر</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: "ثلاجات", icon: "❄️" },
            { name: "غسالات", icon: "🧺" },
            { name: "شاشات", icon: "📺" },
          ].map((item) => (
            <div
              key={item.name}
              className="group cursor-pointer rounded-3xl border bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-900"
            >
              <div className="text-4xl">{item.icon}</div>
              <h3 className="mt-4 text-xl font-semibold">{item.name}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                شاهد أحدث الموديلات بأفضل الأسعار
              </p>

              <div className="mt-4 text-sm font-semibold text-indigo-600 opacity-0 transition group-hover:opacity-100">
                عرض المنتجات →
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}