import Link from 'next/link'
import {
  ArrowUpRight,
  CalendarDays,
  DoorOpen,
  Fuel,
  Gauge,
  Luggage,
  Snowflake,
  Star,
  Users,
} from 'lucide-react'
import { getCarImageUrl } from '@/lib/api/bookcars'
import { bookCarsConfig } from '@/lib/api/config'
import type { Car } from '@/lib/types/bookcars'
import {
  CAR_TYPE_LABELS,
  FUEL_POLICY_LABELS,
  GEARBOX_LABELS,
  RANGE_LABELS,
  RENTAL_OPTIONS,
  formatMileage,
  formatRentalWindow,
  getOptionSummary,
  getRentalDayLabel,
  getStatusLabel,
} from '@/lib/utils/car-display'
import { formatMoney, rentalDays } from '@/lib/utils/pricing'
import { calculateTotalRentalPrice } from '@/lib/utils/total-price'

type CarCardProps = {
  car: Car
  searchParams?: Record<string, string>
}

export function CarCard({ car, searchParams }: CarCardProps) {
  const params = new URLSearchParams(searchParams || {})
  params.set('carId', car._id)

  const detailsParams = new URLSearchParams(searchParams || {})
  const from = searchParams?.from
  const to = searchParams?.to
  const days = from && to ? rentalDays(from, to) : 0
  const priceChangeRate = car.supplier.priceChangeRate || 0
  const total =
    from && to
      ? calculateTotalRentalPrice(car, from, to, priceChangeRate)
      : Number(car.discountedDailyPrice || car.dailyPrice)
  const perDay = days > 0 ? total / days : Number(car.discountedDailyPrice || car.dailyPrice)
  const status = getStatusLabel(car)
  const canBook = car.available && !car.fullyBooked && !car.comingSoon
  const visibleOptions = RENTAL_OPTIONS.filter((option) => Number(car[option.key]) > -1)

  return (
    <article className="group relative flex flex-col border border-ink/10 bg-white transition hover:border-ink hover:shadow-soft">
      <Link
        href={`/cars/${car._id}?${detailsParams.toString()}`}
        className="relative block aspect-[4/3] overflow-hidden bg-bone"
        aria-label={car.name}
      >
        <img
          src={getCarImageUrl(car)}
          alt={car.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 chip-lime">
          {GEARBOX_LABELS[car.gearbox] || car.gearbox}
        </span>
        {car.range ? (
          <span className="absolute right-3 top-3 chip-ink">
            {RANGE_LABELS[car.range] || car.range}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-xl font-black uppercase leading-tight tracking-tightest text-ink">
              {car.name}
            </h2>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/55">
              {CAR_TYPE_LABELS[car.type] || car.type}
              {car.range ? ` · ${RANGE_LABELS[car.range] || car.range}` : ''}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-2xl font-black tracking-tightest text-ink">
              {formatMoney(total, bookCarsConfig.defaultCurrency)}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/50">
              {getRentalDayLabel(from, to)}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/50">
              {formatMoney(perDay, bookCarsConfig.defaultCurrency)} / day
            </p>
          </div>
        </div>

        {from && to ? (
          <div className="flex items-start gap-2 border-l-2 border-lime bg-lime/10 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/80">
            <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="normal-case tracking-normal">{formatRentalWindow(from, to)}</span>
          </div>
        ) : null}

        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-ink/80">
          <Spec icon={<Users size={14} strokeWidth={2} />} label={`${car.seats} seats`} />
          <Spec
            icon={<Luggage size={14} strokeWidth={2} />}
            label={`${Math.max(1, Math.floor(car.seats / 2))} bags`}
          />
          <Spec icon={<Fuel size={14} strokeWidth={2} />} label={CAR_TYPE_LABELS[car.type] || car.type} />
          <Spec icon={<Gauge size={14} strokeWidth={2} />} label={formatMileage(car.mileage)} />
          <Spec icon={<DoorOpen size={14} strokeWidth={2} />} label={`${car.doors} doors`} />
          <Spec
            icon={<Snowflake size={14} strokeWidth={2} />}
            label={car.aircon ? 'A/C' : 'No A/C'}
          />
        </dl>

        <dl className="grid gap-1.5 border-t border-ink/10 pt-4 font-mono text-[11px] uppercase tracking-[0.12em]">
          <Row k="Fuel policy" v={FUEL_POLICY_LABELS[car.fuelPolicy] || car.fuelPolicy} />
          {car.deposit > 0 ? (
            <Row k="Deposit" v={formatMoney(car.deposit, bookCarsConfig.defaultCurrency)} />
          ) : null}
          {typeof car.rating === 'number' ? (
            <Row
              k="Rating"
              v={
                <span className="inline-flex items-center gap-1">
                  {car.rating.toFixed(1)}
                  <Star className="h-3 w-3 fill-lime text-lime" />
                  {typeof car.trips === 'number' && car.trips >= 10 ? `· ${car.trips} trips` : ''}
                </span>
              }
            />
          ) : null}
          {typeof car.co2 === 'number' ? <Row k="CO₂" v={`${car.co2} g/km`} /> : null}
        </dl>

        {visibleOptions.length ? (
          <details className="group/opt border-t border-ink/10 pt-4">
            <summary className="flex cursor-pointer items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-ink/70">
              Included & optional cover
              <span className="text-lime transition group-open/opt:rotate-45">+</span>
            </summary>
            <div className="mt-3 grid gap-1 text-[12px]">
              {visibleOptions.map((option) => (
                <div key={option.key} className="flex justify-between gap-3 text-ink/75">
                  <span>{option.label}</span>
                  <span className="text-right font-medium text-ink">
                    {getOptionSummary(
                      car,
                      option.key,
                      days,
                      bookCarsConfig.defaultCurrency,
                      priceChangeRate
                    )}
                  </span>
                </div>
              ))}
            </div>
          </details>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink/10 pt-4">
          <span
            className={`rounded-sm px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${status.className}`}
          >
            {status.text}
          </span>
          {canBook ? (
            <Link
              href={`/booking?${params.toString()}`}
              className="btn-primary h-10 px-4 text-[12px]"
            >
              Book
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </Link>
          ) : (
            <span className="btn h-10 cursor-not-allowed bg-ink/10 px-4 text-[12px] text-ink/50">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

function Spec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-ink/50">{icon}</span>
      <span>{label}</span>
    </div>
  )
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 text-ink/60">
      <span>{k}</span>
      <span className="font-medium text-ink normal-case tracking-normal">{v}</span>
    </div>
  )
}
