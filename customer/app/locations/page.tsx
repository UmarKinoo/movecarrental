import { Suspense } from 'react'
import { LocationsMap } from '@/components/map/locations-map'
import { PageHeader } from '@/components/layout/page-header'
import { getLocationsWithPosition } from '@/lib/api/bookcars'

export const dynamic = 'force-dynamic'

export default async function LocationsPage() {
  const locations = await getLocationsWithPosition()

  return (
    <div>
      <PageHeader
        eyebrow={`Locations · ${locations.length}`}
        title="On the map"
        lede="Tap a marker to start a search from that location. Airports, hotels, and city points all welcome."
      />
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Suspense
            fallback={
              <div className="h-[28rem] animate-pulse bg-bone" aria-label="Loading map" />
            }
          >
            <div className="overflow-hidden border border-ink/10">
              <LocationsMap locations={locations} heightClassName="h-[28rem]" />
            </div>
          </Suspense>
        </div>
      </section>
    </div>
  )
}
