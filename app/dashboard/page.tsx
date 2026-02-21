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

      if (!data.user) {
        router.push("/login")
      }
    }

    checkUser()
  }, [])


  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    const { data } = await supabase.from("categories").select("*")
    setCategories(data || [])
  }

  async function addCategory() {
    if (!categoryName) {
      alert("اكتب اسم الفئة")
      return
    }

    const { error } = await supabase.from("categories").insert([
      {
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/\s+/g, "-")
      }
    ])

    if (!error) {
      alert("تم إضافة الفئة")
      setCategoryName("")
      fetchCategories()
    } else {
      alert("حدث خطأ أثناء إضافة الفئة")
    }
  }

  async function addProduct() {

    if (!imageFile || !categoryId || !name || !price) {
      alert("أكمل جميع البيانات")
      return
    }

    setLoading(true)

    const fileName = `${Date.now()}-${imageFile.name}`

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, imageFile)

    if (uploadError) {
      alert("فشل رفع الصورة")
      setLoading(false)
      return
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName)

    const imageUrl = data.publicUrl

    const { error } = await supabase.from("products").insert([
      {
        name,
        price,
        description,
        category_id: categoryId,
        image: imageUrl,
        slug: name.toLowerCase().replace(/\s+/g, "-")
      }
    ])

    setLoading(false)

    if (!error) {
      alert("تمت إضافة المنتج بنجاح")
      setName("")
      setPrice("")
      setDescription("")
      setCategoryId("")
      setPreview(null)
      setImageFile(null)
    } else {
      alert("حدث خطأ أثناء الحفظ")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6">

      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl space-y-10">

        <h1 className="text-2xl font-bold text-center">
          لوحة التحكم
        </h1>

        {/* ===== إضافة فئة ===== */}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">إضافة فئة جديدة</h2>

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

        <hr className="border-gray-300 dark:border-gray-600" />

        {/* ===== إضافة منتج ===== */}

        <div className="space-y-4">

          <h2 className="text-lg font-semibold">إضافة منتج جديد</h2>

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

          {imageFile && (
            <p className="text-sm text-gray-500">
              تم اختيار: {imageFile.name}
            </p>
          )}

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
    </div>
  )
}