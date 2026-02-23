"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Shield, UserPlus, Trash2 } from "lucide-react"

export default function ManageAdmins() {

  const router = useRouter()

  const [admins, setAdmins] = useState<any[]>([])
  const [email, setEmail] = useState("")
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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

    setLoading(true)

    const res = await fetch("/api/create-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password: "12345678"
      })
    })

    const data = await res.json()

    setLoading(false)

    if (data.error) {
      alert(data.error)
      return
    }

    setEmail("")
    fetchAdmins()
  }

  async function removeAdmin(id: string) {

    if (id === currentUserId) {
      alert("لا يمكنك حذف نفسك")
      return
    }

    if (!confirm("هل أنت متأكد من حذف هذا الأدمن؟")) return

    await fetch("/api/delete-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })

    fetchAdmins()
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="text-indigo-600" />
          إدارة الأدمن
        </h1>

        <div className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm shadow">
          عدد الأدمن: {admins.length}
        </div>
      </div>

      {/* Add Admin Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 space-y-4">

        <h2 className="text-lg font-semibold flex items-center gap-2">
          <UserPlus size={18} />
          إضافة أدمن جديد
        </h2>

        <div className="flex gap-3">

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="flex-1 border p-3 rounded-xl bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            onClick={addAdmin}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 rounded-xl hover:bg-indigo-700 transition shadow"
          >
            {loading ? "جارٍ الإنشاء..." : "إضافة"}
          </button>

        </div>

      </div>

      {/* Admin List */}
      <div className="grid gap-5 md:grid-cols-2">

        {admins.map(admin => (

          <div
            key={admin.id}
            className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition flex justify-between items-center"
          >

            <div>
              <p className="font-semibold text-lg">
                {admin.email}
              </p>

              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold
                  ${admin.role === "super_admin"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"}`}
              >
                {admin.role === "super_admin" ? "Super Admin" : "Admin"}
              </span>
            </div>

            {admin.role !== "super_admin" && (
              <button
                onClick={() => removeAdmin(admin.id)}
                className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition shadow"
              >
                <Trash2 size={16} />
              </button>
            )}

          </div>

        ))}

      </div>

    </div>
  )
}