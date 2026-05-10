'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarClock, MapPin, Search } from 'lucide-react'
import type { Location } from '@/lib/types/bookcars'

type LocationsResponse = {
  items?: Location[]
  error?: string
}

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

async function readLocationsResponse(response: Response): Promise<LocationsResponse> {
  const body = await response.text()

  if (!body) {
    return {
      items: [],
      error: response.ok ? undefined : 'Locations are temporarily unavailable.',
    }
  }

  try {
    return JSON.parse(body) as LocationsResponse
  } catch {
    return {
      items: [],
      error: 'Locations are temporarily unavailable.',
    }
  }
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
  const [locationError, setLocationError] = useState('')

  useEffect(() => {
    let active = true

    const loadLocations = async () => {
      try {
        const response = await fetch('/api/locations', { cache: 'no-store' })
        const data = await readLocationsResponse(response)
        const items = data.items || []
        const firstLocation = items[0]?._id || ''

        if (!active) {
          return
        }

        setLocations(items)
        setPickupLocation(firstLocation)
        setDropOffLocation(firstLocation)
        setLocationError(response.ok ? '' : data.error || 'Locations are temporarily unavailable.')
      } catch {
        if (!active) {
          return
        }

        setLocations([])
        setPickupLocation('')
        setDropOffLocation('')
        setLocationError('Locations are temporarily unavailable.')
      } finally {
        if (active) {
          setLoadingLocations(false)
        }
      }
    }

    loadLocations()

    return () => {
      active = false
    }
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
          {!locations.length && <option value="">No locations loaded</option>}
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

      <button
        className="mt-0 flex h-12 items-center justify-center gap-2 rounded-md bg-ink px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 md:mt-6"
        type="submit"
        disabled={loadingLocations || !pickupLocation}
      >
        <Search size={18} />
        Search
      </button>

      {locationError && <p className="text-sm text-red-700 md:col-span-4">{locationError}</p>}

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
            {!locations.length && <option value="">No locations loaded</option>}
          </select>
        </label>
      )}
    </form>
  )
}
