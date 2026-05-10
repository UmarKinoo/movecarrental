'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Car, Location } from '@/lib/types/bookcars'
import { formatMoney } from '@/lib/utils/pricing'

type BookingFormProps = {
  car: Car
  pickupLocation?: Location | null
  dropOffLocation?: Location | null
  from: string
  to: string
  estimatedPrice: number
}

export function BookingForm({ car, pickupLocation, dropOffLocation, from, to, estimatedPrice }: BookingFormProps) {
  const router = useRouter()
  const [paymentOption, setPaymentOption] = useState<'counter' | 'deposit' | 'full'>('counter')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch('/api/bookings/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car._id,
          pickupLocation: pickupLocation?._id,
          dropOffLocation: dropOffLocation?._id || pickupLocation?._id,
          from,
          to,
          paymentOption,
          driver: {
            fullName: String(formData.get('fullName') || ''),
            email: String(formData.get('email') || ''),
            phone: String(formData.get('phone') || ''),
          },
          flightNumber: String(formData.get('flightNumber') || ''),
          accommodation: String(formData.get('accommodation') || ''),
          notes: String(formData.get('notes') || ''),
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        setError(payload.message || 'Booking failed.')
        return
      }

      router.push(`/booking/confirmation?id=${payload.bookingId}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 rounded-lg border border-neutral-200 bg-white p-5 shadow-soft">
      <div>
        <p className="text-sm font-semibold uppercase text-neutral-500">Booking details</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">{car.name}</h1>
        <p className="mt-2 text-sm text-neutral-600">
          {pickupLocation?.name || 'Pickup'} to {dropOffLocation?.name || pickupLocation?.name || 'drop-off'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="field">
          <span className="field-label">Driver name</span>
          <input className="field-control" name="fullName" required />
        </label>
        <label className="field">
          <span className="field-label">Email</span>
          <input className="field-control" type="email" name="email" required />
        </label>
        <label className="field">
          <span className="field-label">Phone / WhatsApp</span>
          <input className="field-control" name="phone" required />
        </label>
        <label className="field">
          <span className="field-label">Flight number</span>
          <input className="field-control" name="flightNumber" placeholder="Optional" />
        </label>
        <label className="field md:col-span-2">
          <span className="field-label">Hotel / accommodation</span>
          <input className="field-control" name="accommodation" placeholder="Optional" />
        </label>
        <label className="field md:col-span-2">
          <span className="field-label">Notes</span>
          <textarea className="field-area" name="notes" placeholder="Optional" />
        </label>
      </div>

      <fieldset className="grid gap-3 rounded-md border border-neutral-200 p-4">
        <legend className="px-1 text-sm font-semibold">Payment option</legend>
        <label className="flex items-start gap-3">
          <input type="radio" checked={paymentOption === 'counter'} onChange={() => setPaymentOption('counter')} />
          <span>
            <span className="block font-medium">Pay at counter</span>
            <span className="text-sm text-neutral-600">Reserve now and pay when you collect the vehicle.</span>
          </span>
        </label>
        <label className="flex items-start gap-3 text-neutral-400">
          <input type="radio" disabled checked={paymentOption === 'deposit'} onChange={() => setPaymentOption('deposit')} />
          <span>
            <span className="block font-medium">Pay deposit</span>
            <span className="text-sm">Stripe/PayPal integration phase.</span>
          </span>
        </label>
        <label className="flex items-start gap-3 text-neutral-400">
          <input type="radio" disabled checked={paymentOption === 'full'} onChange={() => setPaymentOption('full')} />
          <span>
            <span className="block font-medium">Pay in full</span>
            <span className="text-sm">Stripe/PayPal integration phase.</span>
          </span>
        </label>
      </fieldset>

      <div className="flex flex-col gap-4 border-t border-neutral-200 pt-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-neutral-500">Estimated rental price</p>
          <p className="text-2xl font-semibold">{formatMoney(estimatedPrice)}</p>
        </div>
        <button disabled={submitting} className="h-12 rounded-md bg-ink px-6 text-sm font-semibold text-white disabled:opacity-60">
          {submitting ? 'Booking...' : 'Confirm booking'}
        </button>
      </div>

      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    </form>
  )
}
