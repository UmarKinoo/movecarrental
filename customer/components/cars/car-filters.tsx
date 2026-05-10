'use client'

import type { ReactNode } from 'react'
import { useCallback, useMemo, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, Loader2, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import {
  ALL_CAR_TYPES,
  ALL_FUEL_POLICY,
  ALL_GEARBOX,
  ALL_MILEAGE,
  ALL_MULTIMEDIA,
  ALL_RANGES,
} from '@/lib/utils/filter-defaults'

const CAR_TYPE_LABELS: Record<(typeof ALL_CAR_TYPES)[number], string> = {
  diesel: 'Diesel',
  gasoline: 'Gasoline',
  electric: 'Electric',
  hybrid: 'Hybrid',
  plugInHybrid: 'Plug-in hybrid',
  unknown: 'Other',
}

const GEARBOX_LABELS: Record<(typeof ALL_GEARBOX)[number], string> = {
  automatic: 'Automatic',
  manual: 'Manual',
}

const MILEAGE_LABELS: Record<(typeof ALL_MILEAGE)[number], string> = {
  limited: 'Limited km',
  unlimited: 'Unlimited',
}

const FUEL_POLICY_LABELS: Record<(typeof ALL_FUEL_POLICY)[number], string> = {
  likeForlike: 'Like for like',
  freeTank: 'Free tank',
  fullToFull: 'Full to full',
  FullToEmpty: 'Full to empty',
}

const RANGE_LABELS: Record<(typeof ALL_RANGES)[number], string> = {
  mini: 'Mini',
  midi: 'Compact',
  maxi: 'Large',
  scooter: 'Scooter',
  bus: 'Bus',
  truck: 'Truck',
  caravan: 'Caravan',
}

const MULTIMEDIA_LABELS: Record<(typeof ALL_MULTIMEDIA)[number], string> = {
  touchscreen: 'Touchscreen',
  bluetooth: 'Bluetooth',
  androidAuto: 'Android Auto',
  appleCarPlay: 'Apple CarPlay',
}

function parseList(raw: string | null) {
  if (!raw) {
    return undefined
  }
  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean)
  return parts.length ? parts : undefined
}

function isFullSelection<T extends string>(selected: T[] | undefined, all: readonly T[]) {
  const set = selected ?? [...all]
  return set.length === all.length
}

function countActiveFilters(current: {
  carType: string[] | undefined
  gearbox: string[] | undefined
  mileage: string[] | undefined
  fuelPolicy: string[] | undefined
  ranges: string[] | undefined
  multimedia: string[] | undefined
  aircon: boolean
  moreThanFourDoors: boolean
  moreThanFiveSeats: boolean
  deposit: number
  rating: number
  seats: number
}) {
  let n = 0
  if (!isFullSelection(current.carType as (typeof ALL_CAR_TYPES)[number][] | undefined, ALL_CAR_TYPES)) {
    n += 1
  }
  if (!isFullSelection(current.gearbox as (typeof ALL_GEARBOX)[number][] | undefined, ALL_GEARBOX)) {
    n += 1
  }
  if (!isFullSelection(current.mileage as (typeof ALL_MILEAGE)[number][] | undefined, ALL_MILEAGE)) {
    n += 1
  }
  if (!isFullSelection(current.fuelPolicy as (typeof ALL_FUEL_POLICY)[number][] | undefined, ALL_FUEL_POLICY)) {
    n += 1
  }
  if (!isFullSelection(current.ranges as (typeof ALL_RANGES)[number][] | undefined, ALL_RANGES)) {
    n += 1
  }
  n += current.multimedia?.length ?? 0
  if (current.aircon) {
    n += 1
  }
  if (current.moreThanFourDoors) {
    n += 1
  }
  if (current.moreThanFiveSeats) {
    n += 1
  }
  if (current.rating !== -1) {
    n += 1
  }
  if (current.seats !== -1) {
    n += 1
  }
  if (current.deposit !== -1) {
    n += 1
  }
  return n
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-sm border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime',
        active
          ? 'border-ink bg-ink text-lime'
          : 'border-ink/15 bg-white text-ink/70 hover:border-ink hover:text-ink',
      )}
    >
      {label}
    </button>
  )
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink/55">{title}</p>
      {children}
    </div>
  )
}

export function CarFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const current = useMemo(() => {
    return {
      carType: parseList(searchParams.get('carType')),
      gearbox: parseList(searchParams.get('gearbox')),
      mileage: parseList(searchParams.get('mileage')),
      fuelPolicy: parseList(searchParams.get('fuelPolicy')),
      ranges: parseList(searchParams.get('ranges')),
      multimedia: parseList(searchParams.get('multimedia')),
      aircon: searchParams.get('aircon') === 'true',
      moreThanFourDoors: searchParams.get('moreThanFourDoors') === 'true',
      moreThanFiveSeats: searchParams.get('moreThanFiveSeats') === 'true',
      deposit: searchParams.get('deposit') ? Number(searchParams.get('deposit')) : -1,
      rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : -1,
      seats: searchParams.get('seats') ? Number(searchParams.get('seats')) : -1,
    }
  }, [searchParams])

  const activeCount = useMemo(() => countActiveFilters(current), [current])

  const updateParams = useCallback(
    (mutator: (p: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams.toString())
      mutator(next)
      next.delete('page')
      startTransition(() => {
        router.push(`${pathname}?${next.toString()}`)
      })
    },
    [pathname, router, searchParams],
  )

  const toggleList = (key: string, value: string, allValues: readonly string[]) => {
    updateParams((p) => {
      const raw = p.get(key)
      const set = new Set(raw ? raw.split(',').filter(Boolean) : [...allValues])
      if (set.has(value)) {
        set.delete(value)
      } else {
        set.add(value)
      }
      if (set.size === 0 || set.size === allValues.length) {
        p.delete(key)
      } else {
        p.set(key, [...set].join(','))
      }
    })
  }

  const toggleBool = (key: string, checked: boolean) => {
    updateParams((p) => {
      if (checked) {
        p.set(key, 'true')
      } else {
        p.delete(key)
      }
    })
  }

  const setNumberParam = (key: string, value: number, empty: number) => {
    updateParams((p) => {
      if (value === empty) {
        p.delete(key)
      } else {
        p.set(key, String(value))
      }
    })
  }

  const reset = () => {
    const keep = ['pickupLocation', 'dropOffLocation', 'from', 'to']
    updateParams((p) => {
      for (const key of [...p.keys()]) {
        if (!keep.includes(key)) {
          p.delete(key)
        }
      }
    })
  }

  const panelId = 'car-filters-panel'

  return (
    <aside
      className={cn('relative mb-6 border border-ink/15 bg-white', pending && 'opacity-[0.98]')}
      aria-label="Filter rental cars"
      aria-busy={pending}
    >
      {pending ? (
        <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-ink/10" aria-hidden>
          <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-lime to-transparent animate-filter-bar" />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 border-b border-ink/10 px-3 py-2.5 sm:px-4">
        <button
          type="button"
          id="car-filters-trigger"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex min-h-10 flex-1 items-center gap-2 rounded-sm px-2 py-1.5 text-left font-display text-[13px] font-bold uppercase tracking-[0.08em] text-ink transition hover:bg-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime sm:flex-none"
        >
          <SlidersHorizontal className="h-4 w-4 shrink-0" aria-hidden />
          <span className="min-w-0">Filters</span>
          {activeCount > 0 ? (
            <span className="rounded-sm bg-lime px-2 py-0.5 font-mono text-[10px] font-bold tabular-nums text-ink">
              {activeCount}
            </span>
          ) : null}
          <ChevronDown
            className={cn('ml-auto h-4 w-4 shrink-0 text-ink/60 transition sm:ml-1', open && 'rotate-180')}
            aria-hidden
          />
        </button>

        {pending ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/60">
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
            Updating
          </span>
        ) : null}

        <button
          type="button"
          onClick={reset}
          disabled={activeCount === 0}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em]',
            activeCount === 0
              ? 'cursor-not-allowed text-ink/30'
              : 'text-ink/70 hover:bg-ink hover:text-lime',
          )}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Reset
        </button>
      </div>

      {open ? (
        <div id={panelId} role="region" aria-labelledby="car-filters-trigger" className="px-3 pb-3 pt-2 sm:px-4">
          <div className="grid max-h-[min(70vh,32rem)] gap-x-6 gap-y-4 overflow-y-auto overscroll-contain md:grid-cols-2 lg:grid-cols-3">
            <Group title="Fuel / powertrain">
              <div className="flex flex-wrap gap-1.5">
                {ALL_CAR_TYPES.map((t) => (
                  <FilterChip
                    key={t}
                    label={CAR_TYPE_LABELS[t]}
                    active={(current.carType ?? [...ALL_CAR_TYPES]).includes(t)}
                    onClick={() => toggleList('carType', t, ALL_CAR_TYPES)}
                  />
                ))}
              </div>
            </Group>

            <Group title="Gearbox">
              <div className="flex flex-wrap gap-1.5">
                {ALL_GEARBOX.map((t) => (
                  <FilterChip
                    key={t}
                    label={GEARBOX_LABELS[t]}
                    active={(current.gearbox ?? [...ALL_GEARBOX]).includes(t)}
                    onClick={() => toggleList('gearbox', t, ALL_GEARBOX)}
                  />
                ))}
              </div>
            </Group>

            <Group title="Mileage">
              <div className="flex flex-wrap gap-1.5">
                {ALL_MILEAGE.map((t) => (
                  <FilterChip
                    key={t}
                    label={MILEAGE_LABELS[t]}
                    active={(current.mileage ?? [...ALL_MILEAGE]).includes(t)}
                    onClick={() => toggleList('mileage', t, ALL_MILEAGE)}
                  />
                ))}
              </div>
            </Group>

            <Group title="Fuel policy">
              <div className="flex flex-wrap gap-1.5">
                {ALL_FUEL_POLICY.map((t) => (
                  <FilterChip
                    key={t}
                    label={FUEL_POLICY_LABELS[t]}
                    active={(current.fuelPolicy ?? [...ALL_FUEL_POLICY]).includes(t)}
                    onClick={() => toggleList('fuelPolicy', t, ALL_FUEL_POLICY)}
                  />
                ))}
              </div>
            </Group>

            <Group title="Size">
              <div className="flex flex-wrap gap-1.5">
                {ALL_RANGES.map((t) => (
                  <FilterChip
                    key={t}
                    label={RANGE_LABELS[t]}
                    active={(current.ranges ?? [...ALL_RANGES]).includes(t)}
                    onClick={() => toggleList('ranges', t, ALL_RANGES)}
                  />
                ))}
              </div>
            </Group>

            <Group title="Multimedia">
              <div className="flex flex-wrap gap-1.5">
                {ALL_MULTIMEDIA.map((t) => (
                  <FilterChip
                    key={t}
                    label={MULTIMEDIA_LABELS[t]}
                    active={(current.multimedia ?? []).includes(t)}
                    onClick={() => {
                      updateParams((p) => {
                        const raw = p.get('multimedia')
                        const set = new Set(raw ? raw.split(',').filter(Boolean) : [])
                        if (set.has(t)) {
                          set.delete(t)
                        } else {
                          set.add(t)
                        }
                        if (set.size === 0) {
                          p.delete('multimedia')
                        } else {
                          p.set('multimedia', [...set].join(','))
                        }
                      })
                    }}
                  />
                ))}
              </div>
            </Group>

            <div className="md:col-span-2 lg:col-span-3">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Vehicle specs</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-800">
                  <input
                    type="checkbox"
                    checked={current.aircon}
                    onChange={(e) => toggleBool('aircon', e.target.checked)}
                    className="h-3.5 w-3.5 accent-lime"
                  />
                  A/C
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-800">
                  <input
                    type="checkbox"
                    checked={current.moreThanFourDoors}
                    onChange={(e) => toggleBool('moreThanFourDoors', e.target.checked)}
                    className="h-3.5 w-3.5 accent-lime"
                  />
                  4+ doors
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-800">
                  <input
                    type="checkbox"
                    checked={current.moreThanFiveSeats}
                    onChange={(e) => toggleBool('moreThanFiveSeats', e.target.checked)}
                    className="h-3.5 w-3.5 accent-lime"
                  />
                  5+ seats
                </label>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 md:col-span-2 lg:col-span-3">
              <label className="field">
                <span className="field-label">Min. rating</span>
                <select
                  className="field-control !h-10"
                  value={current.rating === -1 ? '' : String(current.rating)}
                  onChange={(e) => setNumberParam('rating', e.target.value ? Number(e.target.value) : -1, -1)}
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}+
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span className="field-label">Min. seats</span>
                <select
                  className="field-control !h-10"
                  value={current.seats === -1 ? '' : String(current.seats)}
                  onChange={(e) => setNumberParam('seats', e.target.value ? Number(e.target.value) : -1, -1)}
                >
                  <option value="">Any</option>
                  {[2, 4, 5, 7, 9].map((n) => (
                    <option key={n} value={n}>
                      {n}+
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span className="field-label">Deposit</span>
                <select
                  className="field-control !h-10"
                  value={current.deposit === -1 ? '' : String(current.deposit)}
                  onChange={(e) => setNumberParam('deposit', e.target.value ? Number(e.target.value) : -1, -1)}
                >
                  <option value="">Any</option>
                  <option value="250">≤ 250</option>
                  <option value="500">≤ 500</option>
                  <option value="750">≤ 750</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  )
}
