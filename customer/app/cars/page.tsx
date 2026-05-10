import { SearchPanel } from '@/components/forms/search-panel'
import { CarCard } from '@/components/cars/car-card'
import { searchCars } from '@/lib/api/bookcars'

export const dynamic = 'force-dynamic'

type CarsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const params = await searchParams
  const pickupLocation = first(params.pickupLocation)
  const dropOffLocation = first(params.dropOffLocation)
  const from = first(params.from)
  const to = first(params.to)

  const hasSearch = Boolean(pickupLocation && from && to)
  const data = hasSearch
    ? await searchCars({
      pickupLocation: pickupLocation!,
      dropOffLocation,
      from: from!,
      to: to!,
      page: Number(first(params.page) || 1),
      size: 12,
    })
    : { items: [], total: 0 }

  const passthroughParams = Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => typeof value === 'string')
      .map(([key, value]) => [key, value as string]),
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <SearchPanel />
      </div>

      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-brand-600">Available cars</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">Choose your vehicle</h1>
        </div>
        <p className="text-sm text-neutral-600">{hasSearch ? `${data.total} result${data.total === 1 ? '' : 's'}` : 'Search dates to see availability'}</p>
      </div>

      {data.items.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.items.map((car) => (
            <CarCard key={car._id} car={car} searchParams={passthroughParams} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center">
          <h2 className="text-xl font-semibold">No cars to show yet</h2>
          <p className="mt-2 text-neutral-600">Pick a location and dates, or make sure the BookCars backend has cars and a default supplier configured.</p>
        </div>
      )}
    </div>
  )
}
