"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Pencil, Trash2, Power } from "lucide-react"

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

  const [newName, setNewName] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [newImage, setNewImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })

    const { data: categoriesData } = await supabase
      .from("categories")
      .select("*")

    setProducts(productsData || [])
    setCategories(categoriesData || [])
  }

  // ==========================
  // حذف المنتج + حذف الصورة
  // ==========================

  async function deleteProduct(product: Product) {

    if (!confirm("هل أنت متأكد من الحذف؟")) return

    // حذف الصورة من storage
    if (product.image) {
      const fileName = product.image.split("/").pop()
      if (fileName) {
        await supabase.storage.from("products").remove([fileName])
      }
    }

    await supabase.from("products").delete().eq("id", product.id)
    fetchData()
  }

  // ==========================
  // تفعيل / إيقاف
  // ==========================

  async function toggleActive(product: Product) {
    await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id)

    fetchData()
  }

  // ==========================
  // تحديث المنتج
  // ==========================

  async function updateProduct() {

    if (!editing) return

    const trimmed = newName.trim()
    if (!trimmed) return alert("اسم المنتج مطلوب")

    const newSlug = generateSlug(trimmed)

    // منع التكرار
    const { data: existing } = await supabase
      .from("products")
      .select("*")
      .eq("slug", newSlug)
      .neq("id", editing.id)

    if (existing && existing.length > 0) {
      alert("منتج بنفس الاسم موجود")
      return
    }

    let imageUrl = editing.image

    if (newImage) {

      // حذف الصورة القديمة
      const oldFile = editing.image.split("/").pop()
      if (oldFile) {
        await supabase.storage.from("products").remove([oldFile])
      }

      const fileName = `${Date.now()}-${newImage.name}`

      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, newImage)

      if (error) return alert("فشل رفع الصورة")

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

    setEditing(null)
    fetchData()
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        إدارة المنتجات
      </h1>

      <div className="space-y-4">

        {products.map(product => {

          const categoryName =
            categories.find(c => c.id === product.category_id)?.name || "—"

          return (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-md flex flex-col md:flex-row md:justify-between gap-4"
            >

              <div className="flex gap-4 items-center">

                <img
                  src={product.image}
                  className="w-20 h-20 object-cover rounded-xl"
                />

                <div>
                  <p className="font-semibold text-lg">
                    {product.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {product.price}
                  </p>

                  <p className="text-xs text-gray-400">
                    الفئة: {categoryName}
                  </p>

                  <p className={`text-xs ${product.is_active ? "text-green-600" : "text-red-500"}`}>
                    {product.is_active ? "مفعل" : "موقوف"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">

                <button
                  onClick={() => toggleActive(product)}
                  className="bg-yellow-500 text-white px-3 py-2 rounded-xl"
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
                  className="bg-blue-500 text-white px-3 py-2 rounded-xl"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => deleteProduct(product)}
                  className="bg-red-500 text-white px-3 py-2 rounded-xl"
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>
          )
        })}

      </div>

      {/* ===== Modal ===== */}

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-[400px] space-y-4">

            <h2 className="text-xl font-bold">
              تعديل المنتج
            </h2>

            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full border p-3 rounded-xl"
            />

            <input
              value={newPrice}
              onChange={e => setNewPrice(e.target.value)}
              className="w-full border p-3 rounded-xl"
            />

            <textarea
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              className="w-full border p-3 rounded-xl"
            />

            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              className="w-full border p-3 rounded-xl"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="file"
              onChange={(e) => {
                if (e.target.files) {
                  setNewImage(e.target.files[0])
                  setPreview(URL.createObjectURL(e.target.files[0]))
                }
              }}
              className="w-full"
            />

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
                onClick={updateProduct}
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