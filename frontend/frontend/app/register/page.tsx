'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Image as ImageIcon } from 'lucide-react'
import '../style/login.css'

export default function RegisterForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [image, setImage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('รหัสผ่านไม่ตรงกัน')
      return
    }
    if (password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE + '/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, firstname, lastname, image }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || 'สมัครสมาชิกไม่สำเร็จ')
      }

      router.push('/login')
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด')
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">สมัครสมาชิก Lily</h1>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">ชื่อผู้ใช้</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mint-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-mint-200 rounded-2xl focus:ring-2 focus:ring-mint-300 focus:border-mint-300 outline-none transition-all duration-200 bg-white/70 placeholder-gray-400"
                  placeholder="ตั้งชื่อผู้ใช้ของคุณ"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">ชื่อ</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mint-500" />
                  <input
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-mint-200 rounded-2xl focus:ring-2 focus:ring-mint-300 focus:border-mint-300 outline-none transition-all duration-200 bg-white/70 placeholder-gray-400"
                    placeholder="ชื่อจริง"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">นามสกุล</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mint-500" />
                  <input
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-mint-200 rounded-2xl focus:ring-2 focus:ring-mint-300 focus:border-mint-300 outline-none transition-all duration-200 bg-white/70 placeholder-gray-400"
                    placeholder="นามสกุล"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">อีเมล</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mint-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-mint-200 rounded-2xl focus:ring-2 focus:ring-mint-300 focus:border-mint-300 outline-none transition-all duration-200 bg-white/70 placeholder-gray-400"
                  placeholder="กรอกอีเมลของคุณ"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">รหัสผ่าน</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mint-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-mint-200 rounded-2xl focus:ring-2 focus:ring-mint-300 focus:border-mint-300 outline-none transition-all duration-200 bg-white/70 placeholder-gray-400"
                  placeholder="ตั้งรหัสผ่านของคุณ"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-mint-500 hover:text-mint-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">ยืนยันรหัสผ่าน</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mint-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-mint-200 rounded-2xl focus:ring-2 focus:ring-mint-300 focus:border-mint-300 outline-none transition-all duration-200 bg-white/70 placeholder-gray-400"
                  placeholder="พิมพ์รหัสผ่านอีกครั้ง"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">รูปโปรไฟล์ (ตัวเลือก)</label>

              <div className="flex flex-col items-center gap-4">
                <div className="relative w-28 h-28">
                  {image ? (
                    <img
                      src={image}
                      alt="Profile Preview"
                      className="w-28 h-28 object-cover rounded-full border-4 border-mint-200 shadow-md"
                    />
                  ) : (
                    <div className="w-28 h-28 flex items-center justify-center rounded-full bg-mint-50 border-4 border-mint-200 shadow-inner text-mint-500">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-gradient-to-r from-mint-500 to-emerald-500 text-white py-2 px-4 rounded-xl font-medium shadow hover:shadow-lg hover:from-mint-600 hover:to-emerald-600 transition-all duration-200 text-sm"
                >
                  {image ? "เปลี่ยนรูป" : "อัปโหลดรูป"}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImage(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-mint-500 to-emerald-500 text-white py-3 px-6 rounded-2xl font-medium shadow-lg hover:shadow-xl hover:from-mint-600 hover:to-emerald-600 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-mint-300 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'กำลังสมัครสมาชิก…' : 'สมัครสมาชิก Lily'}
            </button>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                มีบัญชีอยู่แล้วใช่ไหม?{' '}
                <a href="/login" className="text-mint-600 hover:text-mint-700 font-medium hover:underline transition-colors duration-200">
                  เข้าสู่ระบบที่นี่
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .from-mint-50 { --tw-gradient-from: #f0fdfa; }
        .to-emerald-50 { --tw-gradient-to: #ecfdf5; }
        .bg-mint-200 { background-color: #99f6e4; }
        .text-mint-500 { color: #14b8a6; }
        .text-mint-600 { color: #0d9488; }
        .text-mint-700 { color: #0f766e; }
        .border-mint-200 { border-color: #99f6e4; }
        .focus\\:ring-mint-300:focus { --tw-ring-color: #5eead4; }
        .focus\\:border-mint-300:focus { border-color: #5eead4; }
        .from-mint-500 { --tw-gradient-from: #14b8a6; }
        .to-emerald-500 { --tw-gradient-to: #10b981; }
        .hover\\:from-mint-600:hover { --tw-gradient-from: #0d9488; }
        .hover\\:to-emerald-600:hover { --tw-gradient-to: #059669; }
      `}</style>
    </div>
  )
}
