"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function ManageAdmins() {

  const router = useRouter()
  const [admins, setAdmins] = useState<any[]>([])
  const [email, setEmail] = useState("")

  useEffect(() => {
    checkSuperAdmin()
    fetchAdmins()
  }, [])

  async function checkSuperAdmin() {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return router.push("/login")

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single()

    if (!profile || profile.role !== "super_admin") {
      router.push("/")
    }
  }

  async function fetchAdmins() {
    const { data } = await supabase
      .from("profiles")
      .select("*")

    setAdmins(data || [])
  }

  async function addAdmin() {

    const { data: userData } = await supabase.auth.admin.createUser({
      email,
      password: "12345678"
    })

    if (!userData.user) return alert("فشل إنشاء المستخدم")

    await supabase.from("profiles").insert({
      id: userData.user.id,
      email,
      role: "admin"
    })

    setEmail("")
    fetchAdmins()
  }

  async function removeAdmin(id: string) {

    await supabase.from("profiles").delete().eq("id", id)

    fetchAdmins()
  }

  return (
    <div>

      <h1>إدارة الأدمن</h1>

      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="إيميل الأدمن الجديد"
      />

      <button onClick={addAdmin}>
        إضافة Admin
      </button>

      {admins.map(a => (
        <div key={a.id}>
          {a.email} - {a.role}

          {a.role !== "super_admin" && (
            <button onClick={() => removeAdmin(a.id)}>
              حذف
            </button>
          )}
        </div>
      ))}

    </div>
  )
}