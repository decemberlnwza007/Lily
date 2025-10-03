// app/actions.ts
import { createClient } from "../utils/supabase/client"

const supabase = createClient()

export interface LoginData {
    email: string
    password: string
}

export async function loginUser({ email, password }: LoginData) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error
        if (!data.session) throw new Error('ไม่พบ session')

        return { success: true, session: data.session }
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ'
        return { success: false, error: message }
    }
}
