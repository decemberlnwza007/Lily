
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendResetEmail(to: string, resetUrl: string) {
  await resend.emails.send({
    from: 'Lily <noreply@your-domain.com>',
    to,
    subject: 'รีเซ็ตรหัสผ่านของคุณ',
    html: `
      <p>สวัสดีค่ะ</p>
      <p>กดลิงก์เพื่อตั้งรหัสผ่านใหม่ (60 นาที):</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>ถ้าไม่ได้เป็นคนขอเอง เมินอีเมลนี้ได้เลยค่ะ</p>
    `,
  })
}
