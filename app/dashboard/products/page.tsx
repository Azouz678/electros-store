"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Pencil, Trash2 } from "lucide-react"

type Product = {
  id: string
  name: string
  price: string
  image: string
}

export default function ManageProducts() {

  const [products, setProducts] = useState<Product[]>([])
  const [editing, setEditing] = useState<Product | null>(null)
  const [newName, setNewName] = useState("")
  const [newPrice, setNewPrice] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*")
    setProducts(data || [])
  }

  async function deleteProduct(id: string) {
    if (!confirm("هل أنت متأكد من الحذف؟")) return
    await supabase.from("products").delete().eq("id", id)
    fetchProducts()
  }

  async function updateProduct() {
    if (!editing) return

    await supabase.from("products")
      .update({
        name: newName,
        price: newPrice
      })
      .eq("id", editing.id)

    setEditing(null)
    fetchProducts()
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        إدارة المنتجات
      </h1>

      <div className="grid gap-6">

        {products.map(product => (
          <div
            key={product.id}
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >

            {/* صورة + معلومات */}
            <div className="flex items-center gap-4">
              <img
                src={product.image}
                className="w-20 h-20 object-cover rounded-xl"
              />

              <div>
                <p className="font-semibold text-lg">
                  {product.name}
                </p>
                <p className="text-gray-500 text-sm">
                  {product.price}
                </p>
              </div>
            </div>

            {/* الأزرار */}
            <div className="flex gap-3 justify-end sm:justify-normal">

              <button
                onClick={() => {
                  setEditing(product)
                  setNewName(product.name)
                  setNewPrice(product.price)
                }}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
              >
                <Pencil size={16} />
                تعديل
              </button>

              <button
                onClick={() => deleteProduct(product.id)}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
              >
                <Trash2 size={16} />
                حذف
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* ===== Modal التعديل ===== */}

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-96 space-y-4">

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

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded-xl border"
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