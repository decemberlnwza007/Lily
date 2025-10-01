import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { reply: 'Server error: GEMINI_API_KEY is missing' },
        { status: 500 },
      )
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }]}],
        }),
      },
    )

    if (!res.ok) {
      let errBody: any = {}
      try { errBody = await res.json() } catch {}
      console.error('Gemini API error:', errBody)
      return NextResponse.json(
        { reply: 'เกิดข้อผิดพลาดจาก Gemini API' },
        { status: res.status },
      )
    }

    const data = await res.json()
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      'ไม่มีคำตอบ'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { reply: 'เกิดข้อผิดพลาดในการเรียก API' },
      { status: 500 },
    )
  }
}
