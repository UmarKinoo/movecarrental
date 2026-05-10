import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { CancelBookingButton } from '@/app/account/bookings/[id]/cancel-booking-button'
import { getBooking } from '@/lib/api/bookcars'
import { getSession } from '@/lib/auth/session'
import { formatMoney } from '@/lib/utils/pricing'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string }>
}

const STATUS_STYLES: Record<string, string> = {
  paid: 'bg-lime text-ink',
  reserved: 'bg-lime text-ink',
  pending: 'bg-amber-100 text-amber-900',
  deposit: 'bg-amber-100 text-amber-900',
  cancelled: 'bg-ink/10 text-ink/55',
  void: 'bg-ink/10 text-ink/55',
}

export default async function BookingDetailPage({ params }: PageProps) {
  const { id } = await params
  const session = await getSession()
  if (!session?.token) {
    redirect(`/login?next=/account/bookings/${id}`)
  }

  const booking = await getBooking(id)
  if (!booking) {
    notFound()
  }

  const driverId =
    typeof booking.driver === 'object' && booking.driver && '_id' in booking.driver
      ? String(booking.driver._id)
      : String(booking.driver || '')

  const isOwner = driverId === session.userId
  const canTryCancel = isOwner && booking.status !== 'cancelled' && booking.status !== 'void'
  const status = String(booking.status || '').toLowerCase()
  const statusClass = STATUS_STYLES[status] || 'bg-ink/10 text-ink/70'

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
        <Link
          href="/account/bookings"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/60 transition hover:text-ink"
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          Bookings
        </Link>

        <div className="mt-6">
          <p className="eyebrow-lime">Booking · {id.slice(-8)}</p>
          <h1 className="display mt-3 text-5xl text-ink md:text-6xl">
            {booking.car?.name || 'Vehicle'}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-sm px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${statusClass}`}
            >
              {booking.status || 'unknown'}
            </span>
            {typeof booking.price === 'number' ? (
              <span className="font-display text-xl font-black tracking-tightest text-ink">
                {formatMoney(booking.price)}
              </span>
            ) : null}
          </div>
        </div>

        <dl className="mt-10 grid gap-px bg-ink/10 sm:grid-cols-2">
          <Detail label="Pickup" value={booking.pickupLocation?.name || '—'} />
          <Detail label="Drop-off" value={booking.dropOffLocation?.name || '—'} />
          <Detail
            label="From"
            value={booking.from ? new Date(booking.from).toLocaleString() : '—'}
          />
          <Detail
            label="To"
            value={booking.to ? new Date(booking.to).toLocaleString() : '—'}
          />
        </dl>

        {canTryCancel ? (
          <div className="mt-10 border-t-2 border-ink pt-6">
            <p className="eyebrow-lime">Need to cancel?</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/65">
              Cancellation uses your BookCars account permissions. Surcharges may apply
              depending on the rental policy.
            </p>
            <div className="mt-5">
              <CancelBookingButton bookingId={id} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-5">
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-2 font-display text-base font-bold text-ink">{value}</dd>
    </div>
  )
}
