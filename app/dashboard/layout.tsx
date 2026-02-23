"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import {
  LayoutDashboard,
  PlusCircle,
  Boxes,
  Tags,
  Menu,
  X
} from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [productCount, setProductCount] = useState(0)
  const [categoryCount, setCategoryCount] = useState(0)

useEffect(() => {

  async function checkAccess() {

    const { data: userData } = await supabase.auth.getUser()

    // ❌ إذا ليس مسجل دخول
    if (!userData.user) {
      router.push("/login")
      return
    }

    // 🔍 نبحث عن profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single()

    // ❌ إذا لا يوجد profile
    if (!profile) {
      await supabase.auth.signOut()
      router.push("/login")
      return
    }

    // ❌ إذا ليس admin
    if (!["admin", "super_admin"].includes(profile.role)) {
      await supabase.auth.signOut()
      router.push("/login")
      return
    }

    // ✅ إذا كل شيء صحيح
    fetchCounts()
  }

  checkAccess()

}, [])
  async function fetchCounts() {
    const { count: products } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })

    const { count: categories } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true })

    setProductCount(products || 0)
    setCategoryCount(categories || 0)
  }

  const menu = [
    {
      name: "الرئيسية",
      href: "/dashboard/home",
      icon: LayoutDashboard
    },
    {
      name: "إضافة",
      href: "/dashboard",
      icon: PlusCircle
    },
    {
      name: "المنتجات",
      href: "/dashboard/products",
      icon: Boxes,
      badge: productCount
    },
    {
      name: "الفئات",
      href: "/dashboard/categories",
      icon: Tags,
      badge: categoryCount
    }
  ]

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900">

      {/* ===== Mobile Header ===== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-slate-800 shadow-md p-4 flex justify-between items-center z-40">
        <button onClick={() => setOpen(true)}>
          <Menu size={28} />
        </button>
        <h2 className="font-bold">لوحة التحكم</h2>
      </div>

      {/* ===== Sidebar ===== */}
      <aside className={`fixed lg:static z-50 top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 shadow-xl p-6 transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">لوحة التحكم</h2>
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <nav className="space-y-3">
          {menu.map(item => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition
                  ${pathname === item.href
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-200 dark:hover:bg-slate-700"}`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  {item.name}
                </div>

                {item.badge !== undefined && (
                  <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.push("/login")
          }}
          className="mt-10 w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
        >
          تسجيل خروج
        </button>

      </aside>

      {/* ===== Content ===== */}
      <main className="flex-1 p-6 lg:p-10 mt-16 lg:mt-0">
        {children}
      </main>

    </div>
  )
}