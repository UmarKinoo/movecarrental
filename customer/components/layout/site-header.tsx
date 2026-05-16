import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { MobileNav } from '@/components/layout/mobile-nav'
import { MoveLockup } from '@/components/brand/move-mark'
import { getSession } from '@/lib/auth/session'

const navLinks = [
  { href: '/cars', label: 'Cars' },
  { href: '/locations', label: 'Map' },
  { href: '/account/bookings', label: 'Bookings' },
  { href: '/faq', label: 'FAQ' },
  { href: '/about', label: 'About' },
] as const

export async function SiteHeader() {
  const session = await getSession()

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/95 text-white backdrop-blur supports-[backdrop-filter]:bg-ink/85">
      {/* Lime topline — kinetic accent strip */}
      <div className="h-1 w-full bg-lime" aria-hidden />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 md:h-20 md:px-8">
        <Link
          href="/"
          aria-label="MOVE — home"
          className="flex items-center transition hover:opacity-80"
        >
          <MoveLockup width={80} />
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative px-3 py-2 font-display text-[13px] font-bold uppercase tracking-[0.08em] text-white/75 transition hover:text-white"
            >
              {link.label}
              <span className="absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-lime transition-transform group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {session ? (
            <Link
              href="/account"
              className="inline-flex h-10 items-center justify-center rounded-sm border border-white/25 px-4 font-display text-[12px] font-bold uppercase tracking-[0.06em] text-white transition hover:border-lime hover:bg-lime hover:text-ink"
            >
              Account
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-sm border border-white/25 px-4 font-display text-[12px] font-bold uppercase tracking-[0.06em] text-white transition hover:border-lime hover:bg-lime hover:text-ink"
            >
              Login
            </Link>
          )}
          <Link
            href="/cars"
            className="btn-lime h-10 px-4 text-[12px] shadow-[3px_3px_0_0_#DDFF00]/0 hover:bg-white hover:text-ink"
          >
            Book now
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </Link>
        </div>

        <MobileNav session={!!session} />
      </div>
    </header>
  )
}
