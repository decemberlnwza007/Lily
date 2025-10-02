import { NextResponse } from 'next/server'
import { createClient } from '../../utils/supabase/server'

export const runtime = 'nodejs'

export async function GET(req: Request) {
    const supabase = createClient()

    try {
        // 📥 ดึง user_id จาก query string
        const { searchParams } = new URL(req.url)
        const userId = searchParams.get('user_id')

        if (!userId) {
            return NextResponse.json(
                { error: 'user_id is required' },
                { status: 400 }
            )
        }

        // 🧠 1) ดึง session ล่าสุดของ user
        const { data: history, error: historyError } = await (await supabase)
            .from('chat_history')
            .select('id, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (historyError) {
            console.error('Error fetching chat_history:', historyError)
            return NextResponse.json(
                { error: 'Failed to fetch chat history' },
                { status: 500 }
            )
        }

        // ถ้าไม่มี session เลย ส่ง array ว่าง
        if (!history) return NextResponse.json({ session: null, messages: [] })

        // 📨 2) ดึง chat_content ของ session ล่าสุด
        const { data: messages, error: messagesError } = await (await supabase)
            .from('chat_content')
            .select('id, role, content, created_at')
            .eq('session_id', history.id)
            .order('created_at', { ascending: true })

        if (messagesError) {
            console.error('Error fetching chat_content:', messagesError)
            return NextResponse.json(
                { error: 'Failed to fetch chat content' },
                { status: 500 }
            )
        }

        // 📦 3) ส่งกลับข้อมูลทั้งหมด
        return NextResponse.json({
            session: {
                id: history.id,
                created_at: history.created_at,
            },
            messages: messages ?? [],
        })
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
            { status: 500 }
        )
    }
}
