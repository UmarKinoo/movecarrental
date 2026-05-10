'use client'

import { FormEvent, useState } from 'react'

type SettingsFormProps = {
  userId: string
  initialFullName: string
  initialPhone: string
  initialBio: string
  initialLocation: string
  initialBirthDate: string
  initialEmailNotifications: boolean
}

export function SettingsForm({
  userId: _userId,
  initialFullName,
  initialPhone,
  initialBio,
  initialLocation,
  initialBirthDate,
  initialEmailNotifications,
}: SettingsFormProps) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setError('')
    setSubmitting(true)
    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch('/api/account/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: String(formData.get('fullName') || ''),
          phone: String(formData.get('phone') || ''),
          bio: String(formData.get('bio') || ''),
          location: String(formData.get('location') || ''),
          birthDate: String(formData.get('birthDate') || '') || undefined,
          enableEmailNotifications: formData.get('enableEmailNotifications') === 'on',
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.message || 'Could not save.')
        return
      }
      setMessage('Profile updated.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-xl gap-4">
      <label className="field">
        <span className="field-label">Full name</span>
        <input className="field-control" name="fullName" required defaultValue={initialFullName} />
      </label>
      <label className="field">
        <span className="field-label">Phone</span>
        <input className="field-control" name="phone" defaultValue={initialPhone} />
      </label>
      <label className="field">
        <span className="field-label">Bio</span>
        <textarea className="field-area" name="bio" rows={3} defaultValue={initialBio} />
      </label>
      <label className="field">
        <span className="field-label">Location</span>
        <input className="field-control" name="location" defaultValue={initialLocation} />
      </label>
      <label className="field">
        <span className="field-label">Birth date</span>
        <input className="field-control" name="birthDate" type="date" defaultValue={initialBirthDate} />
      </label>
      <label className="flex items-center gap-2 text-sm text-ink/80">
        <input
          type="checkbox"
          name="enableEmailNotifications"
          defaultChecked={initialEmailNotifications}
          className="h-4 w-4 accent-lime"
        />
        <span className="font-mono text-xs uppercase tracking-[0.14em]">Email notifications</span>
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="btn-lime mt-2 h-12 shadow-[4px_4px_0_0_#0E1A14] disabled:shadow-none"
      >
        {submitting ? 'Saving…' : 'Save changes'}
      </button>
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
    </form>
  )
}
