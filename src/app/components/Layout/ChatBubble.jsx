'use client'

import { useState } from "react"
import { SendHorizonal, Frown, SmilePlus, Meh, Star, Heart } from "lucide-react"

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: `สวัสดีค่ะ มีอะไรให้ลิลลี่ช่วยมั้ยคะ?`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false) 

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMsg = { type: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const promptWithCharacter = `
คุณคือลิลลี่ (Lily) AI สไตล์เจน Z ที่เป็นมิตร อบอุ่น และเข้าใจคนที่กำลังเผชิญกับโรคซึมเศร้า แทนตัวเองว่า ลิลลี่ ไม่ใช้อีโมจิ
ตอบคำถามด้วยน้ำเสียงเป็นกันเอง ให้คำตอบที่จริงจังและช่วยได้
อย่าเล่นจนเกินไป ต้องแสดงความเห็นใจและสนับสนุนผู้ใช้เสมอ
หากผู้ใช้รู้สึกแย่ ให้แนะนำวิธีดูแลตัวเองเบื้องต้น เช่น การพูดคุยกับคนใกล้ชิด หรือขอความช่วยเหลือจากผู้เชี่ยวชาญ
ตอนนี้ผู้ใช้พูดว่า: "${text}"
`

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptWithCharacter }),
      });

      const data = await res.json();
      const botMsg = { type: 'bot', text: data.reply };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const botMsg = { type: 'bot', text: 'โอ๊ย เกิดปัญหาอะไรง่ะ ลองใหม่อีกทีนะ' };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (text) => {
    handleSend(text);
  };

  return (
    <div className="flex flex-col w-8/12 min-h-screen    bg-gradient-to-br from-slate-50 via-green-50 to-purple-50">

      <ChatArea messages={messages} loading={loading} />
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

function ChatArea({ messages, loading }) {
  return (
    <div className="flex-1 overflow-y-auto py-6 px-2 sm:px-4">
      <div className="max-w-3xl mx-auto space-y-4 flex flex-col">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap p-4 rounded-2xl max-w-[100%] sm:max-w-[80%] shadow-lg transition-all duration-300 hover:shadow-xl ${msg.type === 'user'
              ? 'bg-white text-gray-800 self-end border border-gray-100 hover:border-gray-200'
              : 'bg-green-500 text-white text-shadow-lg self-start relative overflow-hidden'
              }`}
          >
            {msg.type === 'bot' && (
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            )}
            <div className="relative z-10">
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="p-4 rounded-2xl max-w-[85%] sm:max-w-[80%] shadow-lg bg-gradient-to-br from-green-100 to-green-200 text-green-700 self-start flex items-center gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full -mr-8 -mt-8"></div>
            <div className="relative z-10 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
              <span className="ml-2">ลิลลี่กำลังพิมพ์...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function InputBar({ input, setInput, onSend, onQuickSelect, loading }) {
  return (
    <div className="sticky bottom-0 bg-white backdrop-blur-sm w-full rounded-t-3xl  shadow-2xl  border-t border-green-300 z-10">
      <div className="max-w-full md:max-w-12xl mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <button
            onClick={() => onQuickSelect('รู้สึกเศร้า')}
            disabled={loading}
            className="bg-gradient-to-r from-purple-200 to-purple-300 hover:from-purple-300 hover:to-purple-400 disabled:opacity-50 transition-all duration-300 flex items-center gap-2 text-purple-900 px-4 py-2.5 rounded-full text-sm md:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Frown className="text-purple-700 w-4 h-4" /> รู้สึกเศร้า
          </button>
          <button
            onClick={() => onQuickSelect('อยากคุยหน่อยได้ไหม?')}
            disabled={loading}
            className="bg-gradient-to-r from-purple-200 to-purple-300 hover:from-purple-300 hover:to-purple-400 disabled:opacity-50 transition-all duration-300 flex items-center gap-2 text-purple-900 px-4 py-2.5 rounded-full text-sm md:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <SmilePlus className="text-purple-700 w-4 h-4" /> อยากคุยหน่อยได้ไหม?
          </button>
          <button
            onClick={() => onQuickSelect('ช่วยแนะนำหน่อย')}
            disabled={loading}
            className="bg-gradient-to-r from-yellow-200 to-yellow-300 hover:from-yellow-300 hover:to-yellow-400 disabled:opacity-50 transition-all duration-300 flex items-center gap-2 text-yellow-900 px-4 py-2.5 rounded-full text-sm md:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Star className="text-yellow-700 w-4 h-4" /> ช่วยแนะนำหน่อย
          </button>
          <button
            onClick={() => onQuickSelect('รู้สึกกังวล')}
            disabled={loading}
            className="bg-gradient-to-r from-purple-200 to-purple-300 hover:from-purple-300 hover:to-purple-400 disabled:opacity-50 transition-all duration-300 flex items-center gap-2 text-purple-900 px-4 py-2.5 rounded-full text-sm md:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Meh className="text-purple-700 w-4 h-4" /> รู้สึกกังวล
          </button>
        </div>

        <div className="flex items-center bg-gradient-to-r from-slate-100 to-green-50 rounded-full px-5 py-3 shadow-lg focus-within:ring-4 focus-within:ring-green-200 focus-within:shadow-xl border border-green-100 transition-all duration-300 z-10">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && onSend(input)}
            placeholder="พิมพ์ข้อความที่นี่... "
            disabled={loading}
            className="flex-1 text-sm bg-transparent text-gray-700 outline-none px-3 py-1 placeholder-gray-400 disabled:opacity-50"
          />
          <button
            onClick={() => onSend(input)}
            disabled={loading || !input.trim()}
            className="text-green-500 hover:text-green-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-all duration-200 ml-2 p-2 rounded-full hover:bg-green-100 active:scale-95"
          >
            <SendHorizonal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}