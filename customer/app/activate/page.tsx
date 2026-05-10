'use client'

import Link from 'next/link'
import { FormEvent, Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'

function ActivateForm() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('u') || ''
  const email = searchParams.get('e') || ''
  const token = searchParams.get('t') || ''

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setError('')
    setSubmitting(true)
    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('password') || '')

    if (!userId || !token) {
      setError('Invalid or expired link.')
      setSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/auth/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token, password }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.message || 'Activation failed.')
        return
      }
      setMessage('Account activated. You can sign in.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!userId || !token) {
    return (
      <AuthShell
        eyebrow="Invalid link"
        title="Link expired"
        subtitle="This activation link is invalid or has expired. Request a new email from registration or password reset."
      >
        <Link href="/login" className="btn-lime w-full">
          Go to login
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      eyebrow="Set your password"
      title="Activate"
      subtitle={email ? `Setting up access for ${email}.` : 'Choose a password for your account.'}
      footer={
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.14em] text-ink/60">
          Already active?{' '}
          <Link href="/login" className="border-b border-lime pb-0.5 text-ink hover:text-lime">
            Login
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-5">
        <label className="field">
          <span className="field-label">Choose password</span>
          <input
            className="field-control"
            name="password"
            type="password"
            required
            autoComplete="new-password"
          />
        </label>

        {message ? (
          <p className="border-l-4 border-lime bg-lime/15 p-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
            ✓ {message}
          </p>
        ) : null}
        {error ? (
          <p className="border-l-4 border-red-600 bg-red-50 p-3 font-mono text-[11px] uppercase tracking-[0.14em] text-red-700">
            ! {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="btn-lime mt-2 h-12 shadow-[4px_4px_0_0_#0E1A14]"
        >
          {submitting ? 'Saving…' : 'Activate'}
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </button>
      </form>
    </AuthShell>
  )
}

export default function ActivatePage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-bone" />}>
      <ActivateForm />
    </Suspense>
  )
}
