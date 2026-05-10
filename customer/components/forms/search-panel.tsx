'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CalendarClock, MapPin } from 'lucide-react'
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

type Variant = 'light' | 'dark'

export function SearchPanel({ variant = 'light' }: { variant?: Variant } = {}) {
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

  const isDark = variant === 'dark'

  return (
    <form
      onSubmit={onSubmit}
      className={[
        'relative grid gap-3 border p-4 md:grid-cols-[1fr_1fr_1fr_auto] md:gap-4 md:p-5',
        isDark
          ? 'border-white/10 bg-white/[0.04] text-white shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur'
          : 'border-ink bg-white shadow-[6px_6px_0_0_#0E1A14]',
      ].join(' ')}
    >
      <label className="field">
        <span
          className={[
            'field-label flex items-center gap-1.5',
            isDark ? 'text-white/70' : '',
          ].join(' ')}
        >
          <MapPin size={12} strokeWidth={2.5} />
          Pickup
        </span>
        <select
          className={[
            'field-control',
            isDark
              ? 'border-white/20 bg-white/[0.06] text-white focus:border-lime focus:ring-lime/40'
              : '',
          ].join(' ')}
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
            <option key={location._id} value={location._id} className="text-ink">
              {location.name || location._id}
            </option>
          ))}
          {!locations.length && <option value="">No locations loaded</option>}
        </select>
      </label>

      <label className="field">
        <span
          className={[
            'field-label flex items-center gap-1.5',
            isDark ? 'text-white/70' : '',
          ].join(' ')}
        >
          <CalendarClock size={12} strokeWidth={2.5} />
          Pickup
        </span>
        <input
          className={[
            'field-control',
            isDark
              ? 'border-white/20 bg-white/[0.06] text-white focus:border-lime focus:ring-lime/40 [color-scheme:dark]'
              : '',
          ].join(' ')}
          type="datetime-local"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
        />
      </label>

      <label className="field">
        <span
          className={[
            'field-label',
            isDark ? 'text-white/70' : '',
          ].join(' ')}
        >
          Drop-off
        </span>
        <input
          className={[
            'field-control',
            isDark
              ? 'border-white/20 bg-white/[0.06] text-white focus:border-lime focus:ring-lime/40 [color-scheme:dark]'
              : '',
          ].join(' ')}
          type="datetime-local"
          value={to}
          onChange={(event) => setTo(event.target.value)}
        />
      </label>

      <button
        className="btn-lime mt-0 h-12 w-full md:mt-[26px] md:w-auto md:px-6"
        type="submit"
        disabled={loadingLocations || !pickupLocation}
      >
        Search
        <ArrowRight size={16} strokeWidth={2.5} />
      </button>

      {locationError && (
        <p
          className={[
            'font-mono text-xs uppercase tracking-[0.14em] md:col-span-4',
            isDark ? 'text-red-300' : 'text-red-700',
          ].join(' ')}
        >
          ! {locationError}
        </p>
      )}

      <label
        className={[
          'flex items-center gap-2 text-xs md:col-span-4',
          isDark ? 'text-white/70' : 'text-ink/70',
        ].join(' ')}
      >
        <input
          type="checkbox"
          className="h-4 w-4 accent-lime"
          checked={sameLocation}
          onChange={(event) => setSameLocation(event.target.checked)}
        />
        <span className="font-mono uppercase tracking-[0.14em]">
          Return to the same location
        </span>
      </label>

      {!sameLocation && (
        <label className="field md:col-span-4">
          <span
            className={[
              'field-label',
              isDark ? 'text-white/70' : '',
            ].join(' ')}
          >
            Drop-off location
          </span>
          <select
            className={[
              'field-control',
              isDark
                ? 'border-white/20 bg-white/[0.06] text-white focus:border-lime focus:ring-lime/40'
                : '',
            ].join(' ')}
            value={dropOffLocation}
            onChange={(event) => setDropOffLocation(event.target.value)}
          >
            {locations.map((location) => (
              <option key={location._id} value={location._id} className="text-ink">
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
