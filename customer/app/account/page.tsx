import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowUpRight,
  Bell,
  Calendar,
  KeyRound,
  UserCog,
} from 'lucide-react'
import { getUser } from '@/lib/api/bookcars'
import { getSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

const tiles = [
  {
    href: '/account/settings',
    title: 'Profile settings',
    desc: 'Name, contact, license, preferences',
    Icon: UserCog,
    num: '01',
  },
  {
    href: '/account/bookings',
    title: 'My bookings',
    desc: 'Trips, references, cancellations',
    Icon: Calendar,
    num: '02',
  },
  {
    href: '/account/notifications',
    title: 'Notifications',
    desc: 'Inbox from the rental team',
    Icon: Bell,
    num: '03',
  },
  {
    href: '/account/change-password',
    title: 'Change password',
    desc: 'Rotate your account password',
    Icon: KeyRound,
    num: '04',
  },
] as const

export default async function AccountPage() {
  const session = await getSession()
  if (!session?.token) {
    redirect('/login?next=/account')
  }

  const user = await getUser(session.userId, session.token)
  const initials = (user?.fullName || 'C')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-ink/10 bg-bone">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 md:flex-row md:items-end md:justify-between md:px-8 md:py-16">
          <div>
            <p className="eyebrow-lime">Account</p>
            <h1 className="display mt-3 text-5xl text-ink md:text-7xl">
              {user?.fullName || 'Customer'}
            </h1>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/60">
              {user?.email}
            </p>
          </div>
          <div className="flex h-20 w-20 items-center justify-center border-2 border-ink bg-lime font-display text-3xl font-black uppercase text-ink">
            {initials || 'M'}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <p className="eyebrow mb-6">Manage</p>
        <div className="grid gap-px bg-ink/10 md:grid-cols-2">
          {tiles.map(({ href, title, desc, Icon, num }) => (
            <Link
              key={href}
              href={href}
              className="group relative flex items-start justify-between gap-6 bg-white p-7 transition hover:bg-ink"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink/45 group-hover:text-lime">
                  {num}
                </span>
                <h2 className="mt-3 font-display text-2xl font-black uppercase tracking-tightest text-ink group-hover:text-white">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-ink/60 group-hover:text-white/65">{desc}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <Icon size={26} strokeWidth={1.5} className="text-ink/70 group-hover:text-lime" />
                <ArrowUpRight
                  size={20}
                  strokeWidth={2.5}
                  className="text-ink/0 transition group-hover:text-lime"
                />
              </div>
            </Link>
          ))}
        </div>

        <form
          action="/api/auth/logout"
          method="post"
          className="mt-10 flex justify-end"
        >
          <button
            type="submit"
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/60 transition hover:text-red-600"
          >
            ↗ Sign out
          </button>
        </form>
      </section>
    </div>
  )
}
