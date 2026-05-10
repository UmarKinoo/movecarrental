'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [status, setStatus] = useState('')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('')
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

    setStatus(response.ok ? 'Check your email to activate your account.' : 'Registration failed.')
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <form onSubmit={onSubmit} className="grid gap-5 rounded-lg border border-neutral-200 bg-white p-6 shadow-soft">
        <div>
          <p className="text-sm font-semibold uppercase text-brand-600">Create account</p>
          <h1 className="mt-2 text-3xl font-semibold">Register</h1>
        </div>
        <label className="field">
          <span className="field-label">Full name</span>
          <input className="field-control" name="fullName" required />
        </label>
        <label className="field">
          <span className="field-label">Email</span>
          <input className="field-control" name="email" type="email" required />
        </label>
        <label className="field">
          <span className="field-label">Phone</span>
          <input className="field-control" name="phone" />
        </label>
        <label className="field">
          <span className="field-label">Password</span>
          <input className="field-control" name="password" type="password" minLength={6} required />
        </label>
        <button className="h-12 rounded-md bg-ink text-sm font-semibold text-white">Register</button>
        {status && <p className="text-sm text-neutral-700">{status}</p>}
        <p className="text-center text-sm text-neutral-600">
          Already registered? <Link href="/login" className="font-semibold text-brand-700">Login</Link>
        </p>
      </form>
    </div>
  )
}
