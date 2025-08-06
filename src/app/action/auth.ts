// action/auth.ts
'use server'

import { createClient } from '../utils/supabase/client'

export async function signInWithGoogle(redirectTo: string) {
  const supabase = await createClient()
  const redirectURL = `http://localhost:3000/auth/callback?next=${redirectTo}`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectURL,
    },
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
