// app/api/auth/reset/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()
    if (!token || !password || password.length < 6) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 })
    }

    // หา token ที่ยังไม่หมดอายุทั้งหมด
    const candidates = await prisma.passwordResetToken.findMany({
      where: { expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    })

    // เช็คทีละตัว (เพราะเราเก็บเป็น hash)
    let matched: { id: string; userId: string } | null = null
    for (const t of candidates) {
      const ok = await bcrypt.compare(token, t.tokenHash)
      if (ok) { matched = { id: t.id, userId: t.userId }; break }
    }
    if (!matched) {
      return NextResponse.json({ error: 'expired_or_invalid' }, { status: 400 })
    }

    // อัปเดตรหัสผ่านใหม่ให้ user
    const hashed = await bcrypt.hash(password, 10)
    await prisma.$transaction([
      prisma.user.update({ where: { id: matched.userId }, data: { password: hashed } }),
      prisma.passwordResetToken.deleteMany({ where: { userId: matched.userId } }), // revoke ทั้งหมด
    ])

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'unknown' }, { status: 400 })
  }
}
