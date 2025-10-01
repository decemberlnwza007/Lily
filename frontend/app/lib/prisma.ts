// app/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

declare global {
  // ทำให้ hot-reload ไม่สร้าง instance หลายตัว
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
