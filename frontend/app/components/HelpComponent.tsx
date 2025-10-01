'use client'

import { Phone, Globe, Images, ArrowUpRight } from 'lucide-react'

export default function HelpPage() {
  return (
    <div className="relative">
      {/* BG decoration เบา ๆ */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(800px_400px_at_10%_-10%,#dcfce7_0%,transparent_40%),radial-gradient(800px_400px_at_90%_-10%,#f3e8ff_0%,transparent_35%)]" />

      <div className="mx-auto max-w-12xl px-6 md:px-10 py-8 md:py-12">
        {/* Hero */}
        <div className="rounded-3xl border border-emerald-100/70 bg-white/80 backdrop-blur p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <span className="text-2xl">💚</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-emerald-900">ศูนย์ช่วยเหลือ</h1>
              <p className="mt-1 text-emerald-950/80">
                ช่องทางดูแลใจแบบรวดเร็ว — เลือกเมนูด้านล่างได้เลยนะคะ
              </p>
            </div>
          </div>
        </div>

        {/* 3 เมนู */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* 1) เว็บไซต์กรมสุขภาพจิต */}
          <a
            href="https://www.dmh.go.th/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-2xl border border-emerald-100 bg-white p-5 md:p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-emerald-900 flex items-center gap-1">
                  เว็บไซต์กรมสุขภาพจิต
                  <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </h2>
                <p className="mt-1.5 text-sm text-emerald-900/70">
                  ข้อมูล ความรู้ และบริการด้านสุขภาพจิตจากหน่วยงานภาครัฐ
                </p>
              </div>
            </div>
            <div className="mt-4 inline-flex items-center text-sm font-medium text-emerald-700 group-hover:text-emerald-800">
              เปิดเว็บไซต์
            </div>
          </a>

          <a
            href="tel:1323"
            className="group relative rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 md:p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-emerald-900">สายด่วนสุขภาพจิต 1323</h2>
                <p className="mt-1.5 text-sm text-emerald-900/70">
                  ต้องการคุยกับผู้เชี่ยวชาญทันที กดเพื่อโทรออกได้เลย (24 ชั่วโมง)
                </p>

                <div className="mt-4">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-3 py-2 text-emerald-800 shadow-sm group-hover:shadow">
                    <Phone className="w-4 h-4" />
                    <span className="font-semibold tracking-wide">โทร 1323</span>
                  </div>
                </div>
              </div>
            </div>
          </a>

          {/* 3) Infographic สุขภาพจิต */}
          <a
            href="/info"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-2xl border border-emerald-100 bg-white p-5 md:p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center">
                <Images className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-emerald-900 flex items-center gap-1">
                  Infographic สุขภาพจิต
                  <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </h2>
                <p className="mt-1.5 text-sm text-emerald-900/70">
                  รวมภาพความรู้ที่อ่านง่าย แชร์ต่อได้ เหมาะกับการดูแลใจประจำวัน
                </p>
              </div>
            </div>
            <div className="mt-4 inline-flex items-center text-sm font-medium text-emerald-700 group-hover:text-emerald-800">
              เปิดหน้ารวม Infographic
            </div>
          </a>
        </div>

        <p className="mt-6 text-xs text-emerald-900/60">
          หากคุณหรือคนใกล้ชิดอยู่ในภาวะฉุกเฉิน โปรดติดต่อหน่วยแพทย์ใกล้บ้านหรือหมายเลขฉุกเฉินในพื้นที่ทันที
        </p>
      </div>
    </div>
  )
}
