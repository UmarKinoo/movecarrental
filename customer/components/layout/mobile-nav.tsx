'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { MoveLockup } from '@/components/brand/move-mark'

type MobileNavProps = {
  session: boolean
}

const links = [
  { href: '/cars', label: 'Cars' },
  { href: '/locations', label: 'Map' },
  { href: '/account/bookings', label: 'Bookings' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
  { href: '/about', label: 'About' },
] as const

export function MobileNav({ session }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-sm border border-white/20 bg-transparent text-white transition hover:border-lime hover:bg-lime hover:text-ink"
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden
        >
          <div
            className="absolute right-0 top-0 flex h-full w-[min(100%,22rem)] flex-col bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* lime topline */}
            <div className="h-1 w-full bg-lime" aria-hidden />

            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <MoveLockup size={24} className="text-ink" />
              <button
                type="button"
                className="rounded-sm p-2 text-ink transition hover:bg-ink hover:text-lime"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile">
              <p className="eyebrow mb-4">Menu</p>
              <ul className="flex flex-col">
                {links.map((link, i) => (
                  <li key={link.href} className="border-b border-ink/10 last:border-b-0">
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-center justify-between py-4 font-display text-2xl font-black uppercase tracking-tightest text-ink transition hover:text-lime"
                    >
                      <span>
                        <span className="mr-3 font-mono text-xs text-ink/40">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {link.label}
                      </span>
                      <ArrowUpRight
                        size={20}
                        strokeWidth={2.5}
                        className="opacity-0 transition group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col gap-2 border-t border-ink/10 p-5">
              {session ? (
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="btn-ghost w-full"
                >
                  Account
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="btn-ghost w-full"
                >
                  Login
                </Link>
              )}
              <Link
                href="/cars"
                onClick={() => setOpen(false)}
                className="btn-lime w-full"
              >
                Book a car
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
