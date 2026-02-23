"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Pencil, Trash2, ImagePlus, Power } from "lucide-react"

type Category = {
  id: string
  name: string
  slug: string
  image: string | null
  is_active: boolean
}

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
}

export default function ManageCategories() {

  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<Category | null>(null)
  const [newName, setNewName] = useState("")
  const [search, setSearch] = useState("")
  const [newImage, setNewImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
    fetchCategories()
  }, [search])

  async function fetchData() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .ilike("name", `%${search}%`)
      .order("created_at", { ascending: false })

    setCategories(data || [])
  }

 async function fetchCategories() {
  let query = supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false })

  if (search.trim() !== "") {
    query = query.ilike("name", `%${search}%`)
  }

  const { data } = await query
  setCategories(data || [])
}

  // =============================
  // حذف
  // =============================

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

  // =============================
  // تفعيل / إيقاف
  // =============================

  async function toggleActive(cat: Category) {
    await supabase
      .from("categories")
      .update({ is_active: !cat.is_active })
      .eq("id", cat.id)

    fetchCategories()
  }

  // =============================
  // تحديث
  // =============================

  async function updateCategory() {

    if (!editing) return

    const trimmed = newName.trim()

    if (!trimmed) return alert("اسم الفئة مطلوب")

    // منع التكرار
    const { data: existing } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", generateSlug(trimmed))
      .neq("id", editing.id)

    if (existing && existing.length > 0) {
      alert("فئة بنفس الاسم موجودة")
      return
    }

    let imageUrl = editing.image

    if (newImage) {

      const fileName = `cat-${Date.now()}-${newImage.name}`

      const { error } = await supabase.storage
        .from("categories")
        .upload(fileName, newImage)

      if (error) return alert("فشل رفع الصورة")

      const { data } = supabase.storage
        .from("categories")
        .getPublicUrl(fileName)

      imageUrl = data.publicUrl
    }

    await supabase
      .from("categories")
      .update({
        name: trimmed,
        slug: generateSlug(trimmed),
        image: imageUrl
      })
      .eq("id", editing.id)

    setEditing(null)
    setNewImage(null)
    setPreview(null)
    fetchData()
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        إدارة الفئات
      </h1>

         <div className="mb-6 relative">
  <input
    type="text"
    placeholder="ابحث عن فئة..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full p-3 pl-10 rounded-xl
    bg-white dark:bg-[#1E293B]
    border border-gray-200 dark:border-[#334155]
    focus:ring-2 focus:ring-[#C59B3C]
    outline-none transition-all duration-300"
  />

  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C59B3C]">
    🔍
  </span>
</div>

      <div className="space-y-4">

        {categories.map(cat => (
          <div
            key={cat.id}
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-md flex flex-col md:flex-row md:justify-between md:items-center gap-4"
          >

            <div className="flex items-center gap-4">

              {cat.image && (
                <img
                  src={cat.image}
                  className="w-16 h-16 object-cover rounded-xl"
                />
              )}

              <div>
                <p className="font-semibold text-lg">
                  {cat.name}
                </p>

                {/* <p className="text-xs text-gray-500">
                  slug: {cat.slug}
                </p> */}

                <p className={`text-xs ${cat.is_active ? "text-green-600" : "text-red-500"}`}>
                  {cat.is_active ? "مفعلة" : "موقوفة"}
                </p>
              </div>
            </div>

            <div className="flex gap-2">

              <button
                onClick={() => toggleActive(cat)}
                className="bg-yellow-500 text-white px-3 py-2 rounded-xl"
              >
                <Power size={16} />
              </button>

              <button
                onClick={() => {
                  setEditing(cat)
                  setNewName(cat.name)
                }}
                className="bg-blue-500 text-white px-3 py-2 rounded-xl"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => deleteCategory(cat.id)}
                className="bg-red-500 text-white px-3 py-2 rounded-xl"
              >
                <Trash2 size={16} />
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* ===== Modal ===== */}

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

            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <ImagePlus size={16} />
              تغيير الصورة
              <input
                type="file"
                hidden
                onChange={(e) => {
                  if (e.target.files) {
                    setNewImage(e.target.files[0])
                    setPreview(URL.createObjectURL(e.target.files[0]))
                  }
                }}
              />
            </label>

            {preview && (
              <img
                src={preview}
                className="w-full h-40 object-cover rounded-xl"
              />
            )}

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