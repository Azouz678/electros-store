"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname()
  const router = useRouter()

  const menu = [
    { name: "إضافة", href: "/dashboard" },
    { name: "إدارة المنتجات", href: "/dashboard/products" },
    { name: "إدارة الفئات", href: "/dashboard/categories" },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900">

      {/* ===== Sidebar ===== */}
      <aside className="w-64 bg-white dark:bg-slate-800 shadow-xl p-6 flex flex-col justify-between">

        <div>
          <h2 className="text-xl font-bold mb-8">
            لوحة التحكم
          </h2>

          <nav className="space-y-3">
            {menu.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-xl transition ${
                  pathname === item.href
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-200 dark:hover:bg-slate-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.push("/login")
          }}
          className="bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
        >
          تسجيل خروج
        </button>

      </aside>

      {/* ===== Content ===== */}
      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  )
}