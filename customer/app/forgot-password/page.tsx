'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') || '')

    try {
      const response = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!response.ok) {
        setError('Could not send reset email.')
        return
      }
      setSent(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Recover access"
      title="Forgot password"
      subtitle="We will email a reset link if the address exists in our system."
      footer={
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.14em] text-ink/60">
          Remembered it?{' '}
          <Link href="/login" className="border-b border-lime pb-0.5 text-ink hover:text-lime">
            Back to login
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-5">
        <label className="field">
          <span className="field-label">Email</span>
          <input className="field-control" name="email" type="email" required autoComplete="email" />
        </label>

        {sent ? (
          <p className="border-l-4 border-lime bg-lime/15 p-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
            ✓ If an account exists, check your inbox.
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
          {submitting ? 'Sending…' : 'Send reset link'}
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </button>
      </form>
    </AuthShell>
  )
}
