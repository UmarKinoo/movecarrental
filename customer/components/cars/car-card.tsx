import Link from 'next/link'
import { Fuel, Gauge, Luggage, Users } from 'lucide-react'
import { getCarImageUrl } from '@/lib/api/bookcars'
import { bookCarsConfig } from '@/lib/api/config'
import type { Car } from '@/lib/types/bookcars'
import { formatMoney } from '@/lib/utils/pricing'

type CarCardProps = {
  car: Car
  searchParams?: Record<string, string>
}

export function CarCard({ car, searchParams }: CarCardProps) {
  const params = new URLSearchParams(searchParams)
  params.set('carId', car._id)

  const detailsParams = new URLSearchParams(searchParams)

  return (
    <article className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      <Link href={`/cars/${car._id}?${detailsParams.toString()}`} className="block">
        <img src={getCarImageUrl(car)} alt={car.name} className="h-52 w-full object-cover" />
      </Link>
      <div className="space-y-5 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">{car.name}</h2>
            <p className="mt-1 text-sm capitalize text-neutral-600">{car.gearbox} transmission</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{formatMoney(car.discountedDailyPrice || car.dailyPrice, bookCarsConfig.defaultCurrency)}</p>
            <p className="text-xs text-neutral-500">per day</p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm text-neutral-700">
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>{car.seats} seats</span>
          </div>
          <div className="flex items-center gap-2">
            <Luggage size={16} />
            <span>{Math.max(1, Math.floor(car.seats / 2))} bags</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel size={16} />
            <span className="capitalize">{car.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge size={16} />
            <span>{car.mileage === -1 ? 'Unlimited' : `${car.mileage} km`}</span>
          </div>
        </dl>

        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {car.available && !car.fullyBooked ? 'Available' : 'Check dates'}
          </span>
          <Link href={`/booking?${params.toString()}`} className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">
            Book
          </Link>
        </div>
      </div>
    </article>
  )
}
