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
  X,
  Shield
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

  // ✅ جديد
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  // useEffect(() => {
  //   fetchCounts()
  //   checkRole()
  // }, [])

 useEffect(() => {

  async function validateUser() {

    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user) {
      router.push("/login")
      return
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", userData.user.id)
      .single()

    if (!profile?.is_active) {
      await supabase.auth.signOut()
      router.push("/login")
      return
    }

    if (profile.role === "super_admin") {
      setIsSuperAdmin(true)
    }
  }

  validateUser()
     fetchCounts()
     checkRole()

}, [pathname])

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

  // ✅ قراءة الدور
async function checkRole() {

  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    router.push("/login")
    return
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", userData.user.id)
    .single()

  // ❗ إذا الحساب معطل → تسجيل خروج فوري
  if (!profile?.is_active) {
    await supabase.auth.signOut()
    router.push("/login")
    return
  }

  if (profile.role === "super_admin") {
    setIsSuperAdmin(true)
  }
}

  // القائمة الأساسية
  const baseMenu = [
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

  // ✅ نضيف إدارة الأدمن فقط إذا super_admin
  const menu = isSuperAdmin
    ? [
        ...baseMenu,
        {
          name: "إدارة الأدمن",
          href: "/dashboard/admins",
          icon: Shield
        }
      ]
    : baseMenu

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900">

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-slate-800 shadow-md p-4 flex justify-between items-center z-40">
        <button onClick={() => setOpen(true)}>
          <Menu size={28} />
        </button>
        <h2 className="font-bold">لوحة التحكم</h2>
      </div>

      {/* Sidebar */}
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

      <main className="flex-1 p-6 lg:p-10 mt-16 lg:mt-0">
        {children}
      </main>

    </div>
  )
}