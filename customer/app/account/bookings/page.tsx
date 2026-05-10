import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import { AccountShell } from '@/components/account/account-shell'
import { getCustomerBookings } from '@/lib/api/bookcars'
import { getSession } from '@/lib/auth/session'
import { formatMoney } from '@/lib/utils/pricing'

export const dynamic = 'force-dynamic'

const STATUS_STYLES: Record<string, string> = {
  paid: 'bg-lime text-ink',
  reserved: 'bg-lime text-ink',
  pending: 'bg-amber-100 text-amber-900',
  deposit: 'bg-amber-100 text-amber-900',
  cancelled: 'bg-ink/10 text-ink/55',
  void: 'bg-ink/10 text-ink/55',
}

export default async function AccountBookingsPage() {
  const session = await getSession()
  if (!session?.token) {
    redirect('/login?next=/account/bookings')
  }

  const { items } = await getCustomerBookings(session.token, 1, 40)

  return (
    <AccountShell
      eyebrow={`Trips · ${items.length}`}
      title="My bookings"
      active="/account/bookings"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55">
          Past, current, and upcoming rentals
        </p>
        <Link
          href="/cars"
          className="inline-flex items-center gap-2 border-b border-lime pb-0.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink hover:text-lime"
        >
          + New search
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-10 border-2 border-dashed border-ink/15 bg-white p-12 text-center">
          <p className="eyebrow-lime justify-center">Empty</p>
          <h2 className="display mt-3 text-3xl text-ink">No bookings yet</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm text-ink/65">
            Start from the home search or{' '}
            <Link href="/cars" className="border-b border-lime pb-0.5 text-ink">
              browse cars
            </Link>
            .
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-2">
          {items.map((booking) => {
            const status = String(booking.status || '').toLowerCase()
            const statusClass = STATUS_STYLES[status] || 'bg-ink/10 text-ink/70'
            return (
              <li key={booking._id}>
                <Link
                  href={`/account/bookings/${booking._id}`}
                  className="group flex flex-col gap-3 border border-ink/10 bg-white p-5 transition hover:border-ink hover:shadow-soft md:flex-row md:items-center md:justify-between md:gap-6"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${statusClass}`}
                      >
                        {booking.status || 'unknown'}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">
                        REF · {booking._id.slice(-8)}
                      </span>
                    </div>
                    <p className="mt-3 font-display text-xl font-black uppercase tracking-tightest text-ink">
                      {booking.car?.name || 'Vehicle'}
                    </p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60">
                      {booking.from ? new Date(booking.from).toLocaleDateString() : ''}
                      {' → '}
                      {booking.to ? new Date(booking.to).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 md:flex-col md:items-end md:justify-center">
                    <p className="font-display text-xl font-black tracking-tightest text-ink">
                      {typeof booking.price === 'number' ? formatMoney(booking.price) : '—'}
                    </p>
                    <ArrowUpRight
                      size={18}
                      strokeWidth={2.5}
                      className="text-ink/40 transition group-hover:translate-x-0.5 group-hover:text-lime"
                    />
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </AccountShell>
  )
}
