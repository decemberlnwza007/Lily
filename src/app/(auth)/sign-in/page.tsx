'use client'

import { signInWithGoogle } from '../../action/auth'

export default function Page() {
  async function handleSignIn() {
    const { url } = await signInWithGoogle('/dashboard')
    if (url) {
      window.location.href = url
    }
  }

  return (
    <div>
      <button
        onClick={handleSignIn}
        className="btn bg-slate-900 text-white font-bold m-5 p-5"
      >
        Sign in With Google
      </button>
    </div>
  )
}
