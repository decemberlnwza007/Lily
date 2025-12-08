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

  const url = request.nextUrl
  const hasCompletedAssessment = user.user_metadata?.has_completed_assessment === true

  // ถ้ายังไม่ทำแบบประเมิน → บังคับไปหน้า /despression
  // ยกเว้นหน้า /despression เอง, หน้าต่อเนื่อง (/estimate, /eightquestion) และหน้า static/auth อื่นๆ
  if (
    !hasCompletedAssessment &&
    !url.pathname.startsWith('/despression') &&
    !url.pathname.startsWith('/estimate') &&
    !url.pathname.startsWith('/eightquestion') &&
    !url.pathname.startsWith('/api') // อย่า block API calls
  ) {
    const redirectUrl = new URL('/despression', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // ถ้าทำแบบประเมินแล้ว แต่พยายามเข้าหน้า /despression (อาจจะยอมให้เข้าได้ หรือ redirect ไปหน้าแรกก็ได้)
  // ในที่นี้ user request บอกว่า "After completing... allowed to see all navigation", ไม่ได้บอกว่าห้ามเข้าหน้า assessment ซ้ำ
  // แต่ปกติถ้าเสร็จแล้วอาจจะอยากให้ไปหน้าแรกถ้าเข้า root, แต่ถ้าเข้า /despression โดยตรงอาจจะอยากทำใหม่?
  // Requirement ข้อ 2: "After completing... user should be redirected to the home page (/)"
  // อันนี้น่าจะหมายถึงตอนทำเสร็จใหม่ๆ
  // แต่ถ้า user เข้า /despression เองเพื่อทำใหม่ ก็ควรยอม
  // ดังนั้น logic นี้ถูกต้องแล้ว คือแค่ block หน้าอื่นถ้ายังไม่เสร็จ

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|register|login|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
