import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'

type ConfirmationPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const params = await searchParams
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  return (
    <div className="bg-white">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-4 py-16 md:px-8">
        <p className="eyebrow-lime">Confirmed</p>
        <h1 className="display mt-4 text-6xl text-ink md:text-8xl">
          You&apos;re
          <br />
          <span className="relative inline-block">
            on the road.
            <span className="absolute -bottom-2 left-0 right-0 h-2 bg-lime md:h-3" />
          </span>
        </h1>
        <p className="mt-8 max-w-xl leading-relaxed text-ink/70">
          We sent the booking to BookCars. The team will follow up with pickup
          details. Save your reference and bring your documents.
        </p>

        {id ? (
          <div className="mt-10 inline-flex w-fit items-center gap-3 border-2 border-ink bg-lime px-5 py-3">
            <span className="flex h-7 w-7 items-center justify-center bg-ink">
              <Check size={16} strokeWidth={3} className="text-lime" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/70">
              Reference
            </span>
            <span className="font-mono text-sm font-bold text-ink">{id}</span>
          </div>
        ) : null}

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Link
            href="/account/bookings"
            className="btn-primary px-6"
          >
            View my bookings
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </Link>
          <Link href="/" className="btn-ghost px-6">
            Back home
          </Link>
        </div>
      </div>
    </div>
  )
}
