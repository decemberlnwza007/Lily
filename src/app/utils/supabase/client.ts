// utils/supabase/client.ts (RENAME this to server.ts หรือแยกเป็นสองไฟล์)

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set() {
          // Server Actions can't set cookies directly, so leave empty or log
        },
        remove() {
          // Same here
        },
      },
    }
  )
}
