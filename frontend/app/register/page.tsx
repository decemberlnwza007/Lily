'use client'

import { register } from './action'

export default function RegisterForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mint-50 to-emerald-50 p-4">
      <div className="w-full max-w-md bg-white/80 p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-8">สมัครสมาชิก Lily</h1>

        <form className="space-y-6">
          <div>
            <label>ชื่อผู้ใช้</label>
            <input
              required
              name="username"
              type="text"

              className="w-full p-3 border rounded-2xl"
              placeholder="ตั้งชื่อผู้ใช้"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>ชื่อ</label>
              <input
                required
                name="firstname"
                type="text"

                className="w-full p-3 border rounded-2xl"
                placeholder="ชื่อจริง"
              />
            </div>
            <div>
              <label>นามสกุล</label>
              <input
                required
                name="lastname"
                type="text"

                className="w-full p-3 border rounded-2xl"
                placeholder="นามสกุล"
              />
            </div>
          </div>

          <div>
            <label>อีเมล</label>
            <input
              required
              name="email"
              type="email"

              className="w-full p-3 border rounded-2xl"
              placeholder="อีเมล"
            />
          </div>

          <div>
            <label>รหัสผ่าน</label>
            <input
              required
              name="password"
              type="password"

              className="w-full p-3 border rounded-2xl"
              placeholder="ตั้งรหัสผ่าน"
            />
          </div>

          <div>
            <label>ยืนยันรหัสผ่าน</label>
            <input
              required
              name="confirm"
              type="password"

              className="w-full p-3 border rounded-2xl"
              placeholder="พิมพ์รหัสผ่านอีกครั้ง"
            />
          </div>

          <div>
            <label>รูปโปรไฟล์ (ไม่บังคับ)</label>
            <input
              name="avatar"
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded-2xl"
            />
          </div>

          <button
            formAction={register}
            className="w-full py-3 bg-gradient-to-r from-mint-500 to-emerald-500 text-white rounded-2xl font-medium hover:from-mint-600 hover:to-emerald-600 transition-all"
          >
            สมัครสมาชิก Lily
          </button>

          <p className="text-center text-sm mt-4">
            มีบัญชีแล้ว? <a href="/login" className="text-mint-600 hover:underline">เข้าสู่ระบบ</a>
          </p>
        </form>
      </div>
    </div>
  )
}
