"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Category = {
  id: string
  name: string
}

export default function ManageCategories() {

  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    const { data } = await supabase.from("categories").select("*")
    setCategories(data || [])
  }

  async function deleteCategory(id: string) {
    const confirmDelete = confirm("هل أنت متأكد؟")
    if (!confirmDelete) return

    await supabase.from("categories").delete().eq("id", id)
    fetchCategories()
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-slate-900">

      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl">

        <h1 className="text-2xl font-bold mb-6">
          إدارة الفئات
        </h1>

        <div className="space-y-4">

          {categories.map(cat => (
            <div
              key={cat.id}
              className="flex justify-between items-center bg-gray-100 dark:bg-slate-700 p-4 rounded-xl"
            >
              <p className="font-semibold">{cat.name}</p>

              <div className="flex gap-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded-lg">
                  تعديل
                </button>

                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  )
}