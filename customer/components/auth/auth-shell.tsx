import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { MoveIcon } from '@/components/brand/move-mark'

type AuthShellProps = {
  eyebrow: string
  title: ReactNode
  subtitle?: ReactNode
  children: ReactNode
  /** Optional footer slot below the form card. */
  footer?: ReactNode
}

/**
 * Two-column kinetic shell for auth pages: brand panel on the left, form on the right.
 * Stacks to single-column on mobile.
 */
export function AuthShell({ eyebrow, title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-[calc(100svh-5rem)] bg-white md:grid-cols-2">
      {/* Brand side */}
      <aside className="relative hidden overflow-hidden bg-ink text-white md:flex md:flex-col md:justify-between md:p-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/70 transition hover:text-lime"
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          Back to MOVE
        </Link>
        <div>
          <MoveIcon className="h-20 w-auto text-lime" />
          <h2 className="display mt-8 text-6xl text-white">
            Drive
            <br />
            anywhere.
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/65">
            Your trips, your bookings, your saved locations — all in one account.
          </p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
          <span className="mr-2 inline-block h-1.5 w-1.5 bg-lime align-middle" />
          MOVE — Built for the road
        </p>
        {/* huge faint wordmark */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-10 -right-20 select-none font-display text-[20rem] font-black uppercase leading-none tracking-tightest text-white/[0.04]"
        >
          MOVE
        </span>
      </aside>

      {/* Form side */}
      <section className="flex items-center justify-center px-4 py-12 md:px-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 transition hover:text-ink md:hidden"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            Back
          </Link>
          <p className="eyebrow-lime">{eyebrow}</p>
          <h1 className="display mt-3 text-5xl text-ink md:text-6xl">{title}</h1>
          {subtitle ? (
            <p className="mt-4 max-w-sm leading-relaxed text-ink/65">{subtitle}</p>
          ) : null}
          <div className="mt-10">{children}</div>
          {footer}
        </div>
      </section>
    </div>
  )
}
