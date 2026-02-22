"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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

export default function Dashboard() {

  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [categoryName, setCategoryName] = useState("")
  const [categoryImage, setCategoryImage] = useState<File | null>(null)

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
      .order("created_at", { ascending: false })

    setCategories(data || [])
  }

  // ===============================
  // إضافة فئة
  // ===============================

  async function addCategory() {

    if (!categoryName) return alert("اكتب اسم الفئة")

    const slug = generateSlug(categoryName)

    // منع التكرار
    const { data: existing } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .single()

    if (existing) return alert("الفئة موجودة مسبقًا")

    let imageUrl = null

    if (categoryImage) {
      const fileName = `cat-${Date.now()}-${categoryImage.name}`

      const { error: uploadError } = await supabase.storage
        .from("categories")
        .upload(fileName, categoryImage)

      if (uploadError) return alert("فشل رفع صورة الفئة")

      const { data } = supabase.storage
        .from("categories")
        .getPublicUrl(fileName)

      imageUrl = data.publicUrl
    }

    await supabase.from("categories").insert([
      {
        name: categoryName,
        slug,
        image: imageUrl,
        is_active: true
      }
    ])

    setCategoryName("")
    setCategoryImage(null)
    fetchCategories()
  }

  // ===============================
  // إضافة منتج
  // ===============================

  async function addProduct() {

    if (!imageFile || !categoryId || !name || !price)
      return alert("أكمل جميع البيانات")

    setLoading(true)

    const slug = generateSlug(name)

    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .single()

    if (existing) {
      setLoading(false)
      return alert("منتج بنفس الاسم موجود")
    }

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
        slug,
        is_active: true
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

      {/* إضافة فئة */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl space-y-4 mb-10">

        <h2 className="text-lg font-semibold">إضافة فئة</h2>

        <input
          value={categoryName}
          placeholder="اسم الفئة"
          onChange={e => setCategoryName(e.target.value)}
          className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-slate-700"
        />

        <input
          type="file"
          onChange={(e) => {
            if (e.target.files) setCategoryImage(e.target.files[0])
          }}
          className="w-full"
        />

        <button
          onClick={addCategory}
          className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700"
        >
          إضافة الفئة
        </button>

      </div>

      {/* إضافة منتج */}
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

        <input
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              setImageFile(e.target.files[0])
              setPreview(URL.createObjectURL(e.target.files[0]))
            }
          }}
          className="w-full"
        />

        {preview && (
          <img
            src={preview}
            className="w-full h-60 object-cover rounded-xl"
          />
        )}

        <button
          onClick={addProduct}
          className="w-full bg-green-600 text-white py-3 rounded-xl"
        >
          {loading ? "جارٍ الإضافة..." : "إضافة المنتج"}
        </button>

      </div>

    </div>
  )
}