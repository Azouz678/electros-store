"use client"

import { supabase } from "@/lib/supabase"
import {useEffect, useState } from "react"
import { useRef } from "react"
import { useRouter } from "next/navigation"
import { ImagePlus, CheckCircle } from "lucide-react"
import InstallButton from "@/components/InstallButton"
type Category = {
  id: string
  name: string
}


/* ===== أضفنا هذه الدالة فقط ===== */
function formatPrice(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
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




export default function Dashboard() {

  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [categoryName, setCategoryName] = useState("")
  const [categoryImage, setCategoryImage] = useState<File | null>(null)
  const [categoryPreview, setCategoryPreview] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [currency, setCurrency] = useState<"YER" | "SAR" | "USD">("YER") /* ===== أضفنا هذا ===== */
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  // const [imageFile, setImageFile] = useState<File | null>(null)
  // const [productPreview, setProductPreview] = useState<string | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [productPreviews, setProductPreviews] = useState<string[]>([])
  const [primaryIndex, setPrimaryIndex] = useState<number | null>(null)

  const [loading, setLoading] = useState(false)

  // ✅ (تعديل 1) أضفنا state لرسالة النجاح
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // ✅ (تعديل 2) دالة عرض الرسالة وتختفي تلقائياً
  function showSuccess(message: string) {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }

  // useEffect(() => {
  //   async function checkUser() {
  //     const { data } = await supabase.auth.getUser()
  //     if (!data.user) router.push("/login")
  //   }
  //   checkUser()
  // }, [])
  useEffect(() => {
  async function checkAccess() {

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return router.push("/login")

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single()

    if (!profile) {
      await supabase.auth.signOut()
      router.push("/login")
    }
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
      .order("display_order", { ascending: true })

    setCategories(data || [])
  }

  // ===============================
  // إضافة فئة
  // ===============================

  async function addCategory() {
    setLoading(true)
    
    if (!categoryName) {
          setLoading(false)
          return alert("اكتب اسم الفئة")
    }

    const slug = generateSlug(categoryName)

    const { data: existing } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .single()


    if (existing) {
      setLoading(false)
      return alert("الفئة موجودة مسبقًا")
    }


    let imageUrl = null

    if (categoryImage) {
      const fileName = `cat-${Date.now()}.jpg`

      const { error: uploadError } = await supabase.storage
        .from("categories")
        .upload(fileName, categoryImage)

      if (uploadError) return alert("فشل رفع صورة الفئة")

      const { data } = supabase.storage
        .from("categories")
        .getPublicUrl(fileName)

      imageUrl = data.publicUrl
    }


        // هات أكبر display_order موجود
          const { data: lastRow, error: lastErr } = await supabase
            .from("categories")
            .select("display_order")
            .order("display_order", { ascending: false })
            .limit(1)
            .maybeSingle()

          if (lastErr) {
            setLoading(false)
            return alert("خطأ في قراءة ترتيب الفئات: " + lastErr.message)
          }
          const nextOrder = (lastRow?.display_order ?? 0) + 1


          const { error: insertErr } = await supabase.from("categories").insert([
            {
              name: categoryName,
              slug,
              image: imageUrl,
              is_active: true,
              display_order: nextOrder,
            },
          ])

          if (insertErr) {
            setLoading(false)
            return alert("فشل إضافة الفئة: " + insertErr.message)
          }


    setLoading(false)
    setCategoryName("")
    setCategoryImage(null)
    setCategoryPreview(null)

    fetchCategories()

    // ✅ (تعديل 3) رسالة نجاح إضافة الفئة
    showSuccess("تم إضافة الفئة بنجاح ✅")
  }

  // ===============================
  // إضافة منتج
  // ===============================

      async function addProduct() {

        if (!imageFiles.length || !categoryId || !name || !price)
          return alert("أكمل جميع البيانات")
        
        if (primaryIndex === null) {
              return alert("حدد الصورة الرئيسية")
        }


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

        // 1️⃣ نحفظ المنتج أولاً بدون صور
        const { data: newProduct, error: productError } = await supabase
          .from("products")
          .insert([{
            name,
            price: Number(price),
            currency,
            description,
            category_id: categoryId,
            slug,
            is_active: true
          }])
          .select()
          .single()

        if (productError || !newProduct) {
          setLoading(false)
          return alert("فشل إضافة المنتج")
        }

        // 2️⃣ رفع الصور وحفظها في جدول منفصل
        for (let i = 0; i < imageFiles.length; i++) {

          const file = imageFiles[i]
          const fileName = `prod-${Date.now()}-${i}.jpg`

          const { error: uploadError } = await supabase.storage
            .from("products")
            .upload(fileName, file)

          if (uploadError) {
            setLoading(false)
            return alert("فشل رفع إحدى الصور")
          }

          const { data } = supabase.storage
            .from("products")
            .getPublicUrl(fileName)

          await supabase.from("product_images").insert({
            product_id: newProduct.id,
            image_url: data.publicUrl,
            sort_order: i,
            is_primary: primaryIndex === i
          })
        }

        setLoading(false)
        setName("")
        setPrice("")
        setDescription("")
        setCategoryId("")
        setImageFiles([])
        setProductPreviews([])
        setPrimaryIndex(null) 
        if (fileInputRef.current) {
             fileInputRef.current.value = ""
          }
     
        showSuccess("تم إضافة المنتج بنجاح ✅")
      }

  return (
    <div className="max-w-3xl">

      {/* ✅ (تعديل 5) واجهة Toast تظهر أعلى الصفحة */}
      {successMessage && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle size={18} />
          {successMessage}
        </div>
      )}

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


        <div className="space-y-3">

          <label className="block text-sm font-medium">
            صورة الفئة
          </label>

          <div className="relative border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl p-6 text-center cursor-pointer hover:border-purple-500 transition group">

            {!categoryPreview ? (
              <>
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <ImagePlus size={28} />
                  <p className="text-sm">اضغط لاختيار صورة</p>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files) {
                      const file = e.target.files[0]
                      setCategoryImage(file)
                      setCategoryPreview(URL.createObjectURL(file))
                    }
                  }}
                />
              </>
            ) : (
              <>
                <img
                  src={categoryPreview}
                  className="w-full h-40 object-cover rounded-xl"
                />

                <button
                  type="button"
                  onClick={() => {
                    setCategoryImage(null)
                    setCategoryPreview(null)
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow"
                >
                  حذف
                </button>
              </>
            )}

          </div>

        </div>

         <button
          onClick={addCategory}
          className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700"
        >
          {loading ? "جارٍ الإضافة..." : "إضافة الفئة"}
        </button>

        {/* <button
          onClick={addCategory}
          className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700"
        >
          إضافة الفئة
        </button> */}

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

      <div className="space-y-2">

        <div className="flex gap-3">

          <input
            type="number"
            inputMode="numeric"
            min="0"
            value={price}
            placeholder="السعر"
            onChange={e => setPrice(e.target.value)}
            className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-slate-700 text-lg font-semibold"
          />

          <select
            value={currency}
            onChange={e => setCurrency(e.target.value as any)}
            className="border p-3 rounded-xl bg-gray-50 dark:bg-slate-700"
          >
            <option value="YER">🇾🇪 YER</option>
            <option value="SAR">🇸🇦 SAR</option>
            <option value="USD">🇺🇸 USD</option>
          </select>

        </div>

        {price && (
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl text-green-700 dark:text-green-400 font-bold text-lg">
            {formatPrice(Number(price), currency)}
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

        <textarea
          value={description}
          placeholder="الوصف"
          onChange={e => setDescription(e.target.value)}
          className="w-full border p-3 rounded-xl bg-gray-50 dark:bg-slate-700"
        />

        <div className="space-y-3">

          <label className="block text-sm font-medium">
            صور المنتج
          </label>

          <div className="relative border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl p-6 text-center cursor-pointer hover:border-green-500 transition">

            <div className="flex flex-col items-center gap-2 text-gray-500">
              <ImagePlus size={28} />
              <p className="text-sm">اضغط لاختيار صور متعددة</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                if (!e.target.files) return

                const filesArray = Array.from(e.target.files)

                setImageFiles(filesArray)
                setProductPreviews(
                  filesArray.map(file => URL.createObjectURL(file))
                )
              }}
            />
          </div>

          {productPreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {productPreviews.map((preview, index) => (
              <div key={index} className="relative">

                <img
                  src={preview}
                  className={`w-full h-28 object-cover rounded-xl border-2 ${
                    primaryIndex === index ? "border-green-500" : "border-transparent"
                  }`}
                />

                {/* زر اختيار رئيسية */}
                <button
                  type="button"
                  onClick={() => setPrimaryIndex(index)}
                  className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded"
                >
                  رئيسية
                </button>

                {/* زر حذف */}
                <button
                  type="button"
                  onClick={() => {
                    const newFiles = [...imageFiles]
                    const newPreviews = [...productPreviews]

                    newFiles.splice(index, 1)
                    newPreviews.splice(index, 1)

                    setImageFiles(newFiles)
                    setProductPreviews(newPreviews)

                    if (primaryIndex === index) {
                      setPrimaryIndex(null)
                    }
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                >
                  حذف
                </button>

              </div>
            ))}
          </div>
          )}

        </div>

        <button
          onClick={addProduct}
          className="w-full bg-green-600 text-white py-3 rounded-xl"
        >
          {loading ? "جارٍ الإضافة..." : "إضافة المنتج"}
        </button>

      </div>
      <InstallButton />    
    </div>
  )
}