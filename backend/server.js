import express from 'express'
import dotenv from 'dotenv'
import { Resend } from 'resend'
dotenv.config()

const app = express()
app.use(express.json())

const resend = new Resend(process.env.RESEND_API_KEY)

/** --- utils: escape HTML กัน XSS เบื้องต้น --- */
const escapeHtml = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/** --- ฟังก์ชันประกอบเทมเพลตอีเมล (ไดนามิก) --- */
function renderEmail({
  previewText = 'ข้อความตัวอย่างสั้น ๆ สำหรับ preview',
  brandName = 'Lily',
  title = 'สวัสดีจาก Lily ❤️',
  greeting = 'สวัสดีค่ะ',
  messageHtml = 'นี่คือข้อความในอีเมลนะคะ',
  ctaText = 'ดูรายละเอียด',
  ctaLink = 'https://your-link-here',
  footer = '© 2025 Lily Project. All rights reserved.',
  logoUrl,           // ใส่โลโก้ได้ (ถ้ามี)
  accentFrom = '#ef4444',
  accentTo = '#b91c1c',
}) {
  // ปลอดภัยกับข้อความที่เป็น text
  const safe = {
    previewText: escapeHtml(previewText),
    brandName: escapeHtml(brandName),
    title: escapeHtml(title),
    greeting: escapeHtml(greeting),
    ctaText: escapeHtml(ctaText),
    ctaLink: escapeHtml(ctaLink),
    footer: escapeHtml(footer),
    accentFrom: escapeHtml(accentFrom),
    accentTo: escapeHtml(accentTo),
  }

  // messageHtml อนุญาต HTML ได้ (เช่น <strong>...</strong>)—ถ้าจะเข้มงวดให้ escapeHtml ด้วย
  const safeMessageHtml = messageHtml

  return `
  <!doctype html>
  <html>
  <head>
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light only">
    <meta charset="utf-8" />
    <title>${safe.title}</title>
  </head>
  <body style="margin:0;background:#f8fafc;">
    <!-- preview text (hidden) -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      ${safe.previewText}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
    </div>

    <table width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc; padding:40px 0; font-family:Arial, Helvetica, sans-serif">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden">
            <tr>
              <td style="background:linear-gradient(90deg,${safe.accentFrom},${safe.accentTo}); padding:24px; text-align:center; color:#fff; font-size:24px; font-weight:bold;">
                ${safe.title}
              </td>
            </tr>
            ${logoUrl ? `
            <tr>
              <td style="padding:24px; text-align:center;">
                <img src="${escapeHtml(logoUrl)}" alt="${safe.brandName} Logo" width="96" height="96" style="max-width:96px; height:auto; display:inline-block; border:0;" />
              </td>
            </tr>` : ''}

            <tr>
              <td style="padding:0 24px; color:#374151; font-size:16px; line-height:1.6;">
                <h1 style="margin:0 0 8px; font-size:22px; color:#111827;">${safe.greeting}</h1>
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px 16px; color:#374151; font-size:16px; line-height:1.6;">
                ${safeMessageHtml}
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px 24px; text-align:left;">
                <a href="${safe.ctaLink}"
                  style="display:inline-block;background:${safe.accentTo};color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;border:0;font-weight:600;">
                  ${safe.ctaText}
                </a>
              </td>
            </tr>

            <tr>
              <td style="background:#f3f4f6; padding:16px; text-align:center; font-size:13px; color:#6b7280;">
                ${safe.footer}
              </td>
            </tr>
          </table>

          <div style="color:#9ca3af; font-size:12px; margin-top:12px;">
            หากคุณไม่ได้ร้องขออีเมลฉบับนี้ คุณสามารถเพิกเฉยได้เลย
          </div>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
}

/** --- Endpoint ส่งอีเมล: รับ templateData จาก client --- */
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, templateData, html: htmlFromClient } = req.body || {}
    if (!to || !subject) {
      return res.status(400).json({ ok: false, error: "ต้องมี 'to' และ 'subject'" })
    }

    // ถ้า client ส่ง html ตรง ๆ มา ให้ใช้เลย; ถ้าไม่ ก็ประกอบจาก templateData
    const htmlBody = (htmlFromClient && htmlFromClient.trim())
      ? htmlFromClient
      : renderEmail({
          // ตั้งค่าเริ่มต้น + ผสมค่าไดนามิกที่ client ส่งมา
          title: templateData?.title ?? 'สวัสดีจาก Lily ❤️',
          greeting: templateData?.greeting ?? 'สวัสดีค่ะ',
          messageHtml: templateData?.messageHtml ?? 'นี่คือข้อความในอีเมลนะคะ',
          ctaText: templateData?.ctaText ?? 'ดูรายละเอียด',
          ctaLink: templateData?.ctaLink ?? 'https://youtube.com/',
          footer: templateData?.footer ?? '© 2025 Lily Project. All rights reserved.',
          previewText: templateData?.previewText ?? 'ข้อความตัวอย่างสั้น ๆ สำหรับ preview',
          brandName: templateData?.brandName ?? 'Lily',
          logoUrl: templateData?.logoUrl,
          accentFrom: templateData?.accentFrom ?? '#ef4444',
          accentTo: templateData?.accentTo ?? '#b91c1c',
        })

    console.log('>>> sending to:', to, 'subject:', subject)

    const { data, error } = await resend.emails.send({
      from: 'Lily <onboarding@resend.dev>',
      to,
      subject,
      html: htmlBody,
      // ถ้าต้องการ text fallback ใส่เพิ่มได้: text: 'ข้อความสั้นๆ',
      reply_to: 'saraythxngraks25@gmail.com',
    })

    if (error) {
      return res.status(502).json({ ok: false, error: error.message || String(error) })
    }
    return res.json({ ok: true, id: data?.id })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, error: err.message })
  }
})

app.listen(3001, () => console.log('Email API running on http://localhost:3001'))
