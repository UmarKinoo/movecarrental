'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarClock, MapPin, Search } from 'lucide-react'
import type { Location } from '@/lib/types/bookcars'

function toDateTimeLocal(date: Date) {
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 16)
}

function defaultDates() {
  const from = new Date()
  from.setDate(from.getDate() + 3)
  from.setHours(10, 0, 0, 0)

  const to = new Date(from)
  to.setDate(to.getDate() + 3)

  return { from: toDateTimeLocal(from), to: toDateTimeLocal(to) }
}

export function SearchPanel() {
  const router = useRouter()
  const initialDates = useMemo(defaultDates, [])
  const [locations, setLocations] = useState<Location[]>([])
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropOffLocation, setDropOffLocation] = useState('')
  const [sameLocation, setSameLocation] = useState(true)
  const [from, setFrom] = useState(initialDates.from)
  const [to, setTo] = useState(initialDates.to)
  const [loadingLocations, setLoadingLocations] = useState(true)

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response = await fetch('/api/locations', { cache: 'no-store' })
        const data = await response.json()
        setLocations(data.items || [])
        const firstLocation = data.items?.[0]?._id || ''
        setPickupLocation(firstLocation)
        setDropOffLocation(firstLocation)
      } finally {
        setLoadingLocations(false)
      }
    }

    loadLocations()
  }, [])

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!pickupLocation || !from || !to) {
      return
    }

    const params = new URLSearchParams({
      pickupLocation,
      dropOffLocation: sameLocation ? pickupLocation : dropOffLocation,
      from: new Date(from).toISOString(),
      to: new Date(to).toISOString(),
    })

    router.push(`/cars?${params.toString()}`)
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-lg bg-white p-3 shadow-soft md:grid-cols-[1fr_1fr_1fr_auto]">
      <label className="field">
        <span className="field-label">
          <MapPin className="mr-1 inline" size={14} />
          Pickup
        </span>
        <select
          className="field-control"
          value={pickupLocation}
          disabled={loadingLocations}
          onChange={(event) => {
            setPickupLocation(event.target.value)
            if (sameLocation) {
              setDropOffLocation(event.target.value)
            }
          }}
        >
          {locations.map((location) => (
            <option key={location._id} value={location._id}>
              {location.name || location._id}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field-label">
          <CalendarClock className="mr-1 inline" size={14} />
          Pickup date
        </span>
        <input className="field-control" type="datetime-local" value={from} onChange={(event) => setFrom(event.target.value)} />
      </label>

      <label className="field">
        <span className="field-label">Drop-off date</span>
        <input className="field-control" type="datetime-local" value={to} onChange={(event) => setTo(event.target.value)} />
      </label>

      <button className="mt-0 flex h-12 items-center justify-center gap-2 rounded-md bg-ink px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 md:mt-6" type="submit">
        <Search size={18} />
        Search
      </button>

      <label className="flex items-center gap-2 text-sm text-neutral-700 md:col-span-4">
        <input type="checkbox" checked={sameLocation} onChange={(event) => setSameLocation(event.target.checked)} />
        Return to the same location
      </label>

      {!sameLocation && (
        <label className="field md:col-span-2">
          <span className="field-label">Drop-off location</span>
          <select className="field-control" value={dropOffLocation} onChange={(event) => setDropOffLocation(event.target.value)}>
            {locations.map((location) => (
              <option key={location._id} value={location._id}>
                {location.name || location._id}
              </option>
            ))}
          </select>
        </label>
      )}
    </form>
  )
}
