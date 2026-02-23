"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function ManageAdmins() {

  const router = useRouter()

  const [admins, setAdmins] = useState<any[]>([])
  const [email, setEmail] = useState("")
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    checkSuperAdmin()
    fetchAdmins()
  }, [])

  async function checkSuperAdmin() {

    const { data: userData } = await supabase.auth.getUser()

    if (!userData.user) {
      router.push("/login")
      return
    }

    setCurrentUserId(userData.user.id)

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single()

    if (!profile || profile.role !== "super_admin") {
      router.push("/dashboard")
    }
  }

  async function fetchAdmins() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    setAdmins(data || [])
  }

  async function addAdmin() {

    if (!email) return alert("اكتب الإيميل")

    const res = await fetch("/api/create-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password: "12345678"
      })
    })

    const data = await res.json()

    if (data.error) {
      alert(data.error)
      return
    }

    alert("تم إنشاء الأدمن بنجاح")

    setEmail("")
    fetchAdmins()
  }

  async function removeAdmin(id: string) {

    if (id === currentUserId) {
      alert("لا يمكنك حذف نفسك")
      return
    }

    const res = await fetch("/api/delete-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })

    const data = await res.json()

    if (data.error) {
      alert(data.error)
      return
    }

    alert("تم حذف الأدمن بنجاح")

    fetchAdmins()
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        إدارة الأدمن
      </h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="إيميل الأدمن الجديد"
          className="border p-3 w-full rounded-lg"
        />

        <button
          onClick={addAdmin}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
        >
          إضافة Admin
        </button>

      </div>

      <div className="space-y-3">

        {admins.map(admin => (
          <div
            key={admin.id}
            className="flex justify-between items-center bg-white p-4 rounded-xl shadow"
          >

            <div>
              <p className="font-semibold">{admin.email}</p>
              <p className="text-sm text-gray-500">{admin.role}</p>
            </div>

            {admin.role !== "super_admin" && (
              <button
                onClick={() => removeAdmin(admin.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                حذف
              </button>
            )}

          </div>
        ))}

      </div>

    </div>
  )
}