"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Pencil, Trash2 } from "lucide-react"

type Category = {
  id: string
  name: string
  slug: string
}

export default function ManageCategories() {

  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<Category | null>(null)
  const [newName, setNewName] = useState("")

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    const { data } = await supabase.from("categories").select("*")
    setCategories(data || [])
  }

  // 🔥 منع حذف فئة مرتبطة بمنتجات
  async function deleteCategory(id: string) {

    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id)

    if ((count || 0) > 0) {
      alert("لا يمكن حذف الفئة لأنها مرتبطة بمنتجات")
      return
    }

    if (!confirm("هل أنت متأكد من الحذف؟")) return

    await supabase.from("categories").delete().eq("id", id)
    fetchCategories()
  }

  // 🔥 تعديل مع منع التكرار وتحديث slug
  async function updateCategory() {

    if (!editing) return

    const trimmed = newName.trim()

    if (!trimmed) {
      alert("اسم الفئة مطلوب")
      return
    }

    // 🔥 منع تكرار الاسم
    const { data: existing } = await supabase
      .from("categories")
      .select("*")
      .eq("name", trimmed)
      .neq("id", editing.id)

    if (existing && existing.length > 0) {
      alert("اسم الفئة موجود مسبقاً")
      return
    }

    const newSlug = trimmed.toLowerCase().replace(/\s+/g, "-")

    await supabase
      .from("categories")
      .update({
        name: trimmed,
        slug: newSlug
      })
      .eq("id", editing.id)

    setEditing(null)
    fetchCategories()
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        إدارة الفئات
      </h1>

      <div className="space-y-4">

        {categories.map(cat => (
          <div
            key={cat.id}
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-md flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-lg">{cat.name}</p>
              <p className="text-xs text-gray-500">slug: {cat.slug}</p>
            </div>

            <div className="flex gap-3">

              <button
                onClick={() => {
                  setEditing(cat)
                  setNewName(cat.name)
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-xl"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => deleteCategory(cat.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                <Trash2 size={16} />
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* ===== Modal التعديل ===== */}

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-96 space-y-4">

            <h2 className="text-xl font-bold">
              تعديل الفئة
            </h2>

            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full border p-3 rounded-xl"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                className="border px-4 py-2 rounded-xl"
              >
                إلغاء
              </button>

              <button
                onClick={updateCategory}
                className="bg-green-600 text-white px-4 py-2 rounded-xl"
              >
                حفظ
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  )
}