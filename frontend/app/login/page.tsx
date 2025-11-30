'use client'

import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '../utils/supabase/client'
import { loginUser } from './action'
import '../style/login.css'
import Image from 'next/image'

const supabase = createClient()

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) redirect('/')
    }
    checkSession()
  }, [])

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await loginUser({ email, password })
    setLoading(false)

    if (result.success) {
      redirect('/')
    } else {
      alert(result.error)
    }
  }

  // Google OAuth
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-emerald-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-mint-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-emerald-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-teal-200 rounded-full blur-2xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">
            ยินดีต้อนรับสู่ Lily
          </h1>
          {/* <p className="text-gray-600 text-sm leading-relaxed">
            พื้นที่ปลอดภัยสำหรับสุขภาพใจของคุณ
            <br />
            เราพร้อมอยู่เคียงข้างคุณในทุกช่วงเวลา
          </p> */}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/50">
        {/* <div className="relative ">
      <Image
        src="/Lily/Lily.png"
        alt="Lily Mascot"
        width={140}
        height={140}
        className="animate-[breathing_3s_ease-in-out_infinite] opacity-95 drop-shadow-xl"
      />
    </div> */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">อีเมล</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="กรอกอีเมลของคุณ"
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-green-200  rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-white/70 placeholder-gray-400"
                />
              </div>
            </div>

            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">รหัสผ่าน</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านของคุณ"
                  required
                  className="w-full pl-12 pr-12 py-3 border-2 border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 bg-white/70 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-400 text-white py-3 px-6 rounded-2xl font-medium shadow-lg hover:shadow-xl hover:from-mint-600 hover:to-emerald-600 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-mint-300 focus:ring-offset-2"
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ Lily'}
            </button>

            {/* Forgot password */}
            <div className="text-center">
              <a href="#" className="text-mint-600 hover:text-mint-700 text-sm font-medium transition-colors duration-200 hover:underline">
                ลืมรหัสผ่านใช่ไหม? คลิกที่นี่
              </a>
            </div>

            {/* Register */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                ยังไม่มีบัญชีใช่ไหม?{' '}
                <Link href="/register" className="text-mint-600 hover:text-mint-700 font-medium hover:underline transition-colors duration-200">
                  สมัครสมาชิกที่นี่
                </Link>
              </p>
            </div>

            {/* Google OAuth */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center cursor-pointer border-white hover:border-solid hover:border-green-500 justify-center gap-3 bg-white border border-mint-200 text-mint-600 font-semibold px-6 py-3 rounded-2xl hover:bg-mint-50 transition w-full hover:bg-green-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 48 48" fill="none">
                  <path
                    d="M44.5 20H24v8.5h11.8C34.7 32 30.6 36 24 36c-7.3 0-13.3-6-13.3-13.3S16.7 9.3 24 9.3c3.7 0 6.7 1.6 8.8 4.1l6.2-6.2C34 4.7 29.4 3 24 3 12 3 3 12 3 24s9 21 21 21c11.5 0 20.9-8.2 20.9-19.7 0-1.3-.1-2.6-.4-3.8z"
                    fill="#4285F4"
                  />
                </svg>
                เข้าสู่ระบบด้วย Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}