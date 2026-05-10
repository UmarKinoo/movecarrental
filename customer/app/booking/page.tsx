import { notFound } from 'next/navigation'
import { BookingForm } from '@/components/booking/booking-form'
import { getCar, getLocations } from '@/lib/api/bookcars'
import { calculateBaseRentalPrice } from '@/lib/utils/pricing'

export const dynamic = 'force-dynamic'

type BookingPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const params = await searchParams
  const carId = first(params.carId)
  const pickupLocationId = first(params.pickupLocation)
  const dropOffLocationId = first(params.dropOffLocation) || pickupLocationId
  const from = first(params.from)
  const to = first(params.to)

  if (!carId || !pickupLocationId || !from || !to) {
    notFound()
  }

  const [car, locations] = await Promise.all([
    getCar(carId),
    getLocations('', 1, 100),
  ])

  if (!car) {
    notFound()
  }

  const pickupLocation = locations.items.find((location) => location._id === pickupLocationId)
  const dropOffLocation = locations.items.find((location) => location._id === dropOffLocationId)
  const estimatedPrice = calculateBaseRentalPrice(car, from, to)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <BookingForm
        car={car}
        pickupLocation={pickupLocation}
        dropOffLocation={dropOffLocation}
        from={from}
        to={to}
        estimatedPrice={estimatedPrice}
      />
    </div>
  )
}
