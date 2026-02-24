"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Pencil, Trash2, ImagePlus, Power, CheckCircle } from "lucide-react"

type Product = {
  id: string
  name: string
  price: string
  description: string
  image: string
  category_id: string
  slug: string
  is_active: boolean
}

type Category = {
  id: string
  name: string
}

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
}

export default function ManageProducts() {

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<Product | null>(null)
  const [search, setSearch] = useState("")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [newName, setNewName] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [newImage, setNewImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const [updateState, setUpdateState] = useState<"idle" | "loading" | "success">("idle")

  useEffect(() => {
    fetchData()
  }, [search])

  async function fetchData() {

    let query = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    if (search.trim() !== "") {
      query = query.ilike("name", `%${search}%`)
    }

    const { data } = await query
    const { data: categoriesData } = await supabase.from("categories").select("*")

    setProducts(data || [])
    setCategories(categoriesData || [])
  }

  function showSuccess(msg: string) {
    setSuccessMessage(msg)
    setTimeout(() => setSuccessMessage(null), 2500)
  }

  async function toggleActive(product: Product) {

    await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id)

    fetchData()
  }

  async function deleteProduct(product: Product) {

    if (!confirm("هل أنت متأكد من الحذف؟")) return

    if (product.image) {
      const fileName = product.image.split("/").pop()
      if (fileName) {
        await supabase.storage.from("products").remove([fileName])
      }
    }

    await supabase.from("products").delete().eq("id", product.id)
    fetchData()
  }

  async function updateProduct() {

    if (!editing) return

    setUpdateState("loading")

    const trimmed = newName.trim()
    if (!trimmed) {
      setUpdateState("idle")
      return alert("اسم المنتج مطلوب")
    }

    const newSlug = generateSlug(trimmed)

    let imageUrl = editing.image

    if (newImage) {

      const oldFile = editing.image.split("/").pop()
      if (oldFile) {
        await supabase.storage.from("products").remove([oldFile])
      }

      const fileName = `${Date.now()}-${newImage.name}`

      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, newImage)

      if (error) {
        setUpdateState("idle")
        return alert("فشل رفع الصورة")
      }

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName)

      imageUrl = data.publicUrl
    }

    await supabase
      .from("products")
      .update({
        name: trimmed,
        price: newPrice,
        description: newDescription,
        category_id: newCategory,
        image: imageUrl,
        slug: newSlug
      })
      .eq("id", editing.id)

    setUpdateState("success")
    showSuccess("تم تحديث المنتج بنجاح ✅")

    setTimeout(() => {
      setEditing(null)
      setUpdateState("idle")
      fetchData()
    }, 1200)
  }

  return (
    <div className="space-y-6">

      {successMessage && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle size={18} />
          {successMessage}
        </div>
      )}

      <h1 className="text-2xl font-bold">
        إدارة المنتجات
      </h1>

      <div className="relative">
        <input
          type="text"
          placeholder="ابحث عن منتج..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-xl bg-white dark:bg-[#1E293B] border focus:ring-2 focus:ring-[#C59B3C] outline-none transition"
        />
      </div>

      <div className="space-y-4">

        {products.map(product => {

          const categoryName =
            categories.find(c => c.id === product.category_id)?.name || "—"

          return (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-md flex justify-between items-center transition hover:shadow-xl hover:scale-[1.01]"
            >

              <div className="flex gap-4 items-center">

                <img
                  src={product.image}
                  className="w-20 h-20 object-cover rounded-xl"
                />

                <div>
                  <p className="font-semibold text-lg">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.price}</p>
                  <p className="text-xs text-gray-400">الفئة: {categoryName}</p>
                  <p className={`text-xs ${product.is_active ? "text-green-600" : "text-red-500"}`}>
                    {product.is_active ? "مفعل" : "موقوف"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">

                <button
                  onClick={() => toggleActive(product)}
                  className="bg-yellow-500 text-white px-3 py-2 rounded-xl hover:scale-105 transition"
                >
                  <Power size={16} />
                </button>

                <button
                  onClick={() => {
                    setEditing(product)
                    setNewName(product.name)
                    setNewPrice(product.price)
                    setNewDescription(product.description)
                    setNewCategory(product.category_id)
                    setPreview(product.image)
                  }}
                  className="bg-blue-500 text-white px-3 py-2 rounded-xl hover:scale-105 transition"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => deleteProduct(product)}
                  className="bg-red-500 text-white px-3 py-2 rounded-xl hover:scale-105 transition"
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>
          )
        })}

      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-[420px] space-y-4 shadow-2xl animate-fadeIn">

            <h2 className="text-xl font-bold">تعديل المنتج</h2>

            <input value={newName} onChange={e => setNewName(e.target.value)} className="w-full border p-3 rounded-xl" />
            <input value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full border p-3 rounded-xl" />
            <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} className="w-full border p-3 rounded-xl" />

            <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full border p-3 rounded-xl">
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setEditing(null)}
                className="border px-4 py-2 rounded-xl"
              >
                إلغاء
              </button>

              <button
                onClick={updateProduct}
                disabled={updateState === "loading"}
                className={`
                  px-4 py-2 rounded-xl text-white font-semibold transition-all duration-300
                  ${updateState === "idle" && "bg-green-600 hover:scale-105"}
                  ${updateState === "loading" && "bg-gray-400 cursor-not-allowed"}
                  ${updateState === "success" && "bg-green-700 animate-pulse"}
                `}
              >
                {updateState === "idle" && "حفظ"}
                {updateState === "loading" && (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري الحفظ...
                  </span>
                )}
                {updateState === "success" && "✔ تم بنجاح"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}