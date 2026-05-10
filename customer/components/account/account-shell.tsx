import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const sideLinks = [
  { href: '/account', label: 'Overview' },
  { href: '/account/settings', label: 'Profile' },
  { href: '/account/bookings', label: 'Bookings' },
  { href: '/account/notifications', label: 'Notifications' },
  { href: '/account/change-password', label: 'Password' },
] as const

type AccountShellProps = {
  eyebrow: string
  title: ReactNode
  active?: (typeof sideLinks)[number]['href']
  children: ReactNode
}

export function AccountShell({ eyebrow, title, active, children }: AccountShellProps) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/60 transition hover:text-ink"
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          Account
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[14rem_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="eyebrow mb-4">Account</p>
            <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
              {sideLinks.map((link) => {
                const isActive = active === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative whitespace-nowrap border-l-2 px-3 py-2 font-display text-[13px] font-bold uppercase tracking-[0.06em] transition ${
                      isActive
                        ? 'border-lime bg-lime/10 text-ink'
                        : 'border-transparent text-ink/65 hover:border-ink/30 hover:text-ink'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </aside>

          <div>
            <p className="eyebrow-lime">{eyebrow}</p>
            <h1 className="display mt-3 text-5xl text-ink md:text-6xl">{title}</h1>
            <div className="mt-10">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
