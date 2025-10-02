import { NextResponse } from 'next/server'
import { createClient } from '../../utils/supabase/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const supabase = createClient()

  try {
    const { prompt, userId, input } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { reply: 'Server error: GEMINI_API_KEY is missing' },
        { status: 500 }
      )
    }

    // 🔮 เรียก Gemini API
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        }),
      }
    )

    if (!res.ok) {
      let errBody: any = {}
      try {
        errBody = await res.json()
      } catch { }
      console.error('Gemini API error:', errBody)
      return NextResponse.json(
        { reply: 'เกิดข้อผิดพลาดจาก Gemini API' },
        { status: res.status }
      )
    }

    const data = await res.json()
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'ไม่มีคำตอบ'

    // 📌 สมมติว่าเรามี user_id จาก session แล้ว

    // ✅ 1) ตรวจว่ามี chat_history ของ user นี้หรือยัง
    const { data: existingHistory, error: checkError } = await (await supabase)
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = no rows found (ไม่ถือว่า error จริง)
      console.error('Check history error:', checkError)
      return NextResponse.json({ reply: 'ไม่สามารถตรวจสอบ session ได้' }, { status: 500 })
    }

    let historyId = existingHistory?.id

    // ✅ 2) ถ้าไม่มี → สร้างใหม่
    if (!historyId) {
      const { data: newHistory, error: historyError } = await (await supabase)
        .from('chat_history')
        .insert([{ user_id: userId }])
        .select()
        .single()

      if (historyError) {
        console.error('Failed to create chat_history:', historyError)
        return NextResponse.json({ reply: 'ไม่สามารถสร้าง session ได้' }, { status: 500 })
      }

      historyId = newHistory.id
    }

    // ✅ 3) บันทึกเนื้อหาจาก AI ลง chat_content
    const { error: insertError } = await (await supabase)
      .from('chat_content')
      .insert([{ role: 'ai', content: reply, session_id: historyId }])

    if (insertError) {
      console.error('Failed to insert chat_content:', insertError)
    }
    // ✅ 3) บันทึกเนื้อหาจาก User ลง chat_content
    const { error: tError } = await (await supabase)
      .from('chat_content')
      .insert([{ role: 'user', content: input, session_id: historyId }])

    if (tError) {
      console.error('Failed to insert chat_content:', insertError)
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ reply: 'เกิดข้อผิดพลาดในการเรียก API' }, { status: 500 })
  }
}
