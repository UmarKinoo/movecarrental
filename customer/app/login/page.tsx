'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      }),
    })

    if (!response.ok) {
      setError('Login failed. Check your email and password.')
      return
    }

    router.push('/account')
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <form onSubmit={onSubmit} className="grid gap-5 rounded-lg border border-neutral-200 bg-white p-6 shadow-soft">
        <div>
          <p className="text-sm font-semibold uppercase text-brand-600">Welcome back</p>
          <h1 className="mt-2 text-3xl font-semibold">Login</h1>
        </div>
        <label className="field">
          <span className="field-label">Email</span>
          <input className="field-control" name="email" type="email" required />
        </label>
        <label className="field">
          <span className="field-label">Password</span>
          <input className="field-control" name="password" type="password" required />
        </label>
        <button className="h-12 rounded-md bg-ink text-sm font-semibold text-white">Login</button>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <p className="text-center text-sm text-neutral-600">
          No account? <Link href="/register" className="font-semibold text-brand-700">Register</Link>
        </p>
      </form>
    </div>
  )
}
