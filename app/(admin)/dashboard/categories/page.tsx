"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Pencil, Trash2, ImagePlus, Power, CheckCircle } from "lucide-react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"

import { CSS } from "@dnd-kit/utilities"



type Category = {
  id: string
  name: string
  slug: string
  image: string | null
  is_active: boolean
  display_order: number
}



function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
}

// مكوّن العنصر القابل للسحب
function SortableItem({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing touch-none"
    >
      {children}
    </div>
  )
}




export default function ManageCategories() {

  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<Category | null>(null)
  const [newName, setNewName] = useState("")
  const [search, setSearch] = useState("")
  const [newImage, setNewImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [updateState, setUpdateState] = useState<"idle" | "loading" | "success">("idle")


      const sensors = useSensors(
        useSensor(PointerSensor, {
          activationConstraint: { distance: 6 },
        }),
        useSensor(TouchSensor, {
          activationConstraint: {
            delay: 200,     // مهم جداً للموبايل
            tolerance: 5,
          },
        })
      )

  async function handleDragEnd(event: any) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = categories.findIndex((c) => c.id === active.id)
    const newIndex = categories.findIndex((c) => c.id === over.id)

    const newArray = arrayMove(categories, oldIndex, newIndex)
    setCategories(newArray)

    // ✅ تحديث قاعدة البيانات: 1..N
    const updates = newArray.map((cat, idx) => ({
      id: cat.id,
      display_order: idx + 1,
    }))

    // تحديثات متتالية (آمنة وبسيطة)
    for (const row of updates) {
      const { error } = await supabase
        .from("categories")
        .update({ display_order: row.display_order })
        .eq("id", row.id)

      if (error) {
        alert("حصل خطأ أثناء حفظ ترتيب الفئات: " + error.message)
        return
      }
    }

    showSuccess("تم حفظ ترتيب الفئات ✅")
  }



  useEffect(() => {
    fetchCategories()
  }, [search])

  async function fetchCategories() {
    let query = supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true })

    if (search.trim() !== "") {
      query = query.ilike("name", `%${search}%`)
    }

    const { data } = await query
    setCategories(data || [])
  }

  function showSuccess(msg: string) {
    setSuccessMessage(msg)
    setTimeout(() => setSuccessMessage(null), 2500)
  }

  async function deleteCategory(cat: Category) {

    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category_id", cat.id)

    if ((count || 0) > 0) {
      alert("لا يمكن حذف الفئة لأنها مرتبطة بمنتجات")
      return
    }

    if (!confirm("هل أنت متأكد من الحذف؟")) return

    if (cat.image) {
      const fileName = cat.image.split("/").pop()
      if (fileName) {
        await supabase.storage.from("categories").remove([fileName])
      }
    }

    await supabase.from("categories").delete().eq("id", cat.id)
    fetchCategories()
  }

  async function toggleActive(cat: Category) {
    await supabase
      .from("categories")
      .update({ is_active: !cat.is_active })
      .eq("id", cat.id)

    fetchCategories()
  }

 async function updateCategory() {
  if (!editing) return

  setUpdateState("loading")

  const trimmed = newName.trim()
  if (!trimmed) {
    setUpdateState("idle")
    return alert("اسم الفئة مطلوب")
  }

  const slug = generateSlug(trimmed)

  const { data: existing } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .neq("id", editing.id)

  if (existing && existing.length > 0) {
    setUpdateState("idle")
    return alert("فئة بنفس الاسم موجودة")
  }

  let imageUrl = editing.image

  if (newImage) {
    if (editing.image) {
      const oldFile = editing.image.split("/").pop()
      if (oldFile) await supabase.storage.from("categories").remove([oldFile])
    }

    const fileName = `cat-${Date.now()}-${newImage.name}`

    const { error } = await supabase.storage
      .from("categories")
      .upload(fileName, newImage)

    if (error) {
      setUpdateState("idle")
      return alert("فشل رفع الصورة")
    }

    const { data } = supabase.storage
      .from("categories")
      .getPublicUrl(fileName)

    imageUrl = data.publicUrl
  }

  const { error: updateError } = await supabase
    .from("categories")
    .update({
      name: trimmed,
      slug,
      image: imageUrl,
    })
    .eq("id", editing.id)

  if (updateError) {
    setUpdateState("idle")
    return alert(updateError.message)
  }

  setUpdateState("success")
  showSuccess("تم تحديث الفئة بنجاح ✅")

  setTimeout(() => {
    setEditing(null)
    setNewImage(null)
    setPreview(null)
    setUpdateState("idle")
    fetchCategories()
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

      <h1 className="text-2xl font-bold">إدارة الفئات</h1>

      <input
        type="text"
        placeholder="ابحث عن فئة..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-xl bg-white dark:bg-[#1E293B] border focus:ring-2 focus:ring-[#C59B3C] outline-none transition"
      />

  <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
    <SortableContext
          items={categories.map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
    <div className="space-y-4">
        {categories.map(cat => (
          <SortableItem key={cat.id} id={cat.id}>
            <div
              className="
                bg-white dark:bg-slate-800
                p-4
                rounded-2xl
                shadow-md
                flex justify-between items-center
                transition
                hover:shadow-xl
                hover:scale-[1.01]
              "
            >
              <div className="flex items-center gap-4">

                {cat.image && (
                  <img
                    src={cat.image}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                )}

                <div>
                  <p className="font-semibold text-lg">{cat.name}</p>
                  <p className={`text-xs ${cat.is_active ? "text-green-600" : "text-red-500"}`}>
                    {cat.is_active ? "مفعلة" : "موقوفة"}
                  </p>
                </div>

              </div>

              <div className="flex gap-2">

                <button
                  onClick={() => toggleActive(cat)}
                  className="bg-yellow-500 text-white px-3 py-2 rounded-xl hover:scale-105 transition"
                >
                  <Power size={16} />
                </button>

                <button
                  onClick={() => {
                    setEditing(cat)
                    setNewName(cat.name)
                    setPreview(cat.image)
                  }}
                  className="bg-blue-500 text-white px-3 py-2 rounded-xl hover:scale-105 transition"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => deleteCategory(cat)}
                  className="bg-red-500 text-white px-3 py-2 rounded-xl hover:scale-105 transition"
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>
          </SortableItem>
        ))}
        </div>
      </SortableContext>
    </DndContext>

      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-96 space-y-4 shadow-2xl animate-fadeIn">

            <h2 className="text-xl font-bold">تعديل الفئة</h2>

            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full border p-3 rounded-xl"
            />

            <label className="relative flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-[#C59B3C]/60 text-[#C59B3C] hover:bg-[#C59B3C]/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <ImagePlus size={16} />
              اختر صورة للفئة
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
              <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setEditing(null)}
                className="border px-4 py-2 rounded-xl"
              >
                إلغاء
              </button>

              <button
                onClick={updateCategory}
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
