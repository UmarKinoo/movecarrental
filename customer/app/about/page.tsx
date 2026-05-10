import Link from 'next/link'
import { ArrowUpRight, Compass, ShieldCheck, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'

const pillars = [
  {
    title: 'One fleet, one team',
    body: 'Cars we own, service, and clean. No third-party lottery, no surprise swap-outs.',
    Icon: Sparkles,
  },
  {
    title: 'Transparent pricing',
    body: 'Daily rate, deposit, and any add-ons shown before you confirm. What you see is what you pay.',
    Icon: ShieldCheck,
  },
  {
    title: 'Real human help',
    body: 'Email and phone support staffed by people who know the cars and the roads.',
    Icon: Compass,
  },
] as const

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        eyebrow="About MOVE"
        title={
          <>
            Less friction,
            <br />
            <span className="relative inline-block">
              more road
              <span className="absolute -bottom-2 left-0 right-0 h-2 bg-lime md:-bottom-3 md:h-3" />
            </span>
            .
          </>
        }
        lede="MOVE is a focused rental operator built on the BookCars platform: one fleet, clear pricing, and a booking flow designed for visitors and locals who want less paperwork and more keys-in-hand."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="eyebrow mb-6">Our pillars</p>
          <div className="grid gap-px bg-ink/10 md:grid-cols-3">
            {pillars.map(({ title, body, Icon }) => (
              <div key={title} className="bg-white p-7">
                <Icon size={26} strokeWidth={1.5} className="text-ink/70" />
                <h2 className="mt-8 font-display text-xl font-black uppercase tracking-tightest text-ink">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-3">
            <Link href="/cars" className="btn-lime px-6">
              Search available cars
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </Link>
            <Link href="/contact" className="btn-ghost px-6">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
