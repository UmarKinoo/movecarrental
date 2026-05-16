import Link from 'next/link'
import { ArrowUpRight, Mail } from 'lucide-react'
import { MoveLogo } from '@/components/brand/move-logo'

const cols = [
  {
    heading: 'Book',
    links: [
      { href: '/cars', label: 'Browse cars' },
      { href: '/locations', label: 'Locations map' },
      { href: '/account/bookings', label: 'My bookings' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/faq', label: 'FAQ' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/terms', label: 'Terms' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/cookie-policy', label: 'Cookie policy' },
    ],
  },
] as const

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      {/* Giant background MOVE wordmark — kinetic */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-10 select-none text-center"
      >
        <span className="block font-display text-[28vw] font-black uppercase leading-none tracking-tightest text-white/[0.04]">
          MOVE
        </span>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" aria-label="MOVE — home" className="inline-block">
              <MoveLogo width={80} />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
              Drive anywhere. A modern, mobile-first car rental for travellers,
              commuters, and weekenders. Pick a car. Pick a date. Go.
            </p>
            <a
              href="mailto:hello@movecarrental.com"
              className="mt-6 inline-flex items-center gap-2 border-b border-lime pb-1 font-mono text-xs uppercase tracking-[0.16em] text-lime transition hover:gap-3"
            >
              <Mail size={14} />
              hello@movecarrental.com
            </a>
          </div>

          {cols.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <span className="eyebrow text-white/50">{col.heading}</span>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-white/80 transition hover:text-lime"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={14}
                        className="-translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-3 border-t border-white/10 py-6 text-xs text-white/50 md:flex-row md:items-center">
          <p className="font-mono uppercase tracking-[0.14em]">
            © {new Date().getFullYear()} MOVE — All rights reserved
          </p>
          <p className="font-mono uppercase tracking-[0.14em]">
            <span className="mr-2 inline-block h-1.5 w-1.5 bg-lime align-middle" />
            Built for the road
          </p>
        </div>
      </div>
    </footer>
  )
}
