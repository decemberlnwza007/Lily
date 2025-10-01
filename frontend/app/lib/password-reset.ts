import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export function generateResetToken() {
  return crypto.randomBytes(32).toString('hex')
}
export async function hashToken(raw: string) {
  return bcrypt.hash(raw, 10)
}
