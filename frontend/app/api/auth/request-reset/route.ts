// // app/api/auth/request-reset/route.ts
// import { NextResponse } from 'next/server'
// import { prisma } from '../../../../lib/prisma'
// import { generateResetToken, hashToken } from '../../../../lib/password-reset'
// import { sendResetEmail } from '../../../../lib/mail'
// import { addMinutes } from 'date-fns'

// export async function POST(req: Request) {
//   const { email } = await req.json().catch(() => ({}))
//   // ตอบเหมือนกันเสมอ ป้องกันเดาว่ามีเมลนี้ไหม
//   const ok = NextResponse.json({}, { status: 200 })
//   if (!email) return ok

//   const user = await prisma.user.findUnique({ where: { email } })
//   if (!user) return ok

//   // ลบโทเคนเก่า
//   await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })

//   const raw = generateResetToken()
//   const tokenHash = await hashToken(raw)
//   const expiresAt = addMinutes(new Date(), 60)

//   await prisma.passwordResetToken.create({
//     data: { userId: user.id, tokenHash, expiresAt },
//   })

//   const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
//   const resetUrl = `${baseUrl}/reset-password/${raw}`
//   await sendResetEmail(email, resetUrl)

//   return ok
// }
