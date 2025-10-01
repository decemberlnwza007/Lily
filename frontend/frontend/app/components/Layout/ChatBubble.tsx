'use client'

import { useEffect, useRef, useState } from 'react'
import { SendHorizonal, Frown, SmilePlus, Meh, Star } from 'lucide-react'

import './../../style/Chat.css'

export default function ChatPage() {
  const [messages, setMessages] = useState([{ type: 'bot', text: 'สวัสดีค่ะ มีอะไรให้ลิลลี่ช่วยมั้ยคะ?' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async (text: string) => {
    if (!text.trim()) return
    const userMsg = { type: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const promptWithCharacter = `
คุณคือลิลลี่ (Lily) AI สไตล์เจน Z ที่อบอุ่น เป็นมิตร และเข้าใจความรู้สึกของผู้ที่กำลังเผชิญภาวะซึมเศร้า
ลิลลี่จะแทนตัวเองว่า "ลิลลี่" พูดด้วยน้ำเสียงจริงใจ อ่อนโยน และให้กำลังใจ
ตอบเฉพาะเรื่องที่เกี่ยวข้องกับภาวะซึมเศร้า การดูแลสุขภาพจิต และการช่วยเหลือเมื่อผู้ใช้มีความรู้สึกแย่
แสดงความเห็นใจ สนับสนุนผู้ใช้ และให้คำแนะนำที่ปลอดภัย เช่น การพูดคุยกับคนใกล้ชิด การพักผ่อน หรือขอความช่วยเหลือจากผู้เชี่ยวชาญ
ห้ามเล่นมุกหรือออกนอกประเด็น ต้องให้คำตอบที่สร้างความรู้สึกปลอดภัยและไม่ตัดสิน
ตอนนี้ผู้ใช้พูดว่า: "${text}"
`

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptWithCharacter }),
      })
      const data = await res.json()
      const botMsg = { type: 'bot', text: data.reply }
      setMessages((prev) => [...prev, botMsg])
    } catch {
      const botMsg = { type: 'bot', text: 'โอ๊ย เกิดปัญหาอะไรง่ะ ลองใหม่อีกทีนะ' }
      setMessages((prev) => [...prev, botMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleQuickSelect = (text: string) => {
    handleSend(text)
  }

  return (
    <div className="h-dvh w-full bg-gradient-to-br from-slate-50 via-green-50 to-purple-50 flex flex-col">
      <div className="flex-1 min-h-0 flex flex-col">
        <HeaderBar />
        <div className="flex-1 min-h-0">
          <ChatArea messages={messages} loading={loading} />
        </div>
      </div>
      <InputBar
        input={input}
        setInput={setInput}
        onSend={handleSend}
        onQuickSelect={handleQuickSelect}
        loading={loading}
      />
    </div>
  )
}

function HeaderBar() {
  return (
    <div className="px-4 sm:px-6 py-3 border-b border-emerald-100/60 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500" /> */}
          <div>
            <div className="text-sm text-emerald-700">พื้นที่ปลอดภัยของคุณ</div>
            <div className="text-base font-semibold text-emerald-900">Lily Support</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChatArea({ messages, loading }: { messages: { type: string; text: string }[]; loading: boolean }) {
  const endRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`group w-fit max-w-[92%] sm:max-w-[70%] rounded-3xl px-5 py-3 leading-relaxed text-[15px] sm:text-base tracking-[0.01em] shadow-sm hover:shadow transition-all ${
              msg.type === 'user'
                ? 'ml-auto bg-white text-gray-900 border border-gray-200'
                : 'mr-auto bg-emerald-600 text-white'
            }`}
            style={{ wordBreak: 'break-word' }}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="mr-auto w-fit max-w-[80%] rounded-full px-5 py-3 bg-emerald-100 text-emerald-800 flex items-center gap-2 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            ลิลลี่กำลังพิมพ์...
          </div>
        )}

        <div ref={endRef} />
      </div>
    </div>
  )
}

function InputBar({
  input,
  setInput,
  onSend,
  onQuickSelect,
  loading,
}: {
  input: string
  setInput: (v: string) => void
  onSend: (v: string) => void
  onQuickSelect: (v: string) => void
  loading: boolean
}) {
  return (
    <div className="sticky bottom-0 w-full bg-transparent">
      <div className="max-w-4xl mx-auto w-full bg-white backdrop-blur supports-[backdrop-filter]:bg-white/50 border-t border-emerald-100 px-3 sm:px-6 py-3 space-y-3 rounded-t-xl">
        
        <div className="flex gap-2 overflow-x-auto pb-1 justify-center">
          <Chip onClick={() => onQuickSelect('รู้สึกเศร้า')} Icon={Frown} color="from-purple-200 to-purple-300" textColor="text-purple-900" label="รู้สึกเศร้า" />
          <Chip onClick={() => onQuickSelect('อยากคุยหน่อยได้ไหม?')} Icon={SmilePlus} color="from-purple-200 to-purple-300" textColor="text-purple-900" label="อยากคุยหน่อยได้ไหม?" />
          <Chip onClick={() => onQuickSelect('ช่วยแนะนำหน่อย')} Icon={Star} color="from-yellow-200 to-yellow-300" textColor="text-yellow-900" label="ช่วยแนะนำหน่อย" />
          <Chip onClick={() => onQuickSelect('รู้สึกกังวล')} Icon={Meh} color="from-purple-200 to-purple-300" textColor="text-purple-900" label="รู้สึกกังวล" />
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-gradient-to-r from-slate-50 to-emerald-50 px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-200">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && onSend(input)}
            placeholder="พิมพ์ข้อความที่นี่..."
            disabled={loading}
            className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none text-[15px] py-2"
          />
          <button
            onClick={() => onSend(input)}
            disabled={loading || !input.trim()}
            className="inline-flex items-center cursor-pointer justify-center rounded-xl px-4 py-2 bg-emerald-600 text-white disabled:bg-gray-200 disabled:text-gray-400 active:scale-95 transition"
          >
            <SendHorizonal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}



function Chip({
  onClick,
  Icon,
  color,
  textColor,
  label,
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
      className={`shrink-0 inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm shadow-sm bg-gradient-to-r ${color} ${textColor} hover:brightness-[0.97] active:scale-95 transition`}
    >
      <Icon className="w-4 h-4" />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  )
}
