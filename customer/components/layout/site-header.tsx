import Link from 'next/link'
import { CarFront, Menu } from 'lucide-react'
import { getSession } from '@/lib/auth/session'

export async function SiteHeader() {
  const session = await getSession()

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-white">
            <CarFront size={22} />
          </span>
          <span>Move Car Rental</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-neutral-700 md:flex">
          <Link href="/cars">Cars</Link>
          <Link href="/account/bookings">My bookings</Link>
          <Link href="/terms">Terms</Link>
          {session ? <Link href="/account">Account</Link> : <Link href="/login">Login</Link>}
        </nav>

        <button className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-300 bg-white md:hidden" aria-label="Open menu">
          <Menu size={20} />
        </button>
      </div>
    </header>
  )
}
