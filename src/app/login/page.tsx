'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

export default function AuthButton() {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="animate-pulse text-gray-500 text-lg">Loading...</p>
      </div>
    )
  }

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-purple-600 via-pink-500 to-red-400 p-8 rounded-lg shadow-xl mx-4 max-w-sm text-white">
        <p className="text-2xl font-bold mb-2">
          Welcome, {session.user?.name}!
        </p>
        <p className="mb-6 opacity-90">{session.user?.email}</p>
        <button
          onClick={() => signOut()}
          className="bg-white text-purple-700 font-semibold px-8 py-3 rounded-full hover:bg-purple-100 transition"
        >
          Sign Out
        </button>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ตัวอย่าง call signIn ด้วย credentials
    signIn('credentials', { email, password })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center bg-white p-10 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
          Sign in to Your Account
        </h2>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-6 w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          type="submit"
          className="bg-purple-700 text-white font-semibold px-6 py-3 rounded-full hover:bg-purple-800 transition w-full mb-4"
        >
          Sign in with Email
        </button>

        <div className="text-center mb-2 text-gray-400">or</div>

        <button
          type="button"
          onClick={() => signIn('google')}
          className="flex items-center justify-center gap-3 bg-blue-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-700 transition w-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 48 48"
            fill="none"
          >
            <path
              d="M44.5 20H24v8.5h11.8C34.7 32 30.6 36 24 36c-7.3 0-13.3-6-13.3-13.3S16.7 9.3 24 9.3c3.7 0 6.7 1.6 8.8 4.1l6.2-6.2C34 4.7 29.4 3 24 3 12 3 3 12 3 24s9 21 21 21c11.5 0 20.9-8.2 20.9-19.7 0-1.3-.1-2.6-.4-3.8z"
              fill="#4285F4"
            />
          </svg>
          Sign in with Google
        </button>
      </form>
    </div>
  )
}
