"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Shield, UserPlus, Trash2, RotateCcw } from "lucide-react"

export default function ManageAdmins() {

  const router = useRouter()

  const [admins, setAdmins] = useState<any[]>([])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

    if (!email || !password) {
      alert("أدخل الإيميل والباسورد")
      return
    }

    setLoading(true)

    const res = await fetch("/api/create-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()
    setLoading(false)

    if (data.error) {
      alert(data.error)
      return
    }

    setEmail("")
    setPassword("")
    fetchAdmins()
  }

  async function toggleAdmin(id: string, currentState: boolean) {

    if (id === currentUserId) {
      alert("لا يمكنك تعطيل نفسك")
      return
    }

    await supabase
      .from("profiles")
      .update({ is_active: !currentState })
      .eq("id", id)

    fetchAdmins()
  }

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="text-indigo-600" />
          إدارة الأدمن
        </h1>
        <div className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm shadow">
          عدد الأدمن: {admins.length}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 space-y-4">

        <h2 className="text-lg font-semibold flex items-center gap-2">
          <UserPlus size={18} />
          إضافة أدمن جديد
        </h2>

        <div className="grid md:grid-cols-3 gap-3">

          <input
            type="email"
            autoCapitalize="none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@email.com"
            className="border p-3 rounded-xl"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            className="border p-3 rounded-xl"
          />

          <button
            onClick={addAdmin}
            disabled={loading}
            className="bg-indigo-600 text-white rounded-xl"
          >
            {loading ? "جارٍ الإنشاء..." : "إضافة"}
          </button>

        </div>

      </div>

      <div className="grid gap-5 md:grid-cols-2">

        {admins.map(admin => (

          <div
            key={admin.id}
            className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-lg flex justify-between items-center"
          >

            <div>
              <p className="font-semibold text-lg">
                {admin.email}
              </p>

              <div className="flex gap-2 mt-2">

                <span className={`text-xs px-3 py-1 rounded-full font-semibold
                  ${admin.role === "super_admin"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"}`}>
                  {admin.role}
                </span>

                <span className={`text-xs px-3 py-1 rounded-full font-semibold
                  ${admin.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"}`}>
                  {admin.is_active ? "مفعل" : "معطل"}
                </span>

              </div>

            </div>

            {admin.role !== "super_admin" && (
              <button
                onClick={() => toggleAdmin(admin.id, admin.is_active)}
                className="bg-red-500 text-white p-3 rounded-xl"
              >
                {admin.is_active ? <Trash2 size={16} /> : <RotateCcw size={16} />}
              </button>
            )}

          </div>

        ))}

      </div>

    </div>
  )
}