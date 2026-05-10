'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onCancel = async () => {
    if (!window.confirm('Cancel this booking?')) {
      return
    }
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.message || 'Could not cancel.')
        return
      }
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="btn-danger h-11 px-5 text-[12px] disabled:opacity-50"
      >
        {loading ? 'Cancelling…' : 'Request cancellation'}
      </button>
      {error ? (
        <p className="mt-3 border-l-4 border-red-600 bg-red-50 p-3 font-mono text-[11px] uppercase tracking-[0.14em] text-red-700">
          ! {error}
        </p>
      ) : null}
    </div>
  )
}
