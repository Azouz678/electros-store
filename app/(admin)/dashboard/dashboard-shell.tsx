"use client"

import { useAdminTheme } from "@/components/admin-theme-provider"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
// import { ThemeProvider } from "@/components/theme-provider"
import { supabase } from "@/lib/supabase"
import { Boxes, LayoutDashboard, Menu, Moon, PlusCircle, Shield, Sun, Tags, X } from "lucide-react"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useAdminTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

    // <ThemeProvider storageKey="admin-theme" defaultTheme="dark">
    <div className="relative flex min-h-screen 
      bg-[#F3F4F6] 
      dark:bg-[#0B1220] 
      text-[#1E293B] 
      dark:text-white 
      transition-colors duration-500">


      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 
        bg-white/90 dark:bg-[#111827]/90 
        backdrop-blur-xl
        border-b border-gray-200 dark:border-gray-700
        p-4 flex justify-between items-center z-50 shadow-sm">

        <button
          onClick={() => setOpen(true)}
          className="hover:scale-110 transition-transform duration-200"
        >
          <Menu size={26} />
        </button>

        <h2 className="font-bold text-lg tracking-wide">لوحة التحكم</h2>

        <div />
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64
          bg-white/80 dark:bg-[#111827]/90
          backdrop-blur-2xl
          border-r border-gray-200 dark:border-gray-700
          shadow-2xl
          p-6
          transform transition-all duration-500 ease-[cubic-bezier(.25,.8,.25,1)]
          z-50
          ${open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
          lg:translate-x-0 lg:opacity-100
        `}
      >

        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl font-bold tracking-wide bg-gradient-to-r from-[#C59B3C] to-amber-500 bg-clip-text text-transparent">
            لوحة التحكم
          </h2>

          <button
            className="lg:hidden hover:rotate-90 transition-transform duration-300"
            onClick={() => setOpen(false)}
          >
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
                  px-4 py-3 rounded-xl
                  transition-all duration-300
                  ${active
                    ? "bg-gradient-to-r from-[#C59B3C]/20 to-transparent scale-[1.03]"
                    : "hover:bg-[#C59B3C]/10 hover:scale-[1.02]"
                  }
                `}
              >

                {/* Left Active Line */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 
                    w-1 h-7 bg-[#C59B3C] rounded-r-full 
                    shadow-lg shadow-[#C59B3C]/60 animate-pulse" />
                )}

                <div className="flex items-center gap-3">

                  <Icon
                    size={20}
                    className={`
                      transition-all duration-300
                      ${active
                        ? "text-[#C59B3C] scale-110"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-[#C59B3C] group-hover:scale-110"
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
                      text-xs px-2 py-1 rounded-full transition-all duration-300
                      ${active
                        ? "bg-[#C59B3C] text-white shadow-md"
                        : "bg-[#C59B3C]/90 text-white group-hover:shadow-lg"
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

        {/* set Theme */}

        {/* Theme Buttons */}
    {/* <div className="mt-8 grid grid-cols-2 gap-2"> */}
  {/* Theme Toggle - same size as Logout */}
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mt-5 w-full 
              bg-gray-800 dark:bg-gray-700
              text-white py-2 rounded-xl 
              hover:bg-[#C59B3C] hover:scale-105
              transition-all duration-300 shadow-md"
          >
            <span className="flex items-center justify-center gap-2 leading-none">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              {theme === "dark" ? "الوضع الفاتح" : "الوضع الليلي"}
            </span>
          </button>
      {/* </div> */}
        {/* <button
          aria-label="Toggle theme"
          onClick={() => setTheme("dark")}
          className="mt-8 w-full flex items-center justify-center gap-2 
          bg-gradient-to-r from-[#C59B3C] to-amber-500 
          text-white py-2 rounded-xl shadow-lg 
          hover:scale-105 hover:shadow-xl
          transition-all duration-300"
        >
          {mounted ? (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />) : <Moon size={18} />}
          {mounted ? (theme === "dark" ? "الوضع الفاتح" : "الوضع الليلي") : "الوضع الليلي"}
        </button> */}

        {/* Logout */}
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.push("/login")
          }}
          className="mt-5 w-full 
          bg-gray-800 dark:bg-gray-700
          text-white py-2 rounded-xl 
          hover:bg-red-500 hover:scale-105
          transition-all duration-300 shadow-md"
        >
          تسجيل خروج
        </button>

      </aside>

      {/* Content */}
      <main className="flex-1 p-6 lg:p-10 mt-16 lg:mt-0 transition-all duration-500">
        {children}
      </main>
          
    </div>
    
    // </ThemeProvider>
  )
}