"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    setLoading(false)

    if (!error) {
      router.push("/dashboard")
    } else {
      alert("بيانات الدخول غير صحيحة")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900">

      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-md">

        <h1 className="text-2xl font-bold mb-6 text-center">
          تسجيل الدخول
        </h1>

        <input
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 border p-3 rounded-xl"
        />

<div className="relative mb-6">

  <input
    type={showPassword ? "text" : "password"}
    placeholder="كلمة المرور"
    value={password}
    onChange={e => setPassword(e.target.value)}
    className="w-full border p-3 rounded-xl pr-12"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
  >
    {showPassword ? "🙈" : "👁️"}
  </button>

</div>

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition"
        >
          {loading ? "جارٍ الدخول..." : "دخول"}
        </button>

      </div>
    </div>
  )
}