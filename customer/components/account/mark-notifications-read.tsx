'use client'

import { useState } from 'react'

export function MarkNotificationsRead({ userId }: { userId: string }) {
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const onClick = async () => {
    setLoading(true)
    try {
      await fetch('/api/account/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/70">
        ✓ Marked as read
      </p>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="border-b border-lime pb-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink transition hover:gap-3 hover:text-lime disabled:opacity-50"
    >
      {loading ? 'Updating…' : '↗ Mark all as read'}
    </button>
  )
}
