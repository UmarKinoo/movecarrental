import { Suspense } from 'react'
import Link from 'next/link'
import { SearchPanel } from '@/components/forms/search-panel'
import { CarCard } from '@/components/cars/car-card'
import { CarFilters } from '@/components/cars/car-filters'
import { getLocations, searchCars } from '@/lib/api/bookcars'
import { LocationsMap } from '@/components/map/locations-map'
import type { CarSpecs, Location, SearchCarsInput } from '@/lib/types/bookcars'
import { formatRentalWindow } from '@/lib/utils/car-display'

export const dynamic = 'force-dynamic'

type CarsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

function parseList(raw?: string) {
  if (!raw) {
    return undefined
  }
  const parts = raw.split(',').map((s) => s.trim()).filter(Boolean)
  return parts.length ? parts : undefined
}

function buildSpecs(params: Record<string, string | string[] | undefined>): CarSpecs | undefined {
  const aircon = first(params.aircon) === 'true'
  const moreThanFourDoors = first(params.moreThanFourDoors) === 'true'
  const moreThanFiveSeats = first(params.moreThanFiveSeats) === 'true'
  if (!aircon && !moreThanFourDoors && !moreThanFiveSeats) {
    return undefined
  }
  return { aircon: aircon || undefined, moreThanFourDoors: moreThanFourDoors || undefined, moreThanFiveSeats: moreThanFiveSeats || undefined }
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const params = await searchParams
  const pickupLocation = first(params.pickupLocation)
  const dropOffLocation = first(params.dropOffLocation)
  const from = first(params.from)
  const to = first(params.to)
  const page = Number(first(params.page) || 1)

  const filterInput: SearchCarsInput = {
    pickupLocation: pickupLocation!,
    dropOffLocation: dropOffLocation || undefined,
    from: from!,
    to: to!,
    page,
    size: 12,
    carSpecs: buildSpecs(params),
    carType: parseList(first(params.carType)),
    gearbox: parseList(first(params.gearbox)),
    mileage: parseList(first(params.mileage)),
    fuelPolicy: parseList(first(params.fuelPolicy)),
    ranges: parseList(first(params.ranges)),
    multimedia: parseList(first(params.multimedia)),
    deposit: first(params.deposit) ? Number(first(params.deposit)) : -1,
    rating: first(params.rating) ? Number(first(params.rating)) : -1,
    seats: first(params.seats) ? Number(first(params.seats)) : -1,
  }

  const hasSearch = Boolean(pickupLocation && from && to)
  let data = { items: [], total: 0 } as Awaited<ReturnType<typeof searchCars>>
  let locations: Location[] = []
  let searchError = ''

  if (hasSearch) {
    try {
      const [cars, locationData] = await Promise.all([
        searchCars(filterInput),
        getLocations('', 1, 100),
      ])
      data = cars
      locations = locationData.items
    } catch (error) {
      searchError = error instanceof Error ? error.message : 'Search is temporarily unavailable.'
    }
  }

  const pickup = locations.find((location) => location._id === pickupLocation)
  const dropOff = locations.find((location) => location._id === (dropOffLocation || pickupLocation))

  const passthroughParams = Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => typeof value === 'string')
      .map(([key, value]) => [key, value as string]),
  )

  const totalPages = Math.max(1, Math.ceil(data.total / 12))

  return (
    <div className="bg-white">
      {/* Search bar over a thin ink strip — anchors the page */}
      <section className="border-b border-ink/10 bg-bone">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
          <p className="eyebrow-lime mb-3">Find your car</p>
          <SearchPanel />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        {hasSearch ? (
          <>
            <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="border border-ink/10 bg-white p-5">
                <p className="eyebrow">Trip details</p>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <Detail label="Pickup" value={pickup?.name || 'Selected location'} />
                  <Detail
                    label="Drop-off"
                    value={dropOff?.name || pickup?.name || 'Selected location'}
                  />
                  <Detail
                    label="Dates"
                    value={from && to ? formatRentalWindow(from, to) : 'Selected dates'}
                  />
                </div>
              </div>
              {pickup && typeof pickup.latitude === 'number' && typeof pickup.longitude === 'number' ? (
                <Suspense fallback={<div className="h-44 bg-bone" />}>
                  <LocationsMap locations={[pickup]} heightClassName="h-44" showSearchLinks={false} />
                </Suspense>
              ) : null}
            </div>

            <Suspense fallback={null}>
              <CarFilters />
            </Suspense>
          </>
        ) : null}

        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow-lime">Available cars</p>
            <h1 className="display mt-3 text-5xl text-ink md:text-7xl">
              Choose your ride
            </h1>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/60">
            {hasSearch
              ? `${data.total} result${data.total === 1 ? '' : 's'}`
              : 'Search dates to see availability'}
          </p>
        </div>

        {searchError ? (
          <div className="mb-6 border-l-4 border-red-600 bg-red-50 p-4 font-mono text-xs uppercase tracking-[0.14em] text-red-700">
            ! {searchError}
          </div>
        ) : null}

        {data.items.length > 0 ? (
          <>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {data.items.map((car) => (
                <CarCard key={car._id} car={car} searchParams={passthroughParams} />
              ))}
            </div>
            {totalPages > 1 ? (
              <nav
                className="mt-12 flex flex-wrap justify-center gap-2"
                aria-label="Pagination"
              >
                {Array.from({ length: totalPages }, (_, index) => {
                  const p = index + 1
                  const qs = new URLSearchParams(passthroughParams as Record<string, string>)
                  qs.set('page', String(p))
                  return (
                    <Link
                      key={p}
                      href={`/cars?${qs.toString()}`}
                      className={`flex h-10 w-10 items-center justify-center rounded-sm font-mono text-sm font-bold ${
                        p === page
                          ? 'bg-ink text-lime'
                          : 'border border-ink/15 bg-white text-ink/70 hover:border-ink hover:text-ink'
                      }`}
                    >
                      {p}
                    </Link>
                  )
                })}
              </nav>
            ) : null}
          </>
        ) : (
          <div className="border-2 border-dashed border-ink/20 bg-white p-12 text-center">
            <p className="eyebrow-lime justify-center">Empty</p>
            <h2 className="display mt-4 text-3xl text-ink md:text-4xl">
              No cars to show yet
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/70">
              Pick a location and dates, or adjust filters. Ensure BookCars has cars and{' '}
              <code className="rounded-sm bg-bone px-1.5 py-0.5 font-mono text-xs">
                BOOKCARS_DEFAULT_SUPPLIER_ID
              </code>{' '}
              if you use a single supplier.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="eyebrow block">{label}</span>
      <span className="mt-1.5 block font-display text-base font-bold text-ink">
        {value}
      </span>
    </div>
  )
}
