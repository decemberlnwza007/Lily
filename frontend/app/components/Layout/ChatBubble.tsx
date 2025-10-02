'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { SendHorizonal, Frown, SmilePlus, Meh, Star, User, Phone } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './../../style/Chat.css'
import { createClient } from '../../utils/supabase/client'


type Msg = { type: 'bot' | 'user'; text: string }
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

interface ChatPageProps { chatId?: string }

export default function ChatPage({ chatId }: ChatPageProps) {
  const supabase = createClient()
  const nameKey = chatId ? `lily_user_name_${chatId}` : 'lily_user_name_default'
  const [userName, setUserName] = useState<string>('')
  const storageKey = chatId ? `lily_chat_history_${chatId}` : 'lily_chat_history_default'
  const [messages, setMessages] = useState<Msg[]>([
    { type: 'bot', text: userName ? `สวัสดี ${userName} 🌿 วันนี้อยากให้ลิลลี่ช่วยเรื่องไหนดีน้า` : 'สวัสดีค่ะ มีอะไรให้ลิลลี่ช่วยมั้ยคะ?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getSession()
      const uid = data?.session?.user?.id
      if (uid) setUserId(uid)
      console.log(messages)
    }

    getUserId()
  }, []) // ← สำคัญ! ไม่งั้นจะรันทุก render
  useEffect(() => {
    if (messages.length === 1 && messages[0].type === 'bot') {
      setMessages([{ type: 'bot', text: userName ? `สวัสดี ${userName} 🌿 วันนี้อยากให้ลิลลี่ช่วยเรื่องไหนดีน้า` : 'สวัสดีค่ะ มีอะไรให้ลิลลี่ช่วยมั้ยคะ?' }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName])


  function buildHistory(messages: { type: 'bot' | 'user'; text: string }[], limit = 8) {
    const slice = messages.slice(-limit);
    return slice.map(m => (m.type === 'user' ? `ผู้ใช้: ${m.text}` : `ลิลลี่: ${m.text}`)).join('\n');
  }

  useEffect(() => {
    try { const raw = localStorage.getItem(storageKey); if (raw) setMessages(JSON.parse(raw)) } catch { }
  }, [storageKey])
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(messages)) } catch { }
  }, [messages, storageKey])

  useEffect(() => {
    try { const raw = localStorage.getItem(nameKey); if (raw) setUserName(raw) } catch { }
  }, [nameKey])

  // บันทึกชื่อเมื่อเปลี่ยน
  useEffect(() => {
    try { if (userName) localStorage.setItem(nameKey, userName) } catch { }
  }, [userName, nameKey])

  // get chat history
  useEffect(() => {
    if (!userId) return

    const getChat = async () => {
      // สมมติ fetch จาก API แล้วได้ JSON
      const fetchChat = async (): Promise<Msg[]> => {
        const res = await fetch(`/api/chat-history?user_id=${userId}`)
        const data: ChatApiResponse = await res.json()

        // แปลง ApiMsg[] -> Msg[]
        return data.messages.map(msg => ({
          type: msg.role === 'ai' ? 'bot' : 'user',
          text: msg.content
        }))
      }

      const msgs = await fetchChat()
      setMessages(msgs)
      console.log('Mapped messages:', msgs)
    }

    getChat()
  }, [userId])

  function naturalizeFollowups(md: string) {
    const lines = md.split('\n');
    const out: string[] = [];
    let skipHeading = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (/^\s{0,3}#{1,6}.*คำถาม/i.test(line)) {
        skipHeading = true;
        continue;
      }
      if (skipHeading) {
        if (!line.trim()) { out.push(line); continue; }
        const q = line.replace(/^\s*(?:[-*]|\d+\.)\s*/, '');
        out.push(q);
        if (i + 1 < lines.length && !lines[i + 1].trim()) skipHeading = false;
        continue;
      }
      if (/^\s*---\s*\(.*\)\s*$/i.test(line)) { out.push('---'); continue; }
      out.push(line);
    }

    return out.join('\n')
  }

  function isContactIntent(text: string) {
    const q = (text || '').toLowerCase()
    const kw = [
      'เบอร์', 'โทร', 'โทรหา', 'สายด่วน', 'ติดต่อ', 'ช่องทางติดต่อ',
      'ขอคำปรึกษา', 'คุยกับผู้เชี่ยวชาญ', 'นักจิต', 'นักสุขภาพจิต', 'จิตแพทย์',
      'hotline', 'call', 'contact', 'help line', 'helpdesk', '1323'
    ]
    return kw.some(k => q.includes(k))
  }

  // ตัดเฉพาะส่วนที่เกี่ยวกับการติดต่อออกให้เกลี้ยง
  function stripContactBlocks(md: string) {
    if (!md) return md

    let out = md

    // 1) ลบหัวข้อ "### ช่องทางช่วยเหลือด่วน" ถึงก่อนหัวข้อใหม่/จบข้อความ
    out = out.replace(
      /^###\s*ช่องทางช่วยเหลือด่วน[\s\S]*?(?=\n#{1,6}\s|\n-{3,}\s*$|\n$|$)/gm,
      ''
    )

    // 2) ลบ fenced code block ```action ... ```
    out = out.replace(/```action[\s\S]*?```/g, '')

    // 3) แปลงลิงก์ tel: ให้เหลือข้อความเฉย ๆ (กัน ReactMarkdown เรนเดอร์ปุ่ม)
    out = out.replace(/\[([^\]]+)\]\(tel:[^)]+\)/g, '$1')

    // 4) ลบบรรทัดที่เป็น 1323 แบบยืนเดี่ยว ๆ ที่มักโผล่มาจาก template
    out = out.replace(/^\s*[-*]\s*📞\s*\*\*.*1323.*\n?/gmi, '')
    out = out.replace(/^\s*📞\s*.*1323.*\n?/gmi, '')

    // 5) ถ้ามีเส้นคั่นหลายเส้นติดกันเพราะลบเนื้อหา อัดให้เหลือเว้นบรรทัดเดียว
    out = out.replace(/\n{3,}/g, '\n\n')

    return out.trim()
  }

  // รวมขั้น: ตัด "หัวข้อคำถามกลับ" ตามเดิม + ตัด contact ถ้าไม่ได้ตั้งใจถาม
  function sanitizeReply(md: string, contactIntent: boolean) {
    const cleaned = naturalizeFollowups(md)
    return contactIntent ? cleaned : stripContactBlocks(cleaned)
  }


  const handleSend = async (text: string) => {
    if (!text.trim()) return
    setMessages(p => [...p, { type: 'user', text }])
    setInput(''); setLoading(true)

    try {
      const history = buildHistory([...messages, { type: 'user', text }])
      const contactIntent = isContactIntent(text)

      // ✅ สร้างพรอมป์ต์ด้วยการ "อินไลน์" history + text จริงๆ (ไม่มี backslash หน้าดอลลาร์)
      const prompt = `
[system]
คุณคือลิลลี่ (Lily) เพื่อน AI โทนอ่อนโยน ปลอดภัยต่อใจ ตอบเป็นไทยธรรมชาติ
- ใช้อีโมจิอย่างเหมาะสมเพื่อเพิ่มความน่ารักและกำลังใจ (เช่น 💚✨🌿🫶🏻) โดย "เกี่ยวข้องกับเนื้อหา"
- หลีกเลี่ยงภาษาหุ่นยนต์/เทมเพลตซ้ำ ๆ และไม่ยึดติดหัวข้อเดิมทุกครั้ง
- อ้างอิงสิ่งที่ผู้ใช้เล่า "เฉพาะในรอบนี้" เป็นหลัก

[emoji style guide]
- จำนวน: ≤ 2–3 ต่อย่อหน้า, ไม่ต้องใส่ท้ายทุกบรรทัด
- ตำแหน่ง: เปิด/ปิดประโยคสำคัญ หรือท้ายหัวข้อสั้น ๆ เท่านั้น
- ความเกี่ยวข้อง: ใช้สอดคล้องอารมณ์/บริบท เช่น เครียด 😥, โล่งใจ 😌, ให้กำลังใจ 💪🏻, อ่อนโยน 💚
- หลีกเลี่ยงสแปม, หลีกเลี่ยงอีโมจิที่ทำให้ประเด็นซีเรียสดูเบาเกินไป

[policy: contact_block]
allow_contact_block=${contactIntent ? 'true' : 'false'}
กฎ:
- แสดงบล็อก "ช่องทางช่วยเหลือด่วน" เฉพาะเมื่อ allow_contact_block=true เท่านั้น
- ถ้า allow_contact_block=false ห้ามแสดงเบอร์โทร, ลิงก์ tel:, หรือโค้ด \`\`\`action ใด ๆ

[style]
- เปิดด้วยการสะท้อนความรู้สึกแบบเพื่อน สั้น กระชับ (ระบุอารมณ์ + validate) 🫶🏻
- ข้อเสนอแนะ 1–3 ข้อที่ทำได้จริงในตอนนี้ (ไม่ต้องใส่หัวข้อถ้าไม่จำเป็น)
- ใช้คำพูดนุ่มนวล ชวนคุยต่อแบบเป็นธรรมชาติ (ไม่ต้องใส่คำว่า “คำถาม/คำถามกลับ”)
- ถ้าจะใช้หัวข้อ ให้ใช้เท่าที่จำเป็นและสั้น

[history]
${history}

[user]
${text}

[output]
- โฟกัสตอบ "ประเด็นที่ผู้ใช้ถามจริง" เท่านั้น และอ้างอิงคำของผู้ใช้รอบนี้
- ใช้อีโมจิตาม [emoji style guide]
- ถ้า allow_contact_block=true ให้แสดงบล็อกต่อไปนี้ให้ครบ แล้วปิดท้ายด้วยประโยคชวนเล่าต่อแบบธรรมชาติ ✨:
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
`;


      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, userId, input }), // ← ส่ง prompt ที่ “อินไลน์แล้ว”
      })
      const data = await res.json()

      // post-process: ถ้าไม่ได้ถามเรื่องการติดต่อ ให้ตัดบล็อกทิ้งกันพลาด
      const finalReply = sanitizeReply(data.reply, contactIntent)

      setMessages(p => [...p, { type: 'bot', text: finalReply }])
    } catch {
      setMessages(p => [...p, { type: 'bot', text: 'มีปัญหานิดหน่อย ลองใหม่อีกทีน้า' }])
    } finally { setLoading(false) }
  }



  const handleQuickSelect = (t: string) => handleSend(t)

  return (
    <div className="relative h-dvh w-full bg-white text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_10%_-10%,#dcfce7_0%,transparent_40%),radial-gradient(800px_400px_at_90%_-10%,#f3e8ff_0%,transparent_35%)]" />
        <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)] bg-[radial-gradient(circle,_rgba(16,185,129,0.18)_1px,_transparent_1px)] [background-size:14px_14px]" />
      </div>

      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <LilyAvatar className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs text-emerald-700/80">พื้นที่ปลอดภัยของคุณ</div>
              <div className="text-sm font-semibold">Lily Support</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-[calc(100dvh-56px)]">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 space-y-5">
            {messages.map((m, i) => <Bubble key={i} role={m.type} text={m.text} />)}
            {loading && <Typing />}
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
    </div>
  )
}

function LilyAvatar({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#g)" />
      <circle cx="24" cy="28" r="4" fill="#0f172a" />
      <circle cx="40" cy="28" r="4" fill="#0f172a" />
      <circle cx="20" cy="36" r="3" fill="#fda4af" opacity="0.8" />
      <circle cx="44" cy="36" r="3" fill="#fda4af" opacity="0.8" />
      <path d="M22 38 C32 46, 32 46, 42 38" stroke="#0f172a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="46" cy="16" r="3" fill="white" opacity="0.8" />
    </svg>
  )
}

function Bubble({ role, text }: { role: 'bot' | 'user'; text: string }) {
  const supabase = createClient()
  const isUser = role === 'user'
  const [session, setSession] = useState(null)
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await (await supabase.auth.getSession())
      setSession(data.session)
    }

    fetchSession()
  }, [])
  const copy = () => navigator.clipboard.writeText(text).catch(() => { })

  // ✅ ฟังก์ชันช่วยโทรแบบชัวร์จาก user gesture + fallback
  const callNow = (tel: string) => {
    try {
      window.location.href = `tel:${tel}`
    } catch {
      navigator.clipboard?.writeText(tel).catch(() => { })
      alert(`คัดลอกเบอร์ ${tel} แล้วน้า ลองโทรด้วยมือถือได้เลย 💚`)
    }
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="flex items-start gap-3 max-w-full">
        {!isUser && (
          <div className="mt-1.5 shrink-0">
            <div className="h-9 w-9 rounded-full bg-white border border-emerald-100 shadow-sm flex items-center justify-center">
              <LilyAvatar className="h-7 w-7" />
            </div>
          </div>
        )}

        <div className={`relative w-full sm:w-auto max-w-[min(760px,90vw)] rounded-2xl bg-white border ${isUser ? 'border-slate-200' : 'border-emerald-100'} shadow-sm`}>
          <div className="p-4 sm:p-5">
            {isUser ? (
              <div className="text-[15.5px] leading-7 whitespace-pre-wrap">{text}</div>
            ) : (
              <div className="prose prose-slate max-w-none text-[15.5px] leading-7
                              prose-headings:font-semibold prose-h1:text-[20px] prose-h2:text-[18px]
                              prose-h3:text-[16px] prose-p:my-2 prose-ol:my-2 prose-ul:my-2
                              prose-li:my-1 prose-ol:pl-6 prose-ul:pl-5
                              prose-hr:my-4 prose-hr:border-slate-200
                              prose-th:font-semibold prose-td:align-top marker:font-semibold">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    hr: (props) => <hr {...props} className="border-t border-slate-200 my-4" />,
                    ol: (props) => <ol {...props} className="list-decimal pl-6 space-y-1" />,
                    ul: (props) => <ul {...props} className="list-disc pl-5 space-y-1" />,
                    li: (props) => <li {...props} className="leading-7" />,
                    table: (props) => <table {...props} className="w-full border-collapse text-[15px]" />,
                    th: (props) => <th {...props} className="border-b border-slate-200 px-3 py-2 text-left" />,
                    td: (props) => <td {...props} className="border-b border-slate-100 px-3 py-2 align-top" />,
                    h2: (props) => <h2 {...props} className="mt-1 mb-1 font-semibold" />,
                    p: (props) => <p {...props} className="my-2" />,

                    // ✅ ลิงก์: แปลง tel: เป็นปุ่มโทร (onClick -> window.location.href)
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
                            className="not-prose inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-600 text-white px-3 py-2 shadow-sm hover:brightness-95 active:scale-95 transition"
                          >
                            <Phone className="w-4 h-4" />
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
                          className="text-emerald-700 underline decoration-emerald-300 hover:decoration-emerald-500"
                        >
                          {children}
                        </a>
                      )
                    },

                    // ✅ บล็อก ```action -> เรนเดอร์เป็นปุ่ม CALL/LINK จริง
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
                          <div className="not-prose flex flex-wrap gap-2 my-2">
                            {items.map((it, idx) => {
                              if (it.type === 'CALL') {
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => callNow(it.value)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-600 text-white px-3 py-2 shadow-sm hover:brightness-95 active:scale-95 transition"
                                  >
                                    <Phone className="w-4 h-4" />
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
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 px-3 py-2 shadow-sm hover:bg-slate-50 active:scale-95 transition"
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
        </div>

        {isUser && (
          <div className="mt-1.5 shrink-0">
            <div className="h-9 w-9 rounded-full text-white flex items-center justify-center">
              {/* <User className="w-4 h-4" /> */}
              {session?.user?.image ? (
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------- Typing ---------- */
function Typing() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-white border border-emerald-100 shadow-sm flex items-center justify-center">
          <LilyAvatar className="h-7 w-7" />
        </div>
        <div className="rounded-full bg-white border border-emerald-100 shadow-sm px-4 py-2">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500/80 animate-bounce [animation-delay:0ms]" />
            <span className="h-2 w-2 rounded-full bg-emerald-500/80 animate-bounce [animation-delay:120ms]" />
            <span className="h-2 w-2 rounded-full bg-emerald-500/80 animate-bounce [animation-delay:240ms]" />
          </div>
        </div>
      </div>
    </div>
  )
}

function InputBar({
  input, setInput, onSend, onQuickSelect, loading,
}: {
  input: string
  setInput: (v: string) => void
  onSend: (v: string) => void
  onQuickSelect: (v: string) => void
  loading: boolean
}) {
  return (
    <div className="sticky bottom-0 w-full bg-transparent input-bar">
      <div className="max-w-3xl mx-auto w-full mb-4 rounded-2xl border border-emerald-200 bg-transparent backdrop-blur-md supports-[backdrop-filter]:bg-white/50 px-3 sm:px-6 py-3 space-y-3 shadow-lg shadow-emerald-200/50">
        <div className="flex gap-2 overflow-x-auto pb-1 justify-center">
          <Chip onClick={() => onQuickSelect('รู้สึกเศร้า')} Icon={Frown} color="from-purple-200 to-purple-300" textColor="text-purple-900" label="รู้สึกเศร้า" />
          <Chip onClick={() => onQuickSelect('อยากคุยหน่อยได้ไหม?')} Icon={SmilePlus} color="from-purple-200 to-purple-300" textColor="text-purple-900" label="อยากคุยหน่อยได้ไหม?" />
          <Chip onClick={() => onQuickSelect('ช่วยแนะนำหน่อย')} Icon={Star} color="from-yellow-200 to-yellow-300" textColor="text-yellow-900" label="ช่วยแนะนำหน่อย" />
          <Chip onClick={() => onQuickSelect('ขอช่องทางติดต่อให้คำปรึกษา')} Icon={Meh} color="from-purple-200 to-purple-300" textColor="text-purple-900" label="ขอช่องทางติดต่อให้คำปรึกษา" />
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-gradient-to-r from-slate-50 to-emerald-50 px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-200">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && onSend(input)}
            placeholder="พิมพ์ข้อความที่นี่..."
            disabled={loading}
            className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none text-[15.5px] py-2"
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
      className={`shrink-0 inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm shadow-sm bg-gradient-to-r ${color} ${textColor} hover:brightness-[0.97] active:scale-95 transition`}
    >
      <Icon className="w-4 h-4" />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  )
}
