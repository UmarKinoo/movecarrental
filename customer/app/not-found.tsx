import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { MoveIcon } from '@/components/brand/move-mark'

export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-white">
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-20 left-1/2 -z-0 -translate-x-1/2 select-none font-display text-[55vw] font-black leading-none tracking-tightest text-lime/30 md:text-[36rem]"
      >
        404
      </span>
      <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-3xl flex-col items-start justify-center px-4 py-16 md:px-8">
        <p className="eyebrow-lime">Lost</p>
        <h1 className="display mt-4 text-6xl text-ink md:text-8xl">
          Wrong turn.
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70">
          The page you requested does not exist or the link may be wrong. Plenty of
          road still ahead — pick a direction.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link href="/" className="btn-lime px-6 shadow-[4px_4px_0_0_#0E1A14]">
            Home
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </Link>
          <Link href="/cars" className="btn-ghost px-6">
            Browse cars
          </Link>
        </div>
        <MoveIcon className="mt-16 h-10 w-auto text-ink/15" />
      </div>
    </div>
  )
}
