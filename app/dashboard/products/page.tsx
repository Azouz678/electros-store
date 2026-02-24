"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Pencil, Trash2, ImagePlus, Power, CheckCircle } from "lucide-react"

type Product = {
  id: string
  name: string
  price: string
  currency: string
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

function formatPrice(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "YER",
    minimumFractionDigits: 0
  }).format(value)
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
  const [newCurrency, setNewCurrency] = useState<string>("YER")
  const [newDescription, setNewDescription] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [newImage, setNewImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const [updateBtn, setUpdateBtn] = useState<"idle" | "loading" | "success">("idle")

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

    setUpdateBtn("loading")

    const trimmed = newName.trim()
    if (!trimmed) {
      setUpdateBtn("idle")
      return alert("اسم المنتج مطلوب")
    }

    const newSlug = generateSlug(trimmed)
    let imageUrl = editing.image

    if (newImage) {

      // حذف الصورة القديمة
      if (editing.image) {
        const oldFile = editing.image.split("/").pop()
        if (oldFile) {
          await supabase.storage.from("products").remove([oldFile])
        }
      }

      const fileName = `${Date.now()}-${newImage.name}`

      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, newImage)

      if (error) {
        setUpdateBtn("idle")
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
        price: Number(newPrice),
        currency: newCurrency,
        description: newDescription,
        category_id: newCategory,
        image: imageUrl,
        slug: newSlug
      })
      .eq("id", editing.id)

    setUpdateBtn("success")
    showSuccess("تم تحديث المنتج بنجاح ✅")

    setTimeout(() => {
      setEditing(null)
      setNewImage(null)
      setPreview(null)
      setUpdateBtn("idle")
      fetchData()
    }, 1200)
  }

  return (
    <div className="space-y-6">

      {successMessage && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle size={18} />
          {successMessage}
        </div>
      )}

      <h1 className="text-2xl font-bold">إدارة المنتجات</h1>

      <input
        type="text"
        placeholder="ابحث عن منتج..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-xl bg-white dark:bg-[#1E293B] border focus:ring-2 focus:ring-[#C59B3C] outline-none transition"
      />

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
                  <p className="text-lg font-bold text-green-600">
                    {formatPrice(Number(product.price), product.currency)}
                  </p>                  <p className="text-xs text-gray-400">الفئة: {categoryName}</p>
                  <p className={`text-xs ${product.is_active ? "text-green-600" : "text-red-500"}`}>
                    {product.is_active ? "مفعل" : "موقوف"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => toggleActive(product)} className="bg-yellow-500 text-white px-3 py-2 rounded-xl hover:scale-105 transition">
                  <Power size={16} />
                </button>

                <button
                  onClick={() => {
                    setEditing(product)
                    setNewName(product.name)
                    setNewPrice(product.price)
                    setNewCurrency(product.currency)
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

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-[420px] space-y-4 shadow-2xl">

            <h2 className="text-xl font-bold">تعديل المنتج</h2>

            <input value={newName} onChange={e => setNewName(e.target.value)} className="w-full border p-3 rounded-xl bg-white dark:bg-slate-700" />
              <div className="space-y-2">

                <div className="flex gap-3">

                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    className="w-full border p-3 rounded-xl"
                  />

                  <select
                    value={newCurrency}
                    onChange={e => setNewCurrency(e.target.value as any)}
                    className="border p-3 rounded-xl"
                  >
                    <option value="YER">🇾🇪 YER</option>
                    <option value="SAR">🇸🇦 SAR</option>
                    <option value="USD">🇺🇸 USD</option>
                  </select>

                </div>

              </div>
            <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} className="w-full border p-3 rounded-xl bg-white dark:bg-slate-700" />

            <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full border p-3 rounded-xl bg-white dark:bg-slate-700">
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <label className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C59B3C] to-amber-500 text-white text-sm font-medium shadow-md hover:scale-105 transition cursor-pointer">
              <ImagePlus size={16} />
              تغيير الصورة
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setNewImage(e.target.files[0])
                    setPreview(URL.createObjectURL(e.target.files[0]))
                  }
                }}
              />
            </label>

            {preview && (
              <div className="w-full h-44 rounded-2xl overflow-hidden shadow-lg">
                <img src={preview} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="border px-4 py-2 rounded-xl">
                إلغاء
              </button>

              <button
                onClick={updateProduct}
                disabled={updateBtn === "loading"}
                className={`px-4 py-2 rounded-xl text-white font-semibold transition-all duration-300
                  ${updateBtn === "idle" && "bg-green-600 hover:scale-105"}
                  ${updateBtn === "loading" && "bg-gray-400 cursor-not-allowed"}
                  ${updateBtn === "success" && "bg-green-700 animate-pulse"}
                `}
              >
                {updateBtn === "idle" && "حفظ"}
                {updateBtn === "loading" && (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري الحفظ...
                  </span>
                )}
                {updateBtn === "success" && "✔ تم بنجاح"}
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  )
}