"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function DashboardHome() {

  const [productCount, setProductCount] = useState(0)
  const [categoryCount, setCategoryCount] = useState(0)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    const { count: products } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })

    const { count: categories } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true })

    setProductCount(products || 0)
    setCategoryCount(categories || 0)
  }

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        مرحباً بك 👋
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl">
          <h2 className="text-lg font-semibold">عدد المنتجات</h2>
          <p className="text-4xl font-bold mt-4 text-indigo-600">
            {productCount}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl">
          <h2 className="text-lg font-semibold">عدد الفئات</h2>
          <p className="text-4xl font-bold mt-4 text-indigo-600">
            {categoryCount}
          </p>
        </div>

      </div>

    </div>
  )
}