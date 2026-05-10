import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Fuel, Gauge, Luggage, Users } from 'lucide-react'
import { getCar, getCarImageUrl } from '@/lib/api/bookcars'
import { formatMoney } from '@/lib/utils/pricing'

export const dynamic = 'force-dynamic'

type CarDetailsPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function stringParams(params: Record<string, string | string[] | undefined>) {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => typeof value === 'string')
      .map(([key, value]) => [key, value as string]),
  )
}

export default async function CarDetailsPage({ params, searchParams }: CarDetailsPageProps) {
  const { id } = await params
  const query = stringParams(await searchParams)
  const car = await getCar(id)

  if (!car) {
    notFound()
  }

  const bookingParams = new URLSearchParams(query)
  bookingParams.set('carId', car._id)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <img src={getCarImageUrl(car)} alt={car.name} className="h-[28rem] w-full rounded-lg object-cover" />

        <aside className="rounded-lg border border-neutral-200 bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold uppercase text-brand-600">Vehicle details</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">{car.name}</h1>
          <p className="mt-3 text-neutral-600">From {formatMoney(car.discountedDailyPrice || car.dailyPrice)} per day</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-md bg-paper p-3">
              <Users size={18} />
              <dt className="mt-2 text-neutral-500">Seats</dt>
              <dd className="font-semibold">{car.seats}</dd>
            </div>
            <div className="rounded-md bg-paper p-3">
              <Luggage size={18} />
              <dt className="mt-2 text-neutral-500">Luggage</dt>
              <dd className="font-semibold">{Math.max(1, Math.floor(car.seats / 2))} bags</dd>
            </div>
            <div className="rounded-md bg-paper p-3">
              <Fuel size={18} />
              <dt className="mt-2 text-neutral-500">Fuel</dt>
              <dd className="font-semibold capitalize">{car.type}</dd>
            </div>
            <div className="rounded-md bg-paper p-3">
              <Gauge size={18} />
              <dt className="mt-2 text-neutral-500">Mileage</dt>
              <dd className="font-semibold">{car.mileage === -1 ? 'Unlimited' : `${car.mileage} km`}</dd>
            </div>
          </dl>

          <Link href={`/booking?${bookingParams.toString()}`} className="mt-6 block rounded-md bg-ink px-6 py-3 text-center text-sm font-semibold text-white">
            Continue booking
          </Link>
        </aside>
      </div>
    </div>
  )
}
