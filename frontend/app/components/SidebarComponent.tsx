'use client'

import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Session } from '@supabase/supabase-js'
import { usePathname } from 'next/navigation'
import {
  MessageCircleMore,
  LogOut,
  Menu,
  Settings,
  X,
  User,
  FileText,
  HelpCircle
} from 'lucide-react'
import { createClient } from '../utils/supabase/client'

const navItems = [
  { href: '/', label: 'แชท', icon: MessageCircleMore },
  { href: '/despression', label: 'แบบประเมิน', icon: FileText },
  { href: '/help', label: 'ช่วยเหลือ', icon: HelpCircle },
]

type ChatItem = {
  id: string
  title: string
  createdAt: number
}

type SidebarLayoutProps = {
  children?: ReactNode
}

export default function SidebarLayout() {
  const supabase = createClient()
  const [session, setSession] = useState<Session | null>(null)
  const [Mychats, setMyChats] = useState([])

  // โหลด session
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    }
    fetchSession()
  }, [])

  // โหลด chats จาก DB
  useEffect(() => {
    if (!session) return

    const fetchChats = async () => {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')

      setMyChats(data || [])
      console.log(data)
    }

    fetchChats()
  }, [session])

  // เพิ่ม chat ใหม่
  const addChat = async (title: string) => {
    if (!session) return
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert([{
        title: 'test', 
        user_id: session.user.id
      }])
      .select()
    setChats(prev => [data[0], ...prev])
  }


  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const [chats, setChats] = useState<ChatItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('lily_chats')
      if (raw) setChats(JSON.parse(raw))
    } catch { /* no-op */ }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('lily_chats', JSON.stringify(chats))
    } catch { /* no-op */ }
  }, [chats])

  const handleLogout = () => {
    supabase.auth.signOut()
    setShowProfileModal(false)
    redirect('/')
  }

  const NavLink = ({ href, label, Icon }: any) => {
    const active = pathname === href
    const handleClick = (e: React.MouseEvent) => {
      if (href === '/' && chats.length > 0) {
        e.preventDefault()
        setIsOpen(false)
        router.push(`/chat/${chats[0].id}`)
        return
      }
      setIsOpen(false)
    }


    return (
      <Link
        href={href}
        onClick={handleClick}
        className={[
          'group flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-200 border',
          'backdrop-blur-sm shadow-sm hover:shadow-md',
          active
            ? 'bg-white/70 text-emerald-800 border-white/70'
            : 'text-emerald-900/80 hover:text-emerald-900 hover:bg-white/30 border-white/30',
        ].join(' ')}
      >
        <Icon
          className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}
        />
        <span className="text-base font-medium">{label}</span>
        {active && (
          <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500/90 shadow-[0_0_8px] shadow-emerald-400/60" />
        )}
      </Link>
    )
  }

  const activeChatId = useMemo(() => {
    const match = pathname?.match(/^\/chat\/(\d+)/)
    return match?.[1] || null
  }, [pathname])

  return (
    <div className="flex h-dvh">
      <button
        className="absolute top-4 left-4 z-50 md:hidden text-emerald-700 bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg hover:bg-white transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={[
          'fixed md:static top-0 left-0 z-40 h-full md:h-dvh w-[19rem] md:w-72',
          'bg-emerald-400',
          'border-r border-white/30 shadow-2xl overflow-hidden',
          'transform transition-transform duration-300',
          'flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        <div className="relative z-10 p-6 flex items-center justify-between">
          <div>
            <div className="text-xs tracking-widest text-emerald-950/70">WELCOME TO</div>
            <h1 className="text-2xl font-extrabold tracking-wide text-white drop-shadow">
              Lily Chatbot
            </h1>
          </div>
          <button
            className="md:hidden text-white/90 hover:bg-white/20 p-2 rounded-lg transition-colors "
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 " />
          </button>
        </div>

        <nav className="relative z-10 px-4 pb-4 space-y-2">
          <div className="mx-2 mb-2 h-px bg-white/40" />
          {navItems.map((n) => (
            <NavLink key={n.href} href={n.href} label={n.label} Icon={n.icon} />
          ))}

          {chats.length > 0 && (
            <div className="mt-3">
              <div className="mx-2 mb-2 h-px bg-white/40" />
              <div className="px-3 py-2 text-xs tracking-wide text-emerald-950/80">
                แชทของฉัน
              </div>
              <div className="space-y-2">
                {chats.map((c) => {
                  const active = activeChatId === c.id
                  return (
                    <Link
                      key={c.id}
                      href={`/chat/${c.id}`}
                      onClick={() => setIsOpen(false)}
                      className={[
                        'group flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-200 border backdrop-blur-sm shadow-sm hover:shadow-md',
                        active
                          ? 'bg-white/70 text-emerald-800 border-white/70'
                          : 'text-emerald-900/80 hover:text-emerald-900 hover:bg-white/30 border-white/30',
                      ].join(' ')}
                    >
                      <MessageCircleMore
                        className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}
                      />
                      <span className="truncate">{c.title}</span>
                      {active && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500/90 shadow-[0_0_8px] shadow-emerald-400/60" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </nav>
        <div className="relative z-10 p-6 mt-auto">
          <div
            className="flex items-center gap-3 p-3 rounded-2xl border border-white/30 bg-white/40 backdrop-blur-md cursor-pointer hover:bg-white/60 transition-all shadow-sm"
            onClick={() => setShowProfileModal(true)}
          >
            {session?.user?.user_metadata?.picture ? (
              <Image
                src={session?.user?.user_metadata?.picture}
                alt="User avatar"
                width={44}
                height={44}
                className="rounded-full ring-2 ring-white/60"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-white/60 flex items-center justify-center ring-2 ring-white/60">
                <User className="w-6 h-6 text-emerald-900/80" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-emerald-950 font-semibold truncate">
                {session?.user?.user_metadata?.name || 'ผู้ใช้งาน'}
              </p>
              <p className="text-emerald-900/70 text-xs truncate">
                {session?.user?.email || 'no-email'}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={async () => {
            const data = await supabase.auth.getSession()
            console.log(data.data.session)
          }}
        >
          
        </button>
      </aside>

      {showProfileModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-7 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-800">โปรไฟล์</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center mb-6">
              {session?.user?.user_metadata?.picture ? (
                <Image
                  src={session?.user?.user_metadata?.picture}
                  alt="User"
                  width={84}
                  height={84}
                  className="rounded-full mx-auto mb-3 ring-4 ring-emerald-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-emerald-200 flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10 text-emerald-700" />
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-800">
                {session?.user?.user_metadata?.name || 'ผู้ใช้งาน'}
              </h3>
              <p className="text-gray-600 text-sm">
                {session?.user?.email || 'ไม่มีอีเมล'}
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => alert('เปิดตั้งค่า')}
                className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition cursor-pointer"
              >
                <Settings className="w-5 h-5" />
                <span>ตั้งค่า</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
