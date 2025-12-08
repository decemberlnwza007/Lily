import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from './app/utils/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // ให้ updateSession ทำงานก่อน → ดึง user จาก cookies
  const response = await updateSession(request)

  // สร้าง supabase ใหม่สำหรับอ่านข้อมูล user
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // ถ้าไม่ได้ล็อกอิน → ปล่อยไปตามที่ updateSession จัดการแล้ว
  if (!user) return response

  // ดึงข้อมูลจาก table profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('has_filled_assessment')
    .eq('id', user.id)
    .single()

  const url = request.nextUrl

  // ถ้ายังไม่ทำแบบประเมิน → บังคับไปหน้า /assessment
  if (
    profile &&
    !profile.has_filled_assessment &&
    !url.pathname.startsWith('/assessment')
  ) {
    const redirectUrl = new URL('/assessment', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|register|login|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
