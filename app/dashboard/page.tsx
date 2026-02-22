"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Category = {
  id: string
  name: string
}

export default function Dashboard() {

  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [categoryName, setCategoryName] = useState("")

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // 🔐 حماية الصفحة
  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) router.push("/login")
    }
    checkUser()
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")

    setCategories(data || [])
  }

  async function addCategory() {
    if (!categoryName) return alert("اكتب اسم الفئة")

    await supabase.from("categories").insert([
      {
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/\s+/g, "-")
      }
    ])

    setCategoryName("")
    fetchCategories()
  }

  async function addProduct() {

    if (!imageFile || !categoryId || !name || !price)
      return alert("أكمل جميع البيانات")

    setLoading(true)

    const fileName = `${Date.now()}-${imageFile.name}`

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, imageFile)

    if (uploadError) {
      setLoading(false)
      return alert("فشل رفع الصورة")
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName)

    await supabase.from("products").insert([
      {
        name,
        price,
        description,
        category_id: categoryId,
        image: data.publicUrl,
        slug: name.toLowerCase().replace(/\s+/g, "-")
      }
    ])

    setLoading(false)

    setName("")
    setPrice("")
    setDescription("")
    setCategoryId("")
    setPreview(null)
    setImageFile(null)
  }

return (
  <div className="max-w-3xl">

    <h1 className="text-2xl font-bold mb-8">
      إضافة منتج أو فئة
    </h1>

    {/* ===== إضافة فئة ===== */}

    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl space-y-4 mb-10">

      <h2 className="text-lg font-semibold">إضافة فئة</h2>

      <input
        value={categoryName}
        placeholder="اسم الفئة"
        onChange={e => setCategoryName(e.target.value)}
        className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-slate-700"
      />

      <button
        onClick={addCategory}
        className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition"
      >
        إضافة الفئة
      </button>

    </div>

    {/* ===== إضافة منتج ===== */}

    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl space-y-4">

      <h2 className="text-lg font-semibold">إضافة منتج</h2>

      <input
        value={name}
        placeholder="اسم المنتج"
        onChange={e => setName(e.target.value)}
        className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-slate-700"
      />

      <input
        value={price}
        placeholder="السعر"
        onChange={e => setPrice(e.target.value)}
        className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-slate-700"
      />

      <select
        value={categoryId}
        onChange={e => setCategoryId(e.target.value)}
        className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-slate-700"
      >
        <option value="">اختر الفئة</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <textarea
        value={description}
        placeholder="الوصف"
        onChange={e => setDescription(e.target.value)}
        className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-slate-700"
      />

      <label className="w-full block cursor-pointer">
        <div className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl transition">
          اختر صورة المنتج
        </div>

        <input
          type="file"
          hidden
          onChange={(e) => {
            const files = e.target.files
            if (files && files.length > 0) {
              setImageFile(files[0])
              setPreview(URL.createObjectURL(files[0]))
            }
          }}
        />
      </label>

      {preview && (
        <img
          src={preview}
          className="w-full h-60 object-cover rounded-xl"
        />
      )}

      <button
        onClick={addProduct}
        className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
      >
        {loading ? "جارٍ الإضافة..." : "إضافة المنتج"}
      </button>

    </div>

  </div>
)
}