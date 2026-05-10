import type { ReactNode } from 'react'

type PageHeaderProps = {
  eyebrow: string
  title: ReactNode
  lede?: ReactNode
  /** Tone — 'light' (white) or 'bone' (subtle off-white). */
  tone?: 'light' | 'bone' | 'dark'
}

/**
 * Shared kinetic page header for static / lightweight pages.
 * Renders the eyebrow + display title in the brand voice.
 */
export function PageHeader({ eyebrow, title, lede, tone = 'light' }: PageHeaderProps) {
  const bg = tone === 'bone' ? 'bg-bone' : tone === 'dark' ? 'bg-ink text-white' : 'bg-white'
  return (
    <section className={`border-b border-ink/10 ${bg}`}>
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <p className={`eyebrow-lime ${tone === 'dark' ? '!text-white' : ''}`}>{eyebrow}</p>
        <h1 className="display mt-4 text-6xl md:text-8xl">{title}</h1>
        {lede ? (
          <p
            className={`mt-6 max-w-2xl text-base leading-relaxed md:text-lg ${
              tone === 'dark' ? 'text-white/70' : 'text-ink/65'
            }`}
          >
            {lede}
          </p>
        ) : null}
      </div>
    </section>
  )
}
