"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Pencil, Trash2 } from "lucide-react"

type Category = {
  id: string
  name: string
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

  async function deleteCategory(id: string) {
    if (!confirm("هل أنت متأكد من الحذف؟")) return
    await supabase.from("categories").delete().eq("id", id)
    fetchCategories()
  }

  async function updateCategory() {
    if (!editing) return

    const { error } = await supabase
      .from("categories")
      .update({ name: newName })
      .eq("id", editing.id)

    console.log("Update error:", error)

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
            <p className="font-semibold text-lg">
              {cat.name}
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => {
                  setEditing(cat)
                  setNewName(cat.name)
                }}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
              >
                <Pencil size={16} />
                تعديل
              </button>

              <button
                onClick={() => deleteCategory(cat.id)}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
              >
                <Trash2 size={16} />
                حذف
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

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded-xl border"
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