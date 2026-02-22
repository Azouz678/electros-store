"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Pencil, Trash2 } from "lucide-react"

type Product = {
  id: string
  name: string
  price: string
  description: string
  image: string
  category_id: string
  slug: string
}

type Category = {
  id: string
  name: string
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
    const { data: productsData } = await supabase.from("products").select("*")
    const { data: categoriesData } = await supabase.from("categories").select("*")

    setProducts(productsData || [])
    setCategories(categoriesData || [])
  }

  async function deleteProduct(id: string) {
    if (!confirm("هل أنت متأكد من الحذف؟")) return
    await supabase.from("products").delete().eq("id", id)
    fetchData()
  }

  async function updateProduct() {

    if (!editing) return

    let imageUrl = editing.image

    // إذا تم اختيار صورة جديدة
    if (newImage) {
      const fileName = `${Date.now()}-${newImage.name}`

      await supabase.storage
        .from("products")
        .upload(fileName, newImage)

      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName)

      imageUrl = data.publicUrl
    }

    const newSlug = newName.toLowerCase().replace(/\s+/g, "-")

    await supabase
      .from("products")
      .update({
        name: newName,
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

      <h1 className="text-2xl font-bold">إدارة المنتجات</h1>

      <div className="grid gap-6">

        {products.map(product => (
          <div
            key={product.id}
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-md flex flex-col sm:flex-row sm:justify-between gap-4"
          >
            <div className="flex gap-4 items-center">
              <img src={product.image} className="w-20 h-20 object-cover rounded-xl" />
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-gray-500 text-sm">{product.price}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditing(product)
                  setNewName(product.name)
                  setNewPrice(product.price)
                  setNewDescription(product.description)
                  setNewCategory(product.category_id)
                  setPreview(product.image)
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-xl"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => deleteProduct(product.id)}
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

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-[400px] space-y-4">

            <h2 className="text-xl font-bold">تعديل المنتج</h2>

            <input value={newName} onChange={e => setNewName(e.target.value)} className="w-full border p-3 rounded-xl" />
            <input value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full border p-3 rounded-xl" />
            <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} className="w-full border p-3 rounded-xl" />

            <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full border p-3 rounded-xl">
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <label className="block cursor-pointer bg-blue-600 text-white text-center py-2 rounded-xl">
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
              <img src={preview} className="w-full h-40 object-cover rounded-xl" />
            )}

            <div className="flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="border px-4 py-2 rounded-xl">
                إلغاء
              </button>
              <button onClick={updateProduct} className="bg-green-600 text-white px-4 py-2 rounded-xl">
                حفظ
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  )
}