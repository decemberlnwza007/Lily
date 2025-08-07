'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, Heart, Flower } from 'lucide-react'

import './../style/login.css'

export default function LilyLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login:', { email, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-emerald-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-mint-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-emerald-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-teal-200 rounded-full blur-2xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-mint-100 to-emerald-100 rounded-full mb-4 shadow-lg">
            <div className="relative">
              <Flower className="w-8 h-8 text-mint-600" />
              <Heart className="w-4 h-4 text-rose-400 absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ยินดีต้อนรับสู่ Lily
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            พื้นที่ปลอดภัยสำหรับสุขภาพใจของคุณ
            <br />
            เราพร้อมอยู่เคียงข้างคุณในทุกช่วงเวลา
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 block"
              >
                อีเมล
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mint-500" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-mint-200 rounded-2xl focus:ring-2 focus:ring-mint-300 focus:border-mint-300 outline-none transition-all duration-200 bg-white/70 placeholder-gray-400"
                  placeholder="กรอกอีเมลของคุณ"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 block"
              >
                รหัสผ่าน
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mint-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-mint-200 rounded-2xl focus:ring-2 focus:ring-mint-300 focus:border-mint-300 outline-none transition-all duration-200 bg-white/70 placeholder-gray-400"
                  placeholder="กรอกรหัสผ่านของคุณ"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-mint-500 hover:text-mint-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-mint-500 to-emerald-500 text-white py-3 px-6 rounded-2xl font-medium shadow-lg hover:shadow-xl hover:from-mint-600 hover:to-emerald-600 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-mint-300 focus:ring-offset-2"
            >
              เข้าสู่ระบบ Lily
            </button>

            <div className="text-center">
              <a
                href="#"
                className="text-mint-600 hover:text-mint-700 text-sm font-medium transition-colors duration-200 hover:underline"
              >
                ลืมรหัสผ่านใช่ไหม? คลิกที่นี่
              </a>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              ยังไม่มีบัญชีใช่ไหม?{' '}
              <a
                href="#"
                className="text-mint-600 hover:text-mint-700 font-medium hover:underline transition-colors duration-200"
              >
                สมัครสมาชิกที่นี่
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .from-mint-50 {
          --tw-gradient-from: #f0fdfa;
        }
        .to-emerald-50 {
          --tw-gradient-to: #ecfdf5;
        }
        .bg-mint-50 {
          background-color: #f0fdfa;
        }
        .bg-mint-100 {
          background-color: #ccfbf1;
        }
        .bg-mint-200 {
          background-color: #99f6e4;
        }
        .text-mint-500 {
          color: #14b8a6;
        }
        .text-mint-600 {
          color: #0d9488;
        }
        .text-mint-700 {
          color: #0f766e;
        }
        .border-mint-100 {
          border-color: #ccfbf1;
        }
        .border-mint-200 {
          border-color: #99f6e4;
        }
        .border-mint-300 {
          border-color: #5eead4;
        }
        .focus\\:ring-mint-300:focus {
          --tw-ring-color: #5eead4;
        }
        .focus\\:border-mint-300:focus {
          border-color: #5eead4;
        }
        .from-mint-500 {
          --tw-gradient-from: #14b8a6;
        }
        .to-emerald-500 {
          --tw-gradient-to: #10b981;
        }
        .hover\\:from-mint-600:hover {
          --tw-gradient-from: #0d9488;
        }
        .hover\\:to-emerald-600:hover {
          --tw-gradient-to: #059669;
        }
        .hover\\:text-mint-600:hover {
          color: #0d9488;
        }
        .hover\\:text-mint-700:hover {
          color: #0f766e;
        }
        .bg-mint-50\\/50 {
          background-color: rgb(240 253 250 / 0.5);
        }
      `}</style>
    </div>
  )
}
