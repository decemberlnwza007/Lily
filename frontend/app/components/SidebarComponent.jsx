'use client'

import { useState } from 'react'
import { Home, MessageCircle, LogOut, Menu, Settings, X, User, FileImage, Heart } from 'lucide-react'
import Image from 'next/image'

import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'

export default function SidebarLayout() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const handleLogout = () => {
    signOut()
    setShowProfileModal(false)
  }

  const handleSettings = () => {
    console.log('Opening settings...')
    setShowProfileModal(false)
  }

  return (
    <div className="flex h-screen">
      <button
        className="absolute top-4 left-4 z-50 md:hidden text-green-700 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg hover:bg-green-50 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-green-400 via-green-300 to-green-200 shadow-2xl relative overflow-hidden border-r border-green-400/30 backdrop-blur-md flex flex-col justify-between transform transition-all duration-300 z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:w-72`}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-8 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute top-1/2 right-4 w-16 h-16 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10 p-8">
          <div className="flex items-center justify-center mb-10">
            <h1 className="text-3xl font-bold text-white tracking-wide drop-shadow-sm">
              Lily Chatbot
            </h1>
            <button
              className="md:hidden text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-3">
            
            <a
              href="/"
              className="flex items-center gap-4 px-6 py-4 text-green-800 hover:text-green-900 hover:bg-white/20 transition-all duration-200 rounded-2xl font-medium group backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md"
            >
              <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-lg">แชท</span>
            </a>

            <a
              href="/info"
              className="flex items-center gap-4 px-6 py-4 text-green-800 hover:text-green-900 hover:bg-white/20 transition-all duration-200 rounded-2xl font-medium group backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md"
            >
              <FileImage className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-lg">InfoGraphic</span>
            </a>
             <a
              href="/despression"
              className="flex items-center gap-4 px-6 py-4 text-green-800 hover:text-green-900 hover:bg-white/20 transition-all duration-200 rounded-2xl font-medium group backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md"
            >
              <Heart className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-lg">แบบประเมิน</span>
            </a>
          </nav>
          
        </div>

        <div className="relative z-10 p-8 border-t border-white/20 backdrop-blur-sm">
          <div 
            className="flex items-center gap-4 p-4 hover:bg-white/20 cursor-pointer transition-all duration-200 rounded-2xl group border border-white/10 backdrop-blur-sm shadow-sm hover:shadow-md"
            onClick={() => setShowProfileModal(true)}
          >
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="User profile image"
                width={48}
                height={48}
                className="rounded-full ring-2 ring-white/30 group-hover:ring-white/50 transition-all duration-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center ring-2 ring-white/30 group-hover:ring-white/50 transition-all duration-200">
                <User className="w-6 h-6 text-green-800" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-green-900 font-medium text-lg truncate group-hover:text-green-800 transition-colors duration-200">
                {session?.user?.name || 'ผู้ใช้งาน'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">โปรไฟล์</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="text-center mb-8">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="User profile image"
                  width={80}
                  height={80}
                  className="rounded-full mx-auto mb-4 ring-4 ring-green-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-green-200 flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-green-600" />
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {session?.user?.name || 'ผู้ใช้งาน'}
              </h3>
              <p className="text-gray-600">
                {session?.user?.email || 'ไม่มีอีเมล'}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSettings}
                className="w-full flex items-center gap-3 px-6 py-4 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 rounded-2xl font-medium group border border-gray-200 hover:border-gray-300"
              >
                <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                <span>ตั้งค่า</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-6 py-4 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 rounded-2xl font-medium group border border-red-200 hover:border-red-300"
              >
                <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}