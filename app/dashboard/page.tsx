"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ImagePlus, CheckCircle } from "lucide-react"

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

function formatPrice(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0
  }).format(value)
}

export default function Dashboard() {

  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])

  const [categoryName, setCategoryName] = useState("")
  const [categoryImage, setCategoryImage] = useState<File | null>(null)
  const [categoryPreview, setCategoryPreview] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [price, setPrice] = useState<number | "">("")
  const [currency, setCurrency] = useState<"YER" | "SAR" | "USD">("YER")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [productPreview, setProductPreview] = useState<string | null>(null)

  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [categoryBtn, setCategoryBtn] = useState<"idle" | "loading" | "success">("idle")
  const [productBtn, setProductBtn] = useState<"idle" | "loading" | "success">("idle")

  function showSuccess(message: string) {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  useEffect(() => {
    async function checkAccess() {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return router.push("/login")
    }
    checkAccess()
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

  async function addProduct() {

    if (!imageFile || !categoryId || !name || price === "")
      return alert("أكمل جميع البيانات")

    setProductBtn("loading")

    const slug = generateSlug(name)

    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .single()

    if (existing) {
      setProductBtn("idle")
      return alert("منتج بنفس الاسم موجود")
    }

    const fileName = `prod-${Date.now()}.jpg`

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, imageFile)

    if (error) {
      setProductBtn("idle")
      return alert("فشل رفع الصورة")
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName)

    await supabase.from("products").insert([
      {
        name,
        price,
        currency,
        description,
        category_id: categoryId,
        image: data.publicUrl,
        slug,
        is_active: true
      }
    ])

    setName("")
    setPrice("")
    setCurrency("YER")
    setDescription("")
    setCategoryId("")
    setProductPreview(null)
    setImageFile(null)

    setProductBtn("success")
    showSuccess("تم إضافة المنتج بنجاح ✅")

    setTimeout(() => setProductBtn("idle"), 1500)
  }

  return (
    <div className="max-w-3xl">

      {successMessage && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle size={18} />
          {successMessage}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-8">
        إضافة منتج
      </h1>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl space-y-4">

        <input
          value={name}
          placeholder="اسم المنتج"
          onChange={e => setName(e.target.value)}
          className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-slate-700"
        />

        {/* ===== السعر المعدل ===== */}

        <div className="space-y-2">

          <div className="flex gap-3">

            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={price}
              placeholder="السعر"
              onChange={e => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-slate-700 text-lg font-semibold"
            />

            <select
              value={currency}
              onChange={e => setCurrency(e.target.value as any)}
              className="border p-3 rounded-xl bg-gray-50 dark:bg-slate-700 font-medium"
            >
              <option value="YER">🇾🇪 YER</option>
              <option value="SAR">🇸🇦 SAR</option>
              <option value="USD">🇺🇸 USD</option>
            </select>

          </div>

          {price !== "" && (
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl text-green-700 dark:text-green-400 font-bold text-lg">
              {formatPrice(price as number, currency)}
            </div>
          )}

        </div>

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

        <button
          onClick={addProduct}
          disabled={productBtn === "loading"}
          className={`
            w-full py-3 rounded-xl font-semibold text-white transition-all duration-300
            ${productBtn === "idle" && "bg-green-600 hover:scale-105"}
            ${productBtn === "loading" && "bg-gray-400 cursor-not-allowed"}
            ${productBtn === "success" && "bg-green-700 animate-pulse"}
          `}
        >
          {productBtn === "idle" && "إضافة المنتج"}

          {productBtn === "loading" && (
            <div className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              جاري الإضافة...
            </div>
          )}

          {productBtn === "success" && "✔ تم بنجاح"}
        </button>

      </div>

    </div>
  )
}