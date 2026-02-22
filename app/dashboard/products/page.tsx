"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Product = {
  id: string
  name: string
  price: string
  image: string
}

export default function ManageProducts() {

  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*")
    setProducts(data || [])
  }

  async function deleteProduct(id: string) {
    const confirmDelete = confirm("هل أنت متأكد؟")
    if (!confirmDelete) return

    await supabase.from("products").delete().eq("id", id)
    fetchProducts()
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-slate-900">

      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl">

        <h1 className="text-2xl font-bold mb-6">
          إدارة المنتجات
        </h1>

        <div className="space-y-4">

          {products.map(product => (
            <div
              key={product.id}
              className="flex justify-between items-center bg-gray-100 dark:bg-slate-700 p-4 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.image}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.price}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded-lg">
                  تعديل
                </button>

                <button
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  )
}