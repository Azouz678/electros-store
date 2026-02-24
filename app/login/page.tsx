"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setErrorMessage("")

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setLoading(false)
      setErrorMessage("البريد أو كلمة المرور غير صحيحة")
      return
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_active")
      .eq("id", data.user.id)
      .single()

    if (!profile?.is_active) {
      await supabase.auth.signOut()
      setLoading(false)
      setErrorMessage("تم تعطيل حسابك من قبل الإدارة")
      return
    }

    setSuccess(true)

    setTimeout(() => {
      router.push("/dashboard/home")
    }, 800)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center
      bg-gradient-to-br 
      from-[#C59B3C]/20 
      via-white 
      to-[#C59B3C]/10
      dark:from-[#0B1220]
      dark:via-[#111827]
      dark:to-[#0F172A]
      transition-colors duration-700 p-6 overflow-hidden">

      {/* Glow */}
      <div className="absolute w-96 h-96 bg-[#C59B3C]/30 blur-3xl rounded-full -top-32 -left-32 animate-pulse" />
      <div className="absolute w-96 h-96 bg-[#C59B3C]/20 blur-3xl rounded-full -bottom-32 -right-32 animate-pulse" />

      <div className={`
        relative z-10 w-full max-w-md
        bg-white/70 dark:bg-[#111827]/80
        backdrop-blur-3xl
        border border-white/30 dark:border-gray-700
        rounded-3xl shadow-2xl p-8 space-y-6
        transition-all duration-500
        ${success ? "opacity-0 scale-95" : "opacity-100 scale-100"}
      `}>

        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-[#C59B3C] to-amber-500 bg-clip-text text-transparent">
            لوحة التحكم
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            تسجيل الدخول لإدارة النظام
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-100 dark:bg-red-900/40
            text-red-600 dark:text-red-400
            p-3 rounded-xl text-sm text-center animate-bounce">
            {errorMessage}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            البريد الإلكتروني
          </label>
         <br />
        <input
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="admin@email.com"
          className="w-full border border-gray-300 dark:border-gray-600
            bg-white dark:bg-[#1E293B]
            text-gray-900 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            p-3 rounded-xl
            focus:ring-2 focus:ring-[#C59B3C]
            outline-none transition-all duration-300"
        />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            كلمة المرور
            
          </label>
        <br />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 dark:border-gray-600
                bg-white dark:bg-[#1E293B]
                text-gray-900 dark:text-white
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                p-3 pr-16 rounded-xl
                focus:ring-2 focus:ring-[#C59B3C]
                outline-none transition-all duration-300"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2
                text-gray-500 dark:text-gray-400
                hover:text-[#C59B3C] transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl
            bg-gradient-to-r from-[#C59B3C] to-amber-500
            text-white font-semibold
            shadow-lg hover:shadow-xl
            hover:scale-[1.03]
            active:scale-[0.98]
            transition-all duration-300"
        >
          {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
        </button>

      </div>
    </div>
  )
}