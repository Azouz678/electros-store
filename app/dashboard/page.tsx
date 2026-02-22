"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Category = {
  id: string
  name: string
}

type Product = {
  id: string
  name: string
  price: string
  category_id: string
  image: string
}

export default function Dashboard() {

  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])

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
    fetchData()
  }, [])

  async function fetchData() {
    const { data: categoriesData } = await supabase.from("categories").select("*")
    const { data: productsData } = await supabase.from("products").select("*")

    setCategories(categoriesData || [])
    setProducts(productsData || [])
  }

  async function deleteProduct(id: string) {
    const confirmDelete = confirm("هل أنت متأكد من حذف المنتج؟")
    if (!confirmDelete) return

    await supabase.from("products").delete().eq("id", id)
    fetchData()
  }

  async function deleteCategory(id: string) {
    const confirmDelete = confirm("هل أنت متأكد من حذف الفئة؟")
    if (!confirmDelete) return

    await supabase.from("categories").delete().eq("id", id)
    fetchData()
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
    fetchData()
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

    fetchData()
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6">

      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl space-y-10">

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push("/login")
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
          >
            تسجيل خروج
          </button>
        </div>

        {/* ===== الفئات ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-3">الفئات الحالية</h2>

          <div className="space-y-2 mb-4">
            {categories.map(cat => (
              <div key={cat.id} className="flex justify-between bg-gray-100 dark:bg-slate-700 p-3 rounded-xl">
                <span>{cat.name}</span>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>

          <input
            value={categoryName}
            placeholder="اسم الفئة"
            onChange={e => setCategoryName(e.target.value)}
            className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-slate-700"
          />

          <button
            onClick={addCategory}
            className="w-full mt-3 bg-purple-600 text-white py-2 rounded-xl"
          >
            إضافة فئة
          </button>
        </div>

        <hr />

        {/* ===== إضافة منتج ===== */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">إضافة منتج</h2>

          <input value={name} placeholder="اسم المنتج"
            onChange={e => setName(e.target.value)}
            className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-slate-700" />

          <input value={price} placeholder="السعر"
            onChange={e => setPrice(e.target.value)}
            className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-slate-700" />

          <select value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-slate-700">
            <option value="">اختر الفئة</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <textarea value={description} placeholder="الوصف"
            onChange={e => setDescription(e.target.value)}
            className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-slate-700" />

          <input type="file"
            onChange={(e) => {
              if (e.target.files) {
                setImageFile(e.target.files[0])
                setPreview(URL.createObjectURL(e.target.files[0]))
              }
            }}
          />

          {preview && (
            <img src={preview} className="h-40 rounded-xl" />
          )}

          <button
            onClick={addProduct}
            className="w-full bg-green-600 text-white py-3 rounded-xl"
          >
            {loading ? "جارٍ الإضافة..." : "إضافة المنتج"}
          </button>
        </div>

        <hr />

        {/* ===== قائمة المنتجات ===== */}
        <div>
          <h2 className="text-lg font-semibold mb-3">المنتجات الحالية</h2>

          <div className="space-y-3">
            {products.map(product => (
              <div key={product.id}
                className="flex justify-between items-center bg-gray-100 dark:bg-slate-700 p-3 rounded-xl">

                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.price}</p>
                </div>

                <button
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}