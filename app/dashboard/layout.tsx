"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun } from "lucide-react"
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
  const { theme, toggleTheme } = useTheme()

  const [open, setOpen] = useState(false)
  const [productCount, setProductCount] = useState(0)
  const [categoryCount, setCategoryCount] = useState(0)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

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

      fetchCounts()
    }

    validateUser()

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

  const baseMenu = [
    { name: "الرئيسية", href: "/dashboard/home", icon: LayoutDashboard },
    { name: "إضافة", href: "/dashboard", icon: PlusCircle },
    { name: "المنتجات", href: "/dashboard/products", icon: Boxes, badge: productCount },
    { name: "الفئات", href: "/dashboard/categories", icon: Tags, badge: categoryCount }
  ]

  const menu = isSuperAdmin
    ? [...baseMenu, { name: "إدارة الأدمن", href: "/dashboard/admins", icon: Shield }]
    : baseMenu

  return (
    <div className="flex min-h-screen 
      bg-[#F3F4F6] 
      dark:bg-[#0F172A] 
      text-[#1E293B] 
      dark:text-white 
      transition-colors duration-300">

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 
        bg-white dark:bg-[#1E293B] 
        border-b border-gray-200 dark:border-[#334155]
        p-4 flex justify-between items-center z-40">
        <button onClick={() => setOpen(true)}>
          <Menu size={28} />
        </button>
        <h2 className="font-bold text-lg">لوحة التحكم</h2>
      </div>

      {/* Sidebar */}
      <aside className={`fixed lg:static z-50 top-0 left-0 h-full w-64 
        bg-white 
        dark:bg-[#1E293B] 
        border-r border-gray-200 dark:border-[#334155]
        shadow-xl p-6 transition-transform duration-300
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
            const active = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`
            group relative flex items-center justify-between
            px-4 py-3 pl-6 rounded-xl
            transition-all duration-300 ease-out
            ${active
              ? "bg-[#C59B3C]/10 dark:bg-[#C59B3C]/20 scale-[1.02]"
              : "hover:bg-[#C59B3C]/10 dark:hover:bg-[#C59B3C]/20 hover:scale-[1.02]"
            }
            `}
              >

                {/* Left Glow Effect */}
                  {active && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 
          w-1 h-6 bg-[#C59B3C] rounded-r-full 
          shadow-md shadow-[#C59B3C]/50
          animate-pulse" />
        )}

                <div className="flex items-center gap-3 relative z-10">

                  <Icon
                    size={20}
                    className={`
                      transition-all duration-300
                      ${active
                        ? "text-white"
                        : "text-[#C59B3C] group-hover:scale-110 group-hover:text-[#C59B3C]"
                      }
                    `}
                  />

                  <span className="font-medium tracking-wide">
                    {item.name}
                  </span>

                </div>

                {item.badge !== undefined && (
                  <span
                    className={`
                      relative z-10 text-xs px-2 py-1 rounded-full
                      transition-all duration-300
                      ${active
                        ? "bg-white text-[#C59B3C]"
                        : "bg-[#C59B3C] text-white group-hover:shadow-md group-hover:shadow-[#C59B3C]/40"
                      }
                    `}
                  >
                    {item.badge}
                  </span>
                )}

              </Link>
            )
          })}

        </nav>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="mt-6 w-full flex items-center justify-center gap-2 
          bg-[#C59B3C] text-white 
          py-2 rounded-xl shadow-md 
          hover:scale-105 transition-all duration-200"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          {theme === "dark" ? "الوضع الفاتح" : "الوضع الليلي"}
        </button>

        {/* Logout */}
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.push("/login")
          }}
          className="mt-6 w-full 
          bg-[#1E293B] 
          dark:bg-[#C59B3C] 
          text-white py-2 rounded-xl 
          hover:opacity-90 transition"
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