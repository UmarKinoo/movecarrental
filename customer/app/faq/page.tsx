import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'

const items = [
  {
    q: 'What do I need at pickup?',
    a: 'A valid driver license, the card used for any online payment (if applicable), and a booking confirmation email.',
  },
  {
    q: 'Can I pay at the counter?',
    a: 'Yes — when "Pay at counter" is offered for your trip you can reserve online and settle payment at pickup.',
  },
  {
    q: 'How do I change or cancel?',
    a: 'Sign in, open the booking from "My bookings", and use the options there. Policies depend on the rate and timing.',
  },
  {
    q: 'Do you charge a security deposit?',
    a: 'Some vehicles include a deposit line item. You will see deposit and "pay in full" amounts before you confirm.',
  },
] as const

export default function FaqPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Help"
        title="FAQ"
        lede="Quick answers to the questions we get most. Can't find yours? Drop us a line."
      />

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <ul className="grid gap-0">
            {items.map(({ q, a }, i) => (
              <li
                key={q}
                className="border-b border-ink/10 first:border-t first:border-ink/10"
              >
                <details className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-6 py-6">
                    <span className="flex items-baseline gap-5">
                      <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink/45">
                        0{i + 1}
                      </span>
                      <span className="font-display text-xl font-black uppercase tracking-tightest text-ink md:text-2xl">
                        {q}
                      </span>
                    </span>
                    <span className="font-mono text-lg text-lime transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mb-6 max-w-2xl pl-12 text-base leading-relaxed text-ink/70">
                    {a}
                  </p>
                </details>
              </li>
            ))}
          </ul>

          <div className="mt-16">
            <Link href="/contact" className="btn-lime px-6">
              Still need help?
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
