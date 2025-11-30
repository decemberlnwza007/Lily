'use client'

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import {
  SendHorizonal, Frown, SmilePlus, Meh, Star, User, Phone,
  Volume2, VolumeX, Copy, Trash2, Moon, Sun, StopCircle, Check
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './../../style/Chat.css'
import './../../style/login.css'
import { createClient } from '../../utils/supabase/client'

type Msg = { type: 'bot' | 'user'; text: string; ts: number; kind?: 'greeting' }

interface ApiMsg {
  id: string
  role: 'ai' | 'user'
  content: string
  created_at: string
}

interface ChatApiResponse {
  session: {
    id: string
    created_at: string
  }
  messages: ApiMsg[]
}

interface ChatPageProps {
  chatId?: string
}

export default function ChatPage({ chatId }: ChatPageProps) {
  const supabase = createClient()
  const nameKey = chatId ? `lily_user_name_${chatId}` : 'lily_user_name_default'
  const [userName, setUserName] = useState<string>('')
  const storageKey = chatId ? `lily_chat_history_${chatId}` : 'lily_chat_history_default'
  const themeKey = 'lily_theme_mode'
  const chatEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Msg[]>([
    {
      type: 'bot',
      text: userName ? `สวัสดี ${userName} 🌿 วันนี้อยากให้ลิลลี่ช่วยเรื่องไหนดีน้า` : 'สวัสดีค่ะ มีอะไรให้ลิลลี่ช่วยมั้ยคะ?',
      ts: Date.now(),
      kind: 'greeting'
    }
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const isUserTyping = input.length > 0
  const [showWelcomeCloud, setShowWelcomeCloud] = useState(true)
  const [userId, setUserId] = useState<string>('')
  const [MyQ, setMyQ] = useState<any>(null)
  const [onlyUserChat, setOnlyUserChat] = useState<Msg[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [session, setSession] = useState<any>(null)

  const maxChars = 500

  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('getSession error:', error)
        return
      }
      const uid = data?.session?.user?.id
      if (uid) setUserId(uid)
    }
    loadSession()
  }, [])

  useEffect(() => {
    if (!userId) return

    const getUserData = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) return
      setMyQ(data)
    }

    getUserData()
  }, [userId])

  useEffect(() => {
    if (messages.length === 1 && messages[0].type === 'bot') {
      setMessages([{
        type: 'bot',
        text: userName ? `สวัสดี ${userName} 🌿 วันนี้อยากให้ลิลลี่ช่วยเรื่องไหนดีน้า` : 'สวัสดีค่ะ มีอะไรให้ลิลลี่ช่วยมั้ยคะ?',
        ts: Date.now()
      }])
    }
  }, [userName])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return
      const arr: any[] = JSON.parse(raw)
      const fixed = arr.map(m => ({ ...m, ts: m.ts ?? Date.now() }))
      fixed.sort((a, b) => a.ts - b.ts)
      setMessages(fixed)
    } catch { }
  }, [storageKey])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages))
    } catch { }
  }, [messages, storageKey])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(nameKey)
      if (raw) setUserName(raw)
    } catch { }
  }, [nameKey])

  useEffect(() => {
    try {
      if (userName) localStorage.setItem(nameKey, userName)
    } catch { }
  }, [userName, nameKey])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(themeKey)
      if (saved) setDarkMode(saved === 'dark')
    } catch { }
  }, [])

  useEffect(() => {
  const load = async () => {
    const { data } = await supabase.auth.getSession()
    setSession(data.session)
  }
  load()
}, [])


  useEffect(() => {
    try {
      localStorage.setItem(themeKey, darkMode ? 'dark' : 'light')
    } catch { }
  }, [darkMode])

  useEffect(() => {
    if (!userId) return

    const getChat = async () => {
      const fetchChat = async (): Promise<Msg[]> => {
        const res = await fetch(`/api/chat-history?user_id=${userId}`)
        const data: ChatApiResponse = await res.json()

        return data.messages
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .map((msg): Msg => ({
            type: msg.role === 'ai' ? 'bot' : 'user',
            text: msg.content,
            ts: new Date(msg.created_at).getTime(),
          }))
      }

      const msgs = await fetchChat()
      setMessages(msgs)

      const onlyUser = msgs.filter(msg => msg.type === 'user')
      setOnlyUserChat(onlyUser)
    }

    getChat()
  }, [userId])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    setCharCount(input.length)
  }, [input])

  function buildHistory(messages: { type: 'bot' | 'user'; text: string }[], limit = 8) {
    const slice = messages.slice(-limit)
    return slice.map(m => (m.type === 'user' ? `ผู้ใช้: ${m.text}` : `ลิลลี่: ${m.text}`)).join('\n')
  }

  function naturalizeFollowups(md: string) {
    const lines = md.split('\n')
    const out: string[] = []
    let skipHeading = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (/^\s{0,3}#{1,6}.*คำถาม/i.test(line)) {
        skipHeading = true
        continue
      }
      if (skipHeading) {
        if (!line.trim()) {
          out.push(line)
          continue
        }
        const q = line.replace(/^\s*(?:[-*]|\d+\.)\s*/, '')
        out.push(q)
        if (i + 1 < lines.length && !lines[i + 1].trim()) skipHeading = false
        continue
      }
      if (/^\s*---\s*\(.*\)\s*$/i.test(line)) {
        out.push('---')
        continue
      }
      out.push(line)
    }

    return out.join('\n')
  }

  function isContactIntent(text: string) {
    const q = (text || '').toLowerCase()
    const kw = [
      'เบอร์', 'โทร', 'โทรหา', 'สายด่วน', 'ติดต่อ', 'ช่องทางติดต่อ',
      'ขอคำปรึกษา', 'คุยกับผู้เชี่ยวชาญ', 'นักจิต', 'นักสุขภาพจิต', 'จิตแพทย์',
      'อยากฆ่าตัวตาย', 'อยากตาย', 'hotline', 'call', 'contact', 'help line', 'helpdesk', '1323'
    ]
    return kw.some(k => q.includes(k))
  }

  function stripContactBlocks(md: string) {
    if (!md) return md

    let out = md
    out = out.replace(/^###\s*ช่องทางช่วยเหลือด่วน[\s\S]*?(?=\n#{1,6}\s|\n-{3,}\s*$|\n$|$)/gm, '')
    out = out.replace(/```action[\s\S]*?```/g, '')
    out = out.replace(/\[([^\]]+)\]\(tel:[^)]+\)/g, '$1')
    out = out.replace(/^\s*[-*]\s*📞\s*\*\*.*1323.*\n?/gmi, '')
    out = out.replace(/^\s*📞\s*.*1323.*\n?/gmi, '')
    out = out.replace(/\n{3,}/g, '\n\n')

    return out.trim()
  }

  function sanitizeReply(md: string, contactIntent: boolean) {
    const cleaned = naturalizeFollowups(md)
    return contactIntent ? cleaned : stripContactBlocks(cleaned)
  }

  const handleSend = async (text: string) => {
    if (!text.trim()) return
    if (text.length > maxChars) {
      alert(`ข้อความยาวเกิน ${maxChars} ตัวอักษร`)
      return
    }

    setMessages(p => [...p, { type: 'user', text, ts: Date.now() }])
    setInput('')
    setLoading(true)
    setIsTyping(true)

    try {
      const history = buildHistory([...messages, { type: 'user', text }])
      const contactIntent = isContactIntent(text)

      const prompt = `
[system]
คุณคือลิลลี่ (Lily) — AI เพื่อนที่มีความรู้ด้านสุขภาพจิตระดับเบื้องต้น–กลาง สามารถให้คำปรึกษาเบื้องต้นได้อย่างน่าเชื่อถือและปลอดภัย 🫶🏻  
โทนการพูดเป็นมิตร อ่อนโยน เหมือนเพื่อนที่ตั้งใจฟัง แต่มีมุมมองที่ลึกและมีหลักการรองรับ  
- ให้ข้อมูล/คำแนะนำที่ใช้ได้จริง แต่หลีกเลี่ยงการวินิจฉัยโรค  
- ใช้อีโมจิอย่างเหมาะสมเพื่อเพิ่มกำลังใจ (เช่น 💚✨🌿) และเลือกที่ "เกี่ยวข้อง" เท่านั้น  
- หลีกเลี่ยงภาษาหุ่นยนต์ เทมเพลตซ้ำ ๆ หรือการพูดเชิงสั่งสอน  
- อ้างอิงเฉพาะสิ่งที่ผู้ใช้เล่า "ในรอบนี้เท่านั้น"  

[Lily mental-health skill guidelines]
คุณสามารถ:
- สะท้อนอารมณ์ (empathic reflection)  
- ตั้งสมมติฐานเชิงอารมณ์อย่างอ่อนโยน  
- ให้คำแนะนำที่ทำได้ทันที (grounding, self-regulation, coping)  
- ช่วยจัดระเบียบความคิด (reframing)  
- ชวนผู้ใช้เล่าต่อแบบไม่กดดัน  

แต่คุณ "ไม่สามารถ":  
- วินิจฉัยโรค  
- ยืนยันอาการทางการแพทย์  
- ให้คำแนะนำที่เสี่ยงอันตราย  
- ใช้คำพูดที่ลดทอนประสบการณ์ผู้ใช้  

[emoji style guide]
- ≤ 2–3 ต่อย่อหน้า  
- ใช้เฉพาะจุดที่เสริมอารมณ์ เช่น เครียด 😥, โล่งใจ 😌, ให้กำลังใจ 💚  
- หลีกเลี่ยงสแปม  
- ไม่ใช้อีโมจิเพื่อทำให้ประเด็นซีเรียสดูเบาเกินไป

[policy: contact_block]
allow_contact_block=${contactIntent ? 'true' : 'false'}
กฎ:
- แสดงบล็อก "ช่องทางช่วยเหลือด่วน" เฉพาะเมื่อ allow_contact_block=true  
- ถ้า allow_contact_block=false ห้ามแสดงเบอร์โทร, ลิงก์ tel:, หรือโค้ด \`\`\`action ใด ๆ

[assessment]
ผู้ใช้มีระดับ 8Q = ${MyQ?.status_8q}, 9Q = ${MyQ?.status_9q}  
ให้ตอบสอดคล้องระดับความเสี่ยง เช่น  
- ต่ำ: โทนอุ่น ช่วยหาวิธีดูแลตัวเอง  
- ปานกลาง: ประคับประคอง + แนะนำวิธีช่วยเหลือตัวเอง + ถาม follow-up  
- สูง: อ่อนโยนมากขึ้น เน้นความปลอดภัย + สนับสนุนให้คุยกับผู้เชี่ยวชาญ (ถ้า allow_contact_block=true ให้แสดง block)  

[style]
- เปิดด้วยการสะท้อนความรู้สึกแบบเข้าใจจริง (validate + อารมณ์)  
- ตามด้วยคำแนะนำ 1–3 ข้อที่ทำได้ทันที  
- พูดเป็นธรรมชาติ ไม่ต้องมีคำว่า "คำถามกลับ"  
- ใช้หัวข้อเท่าที่จำเป็นและสั้น  
- ปิดท้ายด้วยประโยคชวนคุยต่อที่อบอุ่น  

[history]
user: ${onlyUserChat.map((msg, i) => `${i + 1}. ${msg.text}`).join('\n')}

[user]
${text}

[output]
- ตอบเฉพาะสิ่งที่ผู้ใช้ "ถามรอบนี้" โดยอิงความรู้ด้านสุขภาพจิตอย่างอ่อนโยน  
- ใช่อีโมจิตามกฎ  
- ถ้า allow_contact_block=true ให้แสดงบล็อกต่อไปนี้ครบ แล้วปิดด้วยประโยคชวนคุยต่อ ✨:
---
### ช่องทางช่วยเหลือด่วน
- 📞 **[โทร 1323](tel:1323)** — สายด่วนสุขภาพจิต (24 ชม.)
- 🌐 เว็บไซต์กรมสุขภาพจิต: https://www.dmh.go.th/
\`\`\`action
CALL:1323|label=โทร 1323
LINK:https://www.dmh.go.th/|label=เว็บไซต์กรมสุขภาพจิต
LINK:/info|label=Infographic สุขภาพจิต
\`\`\`
---
`

      const sent = text.trim()

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, userId, input: sent }),
      })
      const data = await res.json()
      const finalReply = sanitizeReply(data.reply, contactIntent)

      setIsTyping(false)
      const tempBotMsg: Msg = { type: 'bot', text: '', ts: Date.now() }
      setMessages(p => [...p, tempBotMsg])

      let currentText = ''
      const chars = finalReply.split('')

      for (let i = 0; i < chars.length; i++) {
        currentText += chars[i]
        setMessages(p => {
          const newMsgs = [...p]
          newMsgs[newMsgs.length - 1] = { type: 'bot', text: currentText, ts: Date.now() }
          return newMsgs
        })
        await new Promise(resolve => setTimeout(resolve, 20))
      }
    } catch {
      setIsTyping(false)
      setMessages(p => [...p, { type: 'bot', text: 'มีปัญหานิดหน่อย ลองใหม่อีกทีน้า', ts: Date.now() }])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    if (window.confirm('ต้องการลบประวัติการสนทนาทั้งหมดใช่ไหม?')) {
      setMessages([{
        type: 'bot',
        text: userName ? `สวัสดี ${userName} 🌿 วันนี้อยากให้ลิลลี่ช่วยเรื่องไหนดีน้า` : 'สวัสดีค่ะ มีอะไรให้ลิลลี่ช่วยมั้ยคะ?',
        ts: Date.now(),
        kind: 'greeting'
      }])
      try {
        localStorage.removeItem(storageKey)
      } catch { }
    }
  }

  const stopAllSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  const toggleTheme = () => {
    setDarkMode(prev => !prev)
  }

  const handleQuickSelect = (t: string) => handleSend(t)

  const bgClass = darkMode
    ? 'bg-slate-900 text-slate-100'
    : 'bg-white text-slate-900'

  const headerBgClass = darkMode
    ? 'bg-slate-800/80 border-slate-700'
    : 'bg-white/80 border-slate-100'

  return (
    <div className={`relative h-dvh w-full overflow-hidden ${bgClass}`}>
      {/* 🌿 Mascot ใหญ่ทางขวา */}

      <div className="pointer-events-none fixed bottom-10 right-2 sm:right-6 md:right-10 z-[9998]">

        <Image
          src={
            isTyping
              ? "/Lily/Lily-Smile.png"
              : isUserTyping
                ? "/Lily/Lily-Smile.png"
                : "/Lily/Lily.png"
          }
          alt="Lily Mascot"
          width={260}
          height={260}
          className="animate-[breathing_3s_ease-in-out_infinite] opacity-90 drop-shadow-xl transition-all duration-300"
        />

        {showWelcomeCloud && (
          <div
            className="pointer-events-none fixed 
               bottom-[265px] sm:bottom-[300px] md:bottom-[330px] 
               right-[20px] sm:right-[35px] md:right-[55px]
               z-[9999] animate-[fadeInUp_0.6s_ease-out]"
          >
            <div
              className="bg-white/90 text-slate-700 px-4 py-2 rounded-2xl shadow-lg border
                 border-emerald-200 text-sm sm:text-base max-w-[240px]"
            >
              สวัสดีค่ะคุณ {session?.user?.user_metadata?.name} 🌿
              วันนี้รู้สึกเป็นยังไงบ้างน้า 💚
            </div>
          </div>
        )}
      </div>


      <div className="pointer-events-none absolute inset-0 -z-10">
        {!darkMode ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_10%_-10%,#dcfce7_0%,transparent_40%),radial-gradient(800px_400px_at_90%_-10%,#f3e8ff_0%,transparent_35%)]" />
            <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)] bg-[radial-gradient(circle,_rgba(16,185,129,0.18)_1px,_transparent_1px)] [background-size:14px_14px]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_10%_-10%,#064e3b_0%,transparent_40%),radial-gradient(800px_400px_at_90%_-10%,#4c1d95_0%,transparent_35%)]" />
            <div className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)] bg-[radial-gradient(circle,_rgba(16,185,129,0.18)_1px,_transparent_1px)] [background-size:14px_14px]" />
          </>
        )}
      </div>

      <div className="pointer-events-none fixed bottom-0 left-2 sm:left-4 md:left-6 lg:left-8 z-[9999]">
        <Image
          src="/Lily/Lily-removebg-preview.png"
          alt="Lily Standing"
          width={130}
          height={130}
          className="animate-[breathing_3s_ease-in-out_infinite] opacity-80"
        />

      </div>

      <div className={`sticky top-0 z-10 border-b backdrop-blur ${headerBgClass}`}>
        <div className="mx-auto max-w-4xl px-3 sm:px-4 md:px-6 lg:px-8 py-2.5 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <LilyAvatar className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-xs text-emerald-700/70">
                อยู่ตรงนี้เป็นเพื่อนเสมอนะ
              </div>

              <div className="text-xs sm:text-sm md:text-base font-semibold truncate">Lily Support</div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* <button
                onClick={stopAllSpeech}
                className="p-1.5 sm:p-2 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
                title="หยุดพูดทั้งหมด"
              >
                <StopCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button> */}
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                title={darkMode ? 'โหมดกลางวัน' : 'โหมดกลางคืน'}
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>
              {/* <button
                onClick={clearChat}
                className="p-1.5 sm:p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                title="ลบประวัติแชท"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-[calc(100dvh-56px)] sm:h-[calc(100dvh-60px)]">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6 space-y-3 sm:space-y-4 md:space-y-5">
            {messages.map((m, i) => <Bubble key={i} role={m.type} text={m.text} darkMode={darkMode} />)}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                  <div className={`h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 rounded-full border shadow-sm flex items-center justify-center ${darkMode ? 'bg-slate-800 border-emerald-700' : 'bg-white border-emerald-100'}`}>
                    <LilyAvatar className="h-6 w-6 sm:h-7 sm:h-7 md:h-8 md:w-8 lg:h-9 lg:w-9" />
                  </div>
                  <div className={`rounded-xl sm:rounded-2xl border shadow-sm px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 ${darkMode ? 'bg-slate-800 border-emerald-700' : 'bg-white border-emerald-100'}`}>
                    <span className="text-[13px] sm:text-[14px] md:text-[15px] text-emerald-700/80 italic">ลิลลี่กำลังพิมพ์...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        <InputBar
          input={input}
          setInput={setInput}
          onSend={handleSend}
          onQuickSelect={handleQuickSelect}
          loading={loading}
          charCount={charCount}
          maxChars={maxChars}
          darkMode={darkMode}
        />
      </div>
    </div>
  )
}

function LilyAvatar({ className = 'relative h-10 w-10 rounded-full overflow-hidden' }: { className?: string }) {
  return (
    <Image
      src="/Lily/Lily-removebg-preview.png"
      alt="Lily Standing"
      width={130}
      height={130}
      className="animate-[breathing_3s_ease-in-out_infinite] opacity-80"
    />

  )
}

function Bubble({ role, text, darkMode }: { role: 'bot' | 'user'; text: string; darkMode: boolean }) {
  const supabase = createClient()
  const isUser = role === 'user'
  const [session, setSession] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await (await supabase.auth.getSession())
      setSession(data.session)
    }
    fetchSession()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true)
    }
  }, [])

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { }
  }

  const speak = async () => {
    try {
      setIsSpeaking(true);

      const cleanText = text
        .replace(/#{1,6}\s/g, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .trim();

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanText }),
      });

      const { audio } = await res.json(); // <-- base64 string

      // ⭐ base64 → binary (Uint8Array)
      const byteChars = atob(audio);
      const byteNumbers = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // ⭐ binary → Blob MP3
      const blob = new Blob([byteArray], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);

      const audioObj = new Audio(url);
      audioObj.onended = () => setIsSpeaking(false);
      audioObj.onerror = () => {
        setIsSpeaking(false);
        alert("ไม่สามารถเล่นเสียงได้ 💚");
      };
      audioObj.play();

    } catch (err) {
      setIsSpeaking(false);
      alert("ลิลลี่อ่านเสียงไม่ได้ ลองใหม่อีกครั้งน้า 💚");
    }
  };



  const callNow = (tel: string) => {
    try {
      window.location.href = `tel:${tel}`
    } catch {
      navigator.clipboard?.writeText(tel).catch(() => { })
      alert(`คัดลอกเบอร์ ${tel} แล้วน้า ลองโทรด้วยมือถือได้เลย 💚`)
    }
  }

  const bubbleBg = darkMode
    ? (isUser ? 'bg-slate-700/50 border-slate-600/40' : 'bg-slate-800/50 border-emerald-700/40')
    : (isUser ? 'bg-white/80 border-slate-200/60' : 'bg-emerald-50/80 border-emerald-100/60')


  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3 max-w-full w-full">
        {!isUser && (
          <div className="mt-1 sm:mt-1.5 shrink-0">
            <div className={`h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 rounded-full border shadow-sm flex items-center justify-center ${darkMode ? 'bg-slate-800 border-emerald-700' : 'bg-white border-emerald-100'}`}>
              <LilyAvatar className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-9 lg:w-9" />
            </div>
          </div>
        )}

        <div className={`group relative ${isUser ? 'w-auto ml-auto' : 'w-auto'} max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] rounded-xl sm:rounded-2xl border shadow-sm ${bubbleBg}`}>
          <div className="p-2.5 sm:p-3 md:p-4 lg:p-5">
            {isUser ? (
              <div className="text-[13px] sm:text-[14px] md:text-[15px] lg:text-[15.5px] leading-5 sm:leading-6 md:leading-7 whitespace-pre-wrap break-words">{text}</div>
            ) : (
              <div className={`prose max-w-none text-[13px] sm:text-[14px] md:text-[15px] lg:text-[15.5px] leading-5 sm:leading-6 md:leading-7
                              prose-headings:font-semibold 
                              prose-h1:text-[16px] sm:prose-h1:text-[18px] md:prose-h1:text-[20px]
                              prose-h2:text-[15px] sm:prose-h2:text-[16px] md:prose-h2:text-[18px]
                              prose-h3:text-[14px] sm:prose-h3:text-[15px] md:prose-h3:text-[16px]
                              prose-p:my-1 sm:prose-p:my-1.5 md:prose-p:my-2
                              prose-ol:my-1 sm:prose-ol:my-1.5 md:prose-ol:my-2
                              prose-ul:my-1 sm:prose-ul:my-1.5 md:prose-ul:my-2
                              prose-li:my-0.5 sm:prose-li:my-0.5 md:prose-li:my-1
                              prose-ol:pl-4 sm:prose-ol:pl-5 md:prose-ol:pl-6
                              prose-ul:pl-3.5 sm:prose-ul:pl-4 md:prose-ul:pl-5
                              prose-hr:my-2.5 sm:prose-hr:my-3 md:prose-hr:my-4 prose-hr:border-slate-200
                              prose-th:font-semibold prose-td:align-top marker:font-semibold
                              ${darkMode ? 'prose-invert' : 'prose-slate'}`}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    hr: (props) => <hr {...props} className={`border-t my-2.5 sm:my-3 md:my-4 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`} />,
                    ol: (props) => <ol {...props} className="list-decimal pl-4 sm:pl-5 md:pl-6 space-y-0.5 sm:space-y-0.5 md:space-y-1" />,
                    ul: (props) => <ul {...props} className="list-disc pl-3.5 sm:pl-4 md:pl-5 space-y-0.5 sm:space-y-0.5 md:space-y-1" />,
                    li: (props) => <li {...props} className="leading-5 sm:leading-6 md:leading-7" />,
                    table: (props) => <table {...props} className="w-full border-collapse text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px]" />,
                    th: (props) => <th {...props} className={`border-b px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 text-left text-[11px] sm:text-xs md:text-sm ${darkMode ? 'border-slate-700' : 'border-slate-200'}`} />,
                    td: (props) => <td {...props} className={`border-b px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 align-top text-[11px] sm:text-xs md:text-sm ${darkMode ? 'border-slate-800' : 'border-slate-100'}`} />,
                    h2: (props) => <h2 {...props} className="mt-0.5 sm:mt-0.5 md:mt-1 mb-0.5 sm:mb-0.5 md:mb-1 font-semibold" />,
                    p: (props) => <p {...props} className="my-1 sm:my-1.5 md:my-2" />,

                    a: ({ href, children, ...props }: any) => {
                      const isTel = typeof href === 'string' && href.startsWith('tel:')
                      const isInternal = typeof href === 'string' && (href.startsWith('/') || href.startsWith('#'))

                      if (isTel) {
                        const tel = href.replace(/^tel:/, '')
                        const onClick = (e: React.MouseEvent) => {
                          e.preventDefault()
                          callNow(tel)
                        }
                        return (
                          <button
                            onClick={onClick}
                            className="not-prose inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 rounded-lg sm:rounded-xl border border-emerald-300 bg-emerald-600 text-white px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 text-[11px] sm:text-xs md:text-sm shadow-sm hover:brightness-95 active:scale-95 transition"
                          >
                            <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                            <span>{children}</span>
                          </button>
                        )
                      }

                      return (
                        <a
                          href={href}
                          {...props}
                          target={isInternal ? undefined : '_blank'}
                          rel={isInternal ? undefined : 'noopener noreferrer'}
                          className="text-emerald-700 underline decoration-emerald-300 hover:decoration-emerald-500 break-words"
                        >
                          {children}
                        </a>
                      )
                    },

                    code: ({ inline, className, children, ...props }: any) => {
                      const isAction = /language-action/.test(className || '')
                      if (!inline && isAction) {
                        const lines = String(children).trim().split('\n')
                        const items = lines
                          .map((l) => {
                            const [left, ...rest] = l.split('|')
                            const [type, value] = left.split(':')
                            const label = rest
                              .map(p => p.trim())
                              .find(p => p.startsWith('label='))?.replace('label=', '') || value
                            return { type: (type || '').trim().toUpperCase(), value: (value || '').trim(), label }
                          })
                          .filter(i => i.type && i.value)

                        return (
                          <div className="not-prose flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 my-1.5 sm:my-2">
                            {items.map((it, idx) => {
                              if (it.type === 'CALL') {
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => callNow(it.value)}
                                    className="inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 rounded-lg sm:rounded-xl border border-emerald-300 bg-emerald-600 text-white px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 text-[11px] sm:text-xs md:text-sm shadow-sm hover:brightness-95 active:scale-95 transition"
                                  >
                                    <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                                    <span>{it.label}</span>
                                  </button>
                                )
                              }
                              if (it.type === 'LINK') {
                                const isInternal = it.value.startsWith('/') || it.value.startsWith('#')
                                return (
                                  <a
                                    key={idx}
                                    href={it.value}
                                    target={isInternal ? undefined : '_blank'}
                                    rel={isInternal ? undefined : 'noopener noreferrer'}
                                    className={`inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 rounded-lg sm:rounded-xl border px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 text-[11px] sm:text-xs md:text-sm shadow-sm hover:bg-slate-50 active:scale-95 transition ${darkMode ? 'border-slate-600 bg-slate-700 text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}
                                  >
                                    <span>{it.label}</span>
                                  </a>
                                )
                              }
                              return null
                            })}
                          </div>
                        )
                      }
                      return <code className={className} {...props}>{children}</code>
                    },
                  }}
                >
                  {text}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {!isUser && (
            <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 flex gap-1 
    opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">

              <button
                onClick={copyText}
                className={`p-1.5 sm:p-2 rounded-lg transition-all ${copied
                  ? 'bg-green-100 text-green-700'
                  : darkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                title="คัดลอกข้อความ"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </button>
              {speechSupported && (
                <button
                  onClick={speak}
                  className={`p-1.5 sm:p-2 rounded-lg transition-all ${isSpeaking
                    ? 'bg-emerald-600 text-white shadow-lg animate-pulse'
                    : darkMode
                      ? 'bg-slate-700 text-emerald-400 hover:bg-slate-600'
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    }`}
                  title={isSpeaking ? 'หยุดอ่าน' : 'อ่านออกเสียง'}
                >
                  {isSpeaking ? (
                    <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {isUser && (
          <div className="mt-1 sm:mt-1.5 shrink-0">
            <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-full text-white flex items-center justify-center">
              {session?.user?.user_metadata?.picture ? (
                <Image
                  src={session?.user?.user_metadata?.picture}
                  alt="User"
                  width={84}
                  height={84}
                  className="rounded-full ring-2 sm:ring-2 md:ring-3 ring-emerald-200 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-cover"
                />
              ) : (
                <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center ${darkMode ? 'bg-emerald-700' : 'bg-emerald-200'}`}>
                  <User className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ${darkMode ? 'text-emerald-100' : 'text-emerald-700'}`} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function InputBar({
  input, setInput, onSend, onQuickSelect, loading, charCount, maxChars, darkMode
}: {
  input: string
  setInput: (v: string) => void
  onSend: (v: string) => void
  onQuickSelect: (v: string) => void
  loading: boolean
  charCount: number
  maxChars: number
  darkMode: boolean
}) {
  const isNearLimit = charCount > maxChars * 0.8

  return (
    <div className="sticky bottom-0 w-full bg-transparent input-bar">
      <div className={`max-w-3xl mx-auto w-full mb-3 sm:mb-4 rounded-xl sm:rounded-2xl border backdrop-blur-md px-2.5 sm:px-4 md:px-6 py-2.5 sm:py-3 space-y-2 sm:space-y-3 shadow-lg ${darkMode
        ? 'border-slate-700 supports-[backdrop-filter]:bg-slate-800/50 shadow-slate-900/50'
        : 'border-emerald-200 supports-[backdrop-filter]:bg-white/50 shadow-emerald-200/50'
        }`}>
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide justify-center">
          <Chip onClick={() => onQuickSelect('รู้สึกเศร้า')} Icon={Frown} color={darkMode ? "bg-purple-900/50" : "bg-purple-100"} textColor={darkMode ? "text-purple-300" : "text-purple-800"} label="รู้สึกเศร้า" />
          <Chip onClick={() => onQuickSelect('อยากคุยหน่อยได้ไหม?')} Icon={SmilePlus} color={darkMode ? "bg-emerald-900/50" : "bg-emerald-100"} textColor={darkMode ? "text-emerald-300" : "text-emerald-800"} label="อยากคุยหน่อยได้ไหม" />
          <Chip onClick={() => onQuickSelect('ช่วยแนะนำหน่อย')} Icon={Star} color={darkMode ? "bg-yellow-900/50" : "bg-yellow-100"} textColor={darkMode ? "text-yellow-300" : "text-yellow-800"} label="ช่วยแนะนำหน่อย" />
          <Chip onClick={() => onQuickSelect('ขอช่องทางติดต่อให้คำปรึกษา')} Icon={Meh} color={darkMode ? "bg-pink-900/50" : "bg-pink-100"} textColor={darkMode ? "text-pink-300" : "text-pink-800"} label="ขอช่องทางติดต่อให้คำปรึกษา" />
        </div>

        <div className={`flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border px-3 sm:px-4 py-1.5 sm:py-2 focus-within:ring-2 ${darkMode
          ? 'border-slate-600 bg-slate-700/50 focus-within:ring-emerald-700'
          : 'border-emerald-300 bg-gradient-to-r from-slate-50 to-emerald-50 focus-within:ring-emerald-200'
          }`}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && onSend(input)}
            placeholder="พิมพ์ข้อความที่นี่..."
            disabled={loading}
            maxLength={maxChars}
            className={`flex-1 bg-transparent outline-none text-[14px] sm:text-[15px] md:text-[15.5px] py-1.5 sm:py-2 ${darkMode
              ? 'text-slate-100 placeholder-slate-400'
              : 'text-gray-800 placeholder-gray-400'
              }`}
          />
          <div className={`text-[10px] sm:text-xs shrink-0 ${isNearLimit
            ? 'text-orange-600 font-semibold'
            : darkMode
              ? 'text-slate-400'
              : 'text-slate-500'
            }`}>
            {charCount}/{maxChars}
          </div>
          <button
            onClick={() => onSend(input)}
            disabled={loading || !input.trim()}
            className={`inline-flex items-center cursor-pointer justify-center rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-white active:scale-95 transition shrink-0 ${loading || !input.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
          >
            <SendHorizonal className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function Chip({
  onClick, Icon, color, textColor, label,
}: {
  onClick: () => void
  Icon: any
  color: string
  textColor: string
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 inline-flex cursor-pointer items-center gap-1.5 sm:gap-2 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm shadow-sm ${color} ${textColor} hover:brightness-95 active:scale-95 transition`}
    >
      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  )
}
