'use client'

import { useState } from 'react'
import { Home, MessageCircle, LogOut, Menu } from 'lucide-react'

export default function SidebarLayout() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex h-screen">
      <button
        className="absolute top-4 left-4 z-50 md:hidden text-green-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-8 h-8" />
      </button>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-green-300 p-8 shadow-2xl border-r border-green-400/80 backdrop-blur-sm flex flex-col justify-between transform transition-transform duration-300 z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}
      >
        <div>
          <h1 className="text-2xl font-extrabold mb-10 text-white tracking-wide select-none">
            เมนู
          </h1>
          <nav className="flex flex-col gap-4">
            <a
              href="#"
              className="flex items-center gap-4 px-5 py-4 text-green-700 hover:text-green-800 hover:bg-green-400/70 transition-all duration-300 rounded-xl font-semibold group select-none"
            >
              <span className="text-3xl">
                <Home />
              </span>
              <span className="text-lg duration-300">หน้าแรก</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-4 px-5 py-4 text-green-700 hover:text-green-800 hover:bg-green-400/70 transition-all duration-300 rounded-xl font-semibold group select-none"
            >
              <span className="text-3xl">
                <MessageCircle />
              </span>
              <span className="text-lg transition-transform duration-300">
                Chat
              </span>
            </a>
          </nav>
        </div>

        <div className="pt-8 border-t border-green-400/80">
          <a
            href="#"
            className="flex items-center gap-5 px-5 py-4 text-green-100 hover:text-red-400 hover:bg-red-500/20 transition-all duration-300 rounded-xl font-semibold group select-none"
          >
            <span className="text-3xl">
              <LogOut />
            </span>
            <span className="text-lg group-hover:translate-x-2 transition-transform duration-300">
              ออกจากระบบ
            </span>
          </a>
        </div>
      </aside>
    </div>
  )
}
