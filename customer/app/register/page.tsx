'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'

export default function RegisterPage() {
  const [status, setStatus] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('')
    setSuccess(false)
    setSubmitting(true)
    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password'),
      }),
    })

    const data = (await response.json().catch(() => ({}))) as { message?: string }
    setSubmitting(false)

    if (response.ok) {
      setSuccess(true)
      setStatus('Check your email to activate your account.')
      return
    }

    setStatus(data.message || 'Registration failed.')
  }

  return (
    <AuthShell
      eyebrow="Join MOVE"
      title="Register"
      subtitle="One account, every trip. We only ask for what we need."
      footer={
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.14em] text-ink/60">
          Already on MOVE?{' '}
          <Link href="/login" className="border-b border-lime pb-0.5 text-ink hover:text-lime">
            Login
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-5">
        <label className="field">
          <span className="field-label">Full name</span>
          <input className="field-control" name="fullName" required autoComplete="name" />
        </label>
        <label className="field">
          <span className="field-label">Email</span>
          <input className="field-control" name="email" type="email" required autoComplete="email" />
        </label>
        <label className="field">
          <span className="field-label">Phone</span>
          <input className="field-control" name="phone" autoComplete="tel" />
        </label>
        <label className="field">
          <span className="field-label">Password</span>
          <input
            className="field-control"
            name="password"
            type="password"
            minLength={6}
            required
            autoComplete="new-password"
          />
        </label>

        {status ? (
          <p
            className={`border-l-4 p-3 font-mono text-[11px] uppercase tracking-[0.14em] ${
              success
                ? 'border-lime bg-lime/15 text-ink'
                : 'border-red-600 bg-red-50 text-red-700'
            }`}
          >
            {success ? '✓ ' : '! '}
            {status}
          </p>
        ) : null}

        <button className="btn-lime mt-2 h-12 shadow-[4px_4px_0_0_#0E1A14]" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Register'}
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </button>
      </form>
    </AuthShell>
  )
}
