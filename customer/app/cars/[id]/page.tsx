import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  DoorOpen,
  Fuel,
  Gauge,
  Luggage,
  Snowflake,
  Users,
} from 'lucide-react'
import { getCar, getCarImageUrl } from '@/lib/api/bookcars'
import { bookCarsConfig } from '@/lib/api/config'
import { formatMoney, rentalDays } from '@/lib/utils/pricing'
import { calculateTotalRentalPrice } from '@/lib/utils/total-price'
import {
  CAR_TYPE_LABELS,
  FUEL_POLICY_LABELS,
  GEARBOX_LABELS,
  RANGE_LABELS,
  RENTAL_OPTIONS,
  formatMileage,
  formatRentalWindow,
  getOptionSummary,
  getStatusLabel,
} from '@/lib/utils/car-display'

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
  const from = query.from
  const to = query.to
  const days = from && to ? rentalDays(from, to) : 0
  const priceChangeRate = car.supplier.priceChangeRate || 0
  const tripTotal =
    from && to
      ? calculateTotalRentalPrice(car, from, to, priceChangeRate)
      : Number(car.discountedDailyPrice || car.dailyPrice)
  const status = getStatusLabel(car)
  const hasTrip = Boolean(query.pickupLocation && from && to)
  const canBook = hasTrip && car.available && !car.fullyBooked && !car.comingSoon
  const backToCars = `/cars${query.pickupLocation ? `?${new URLSearchParams(query).toString()}` : ''}`

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <Link
          href={backToCars}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/60 transition hover:text-ink"
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          Back to cars
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Hero / image */}
          <div className="relative">
            <div className="absolute -left-3 -top-3 -z-0 h-full w-full bg-lime md:-left-4 md:-top-4" aria-hidden />
            <div className="relative aspect-[4/3] overflow-hidden border border-ink bg-ink lg:aspect-auto lg:h-full">
              <img
                src={getCarImageUrl(car)}
                alt={car.name}
                className="h-full w-full object-cover"
              />
              <span
                className={`absolute left-4 top-4 rounded-sm px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${status.className}`}
              >
                {status.text}
              </span>
            </div>
          </div>

          {/* Aside */}
          <aside className="flex flex-col">
            <p className="eyebrow-lime">Vehicle · {car.supplier?.fullName || 'MOVE fleet'}</p>
            <h1 className="display mt-3 text-5xl text-ink md:text-6xl">{car.name}</h1>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/60">
              {GEARBOX_LABELS[car.gearbox] || car.gearbox}
              {car.range ? ` · ${RANGE_LABELS[car.range] || car.range}` : ''}
            </p>

            <div className="mt-6 flex items-end justify-between gap-4 border-y-2 border-ink py-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55">
                  {days ? `${days} ${days === 1 ? 'day' : 'days'} total` : 'From'}
                </p>
                <p className="display mt-1 text-5xl text-ink">
                  {formatMoney(tripTotal, bookCarsConfig.defaultCurrency)}
                </p>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/60">
                {formatMoney(
                  car.discountedDailyPrice || car.dailyPrice,
                  bookCarsConfig.defaultCurrency,
                )}{' '}
                / day
              </p>
            </div>

            {from && to ? (
              <div className="mt-4 flex items-start gap-2 border-l-2 border-lime bg-lime/10 px-3 py-2.5 text-sm text-ink/85">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                <span>{formatRentalWindow(from, to)}</span>
              </div>
            ) : null}

            <dl className="mt-6 grid grid-cols-3 gap-px bg-ink/10">
              <SpecBlock icon={<Users size={18} strokeWidth={1.5} />} label="Seats" value={String(car.seats)} />
              <SpecBlock
                icon={<Luggage size={18} strokeWidth={1.5} />}
                label="Bags"
                value={String(Math.max(1, Math.floor(car.seats / 2)))}
              />
              <SpecBlock
                icon={<Fuel size={18} strokeWidth={1.5} />}
                label="Fuel"
                value={CAR_TYPE_LABELS[car.type] || car.type}
              />
              <SpecBlock
                icon={<Gauge size={18} strokeWidth={1.5} />}
                label="Mileage"
                value={formatMileage(car.mileage)}
              />
              <SpecBlock
                icon={<DoorOpen size={18} strokeWidth={1.5} />}
                label="Doors"
                value={String(car.doors)}
              />
              <SpecBlock
                icon={<Snowflake size={18} strokeWidth={1.5} />}
                label="A/C"
                value={car.aircon ? 'Yes' : 'No'}
              />
            </dl>

            <dl className="mt-6 grid gap-2 border border-ink/10 p-4 font-mono text-[11px] uppercase tracking-[0.12em]">
              <Row k="Fuel policy" v={FUEL_POLICY_LABELS[car.fuelPolicy] || car.fuelPolicy} />
              {car.deposit > 0 ? (
                <Row k="Deposit" v={formatMoney(car.deposit, bookCarsConfig.defaultCurrency)} />
              ) : null}
              {car.minimumAge ? <Row k="Min driver age" v={String(car.minimumAge)} /> : null}
              {RENTAL_OPTIONS.filter((option) => Number(car[option.key]) > -1).map((option) => (
                <Row
                  key={option.key}
                  k={option.label}
                  v={getOptionSummary(
                    car,
                    option.key,
                    days,
                    bookCarsConfig.defaultCurrency,
                    priceChangeRate,
                  )}
                />
              ))}
            </dl>

            {canBook ? (
              <Link
                href={`/booking?${bookingParams.toString()}`}
                className="btn-lime mt-6 h-14 w-full text-[14px] shadow-[6px_6px_0_0_#0E1A14]"
              >
                Continue booking
                <ArrowUpRight size={18} strokeWidth={2.5} />
              </Link>
            ) : (
              <Link href="/cars" className="btn-ghost mt-6 h-14 w-full text-[14px]">
                Search dates
                <ArrowUpRight size={18} strokeWidth={2.5} />
              </Link>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

function SpecBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="bg-white p-4">
      <span className="text-ink/70">{icon}</span>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55">{label}</p>
      <p className="mt-1 font-display text-base font-bold text-ink">{value}</p>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-ink/60">
      <span>{k}</span>
      <span className="text-right font-medium text-ink normal-case tracking-normal">{v}</span>
    </div>
  )
}
