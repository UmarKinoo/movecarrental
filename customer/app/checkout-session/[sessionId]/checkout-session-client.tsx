'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Loader2 } from 'lucide-react'

export function CheckoutSessionClient({ sessionId }: { sessionId: string }) {
  const [status, setStatus] = useState<'loading' | 'ok' | 'fail'>('loading')
  const [bookingId, setBookingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        const response = await fetch('/api/bookings/verify-stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })
        const data = await response.json()
        if (cancelled) {
          return
        }
        if (data.ok && data.bookingId) {
          setBookingId(data.bookingId)
          setStatus('ok')
        } else {
          setStatus('fail')
        }
      } catch {
        if (!cancelled) {
          setStatus('fail')
        }
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  return (
    <div className="bg-white">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-4 py-16 md:px-8">
        {status === 'loading' ? (
          <>
            <p className="eyebrow-lime">Verifying</p>
            <h1 className="display mt-4 text-5xl text-ink md:text-6xl">
              Confirming
              <br />
              payment…
            </h1>
            <p className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/60">
              <Loader2 size={14} className="animate-spin" /> One moment
            </p>
          </>
        ) : null}

        {status === 'fail' ? (
          <>
            <p className="eyebrow-lime">! Status unclear</p>
            <h1 className="display mt-4 text-5xl text-ink md:text-6xl">
              We couldn&apos;t
              <br />
              confirm this.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70">
              Check your email for a confirmation, or open your bookings to see the
              latest status. Contact us if anything looks off.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link href="/account/bookings" className="btn-lime px-6">
                My bookings
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </Link>
              <Link href="/contact" className="btn-ghost px-6">
                Contact us
              </Link>
            </div>
          </>
        ) : null}

        {status === 'ok' ? (
          <>
            <p className="eyebrow-lime">Payment received</p>
            <h1 className="display mt-4 text-5xl text-ink md:text-7xl">
              You&apos;re set.
            </h1>
            {bookingId ? (
              <div className="mt-8 inline-flex w-fit items-center gap-3 border-2 border-ink bg-lime px-5 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/70">
                  Reference
                </span>
                <span className="font-mono text-sm font-bold text-ink">{bookingId}</span>
              </div>
            ) : null}
            <Link
              href={bookingId ? `/booking/confirmation?id=${bookingId}` : '/'}
              className="btn-lime mt-10 w-fit px-7 shadow-[6px_6px_0_0_#0E1A14]"
            >
              Continue
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </Link>
          </>
        ) : null}
      </div>
    </div>
  )
}
