'use client'

import { FormEvent, Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: String(formData.get('email') || '').trim(),
        password: formData.get('password'),
      }),
    })

    const data = (await response.json().catch(() => ({}))) as { message?: string }

    if (!response.ok) {
      setSubmitting(false)
      setError(data.message || 'Login failed. Check your email and password.')
      return
    }

    const next = searchParams.get('next')
    router.push(next && next.startsWith('/') ? next : '/account')
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Login"
      subtitle="Pick up where you left off — your bookings, license, and trip history."
      footer={
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.14em] text-ink/60">
          No account?{' '}
          <Link href="/register" className="border-b border-lime pb-0.5 text-ink hover:text-lime">
            Register
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-5">
        <label className="field">
          <span className="field-label">Email</span>
          <input className="field-control" name="email" type="email" required autoComplete="email" />
        </label>
        <label className="field">
          <span className="field-label">Password</span>
          <input
            className="field-control"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </label>

        {error ? (
          <p className="border-l-4 border-red-600 bg-red-50 p-3 font-mono text-[11px] uppercase tracking-[0.14em] text-red-700">
            ! {error}
          </p>
        ) : null}

        <button className="btn-lime mt-2 h-12 shadow-[4px_4px_0_0_#0E1A14]" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Login'}
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </button>

        <Link
          href="/forgot-password"
          className="text-center font-mono text-xs uppercase tracking-[0.14em] text-ink/60 hover:text-ink"
        >
          Forgot password?
        </Link>
      </form>
    </AuthShell>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-bone" />}>
      <LoginForm />
    </Suspense>
  )
}
