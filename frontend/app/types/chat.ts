// types/chat.ts
export type Role = 'bot' | 'user'
export type MsgKind = 'greeting' | undefined

export interface Msg {
  type: Role
  text: string
  ts: number
  kind?: MsgKind
}

// ตัวแปลง raw -> Msg ที่ถูกต้อง
export function toMsg(raw: any): Msg {
  const role: Role = raw?.type === 'user' || raw?.type === 'bot' ? raw.type : 'bot'
  const text = typeof raw?.text === 'string' ? raw.text : String(raw?.text ?? '')
  const ts = typeof raw?.ts === 'number' ? raw.ts : Date.now()
  const kind: MsgKind = raw?.kind === 'greeting' ? 'greeting' : undefined
  return { type: role, text, ts, kind }
}
