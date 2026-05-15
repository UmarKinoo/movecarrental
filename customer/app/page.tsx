import Link from 'next/link'
import {
  ArrowUpRight,
  CalendarCheck,
  Gauge,
  KeyRound,
  MapPinned,
  Plane,
  ShieldCheck,
  Users,
  Zap,
} from 'lucide-react'
import { SearchPanel } from '@/components/forms/search-panel'
import { MoveIcon } from '@/components/brand/move-mark'
import { TransparentCarImage } from '@/components/cars/transparent-car-image'
import { fleetCars } from '@/lib/cars/fleet-assets'

const heroCar = fleetCars.allionHero

const popularCars = [
  { name: 'Compact Auto', tag: 'CITY', icon: Zap },
  { name: 'Family SUV', tag: 'TRIPS', icon: Users },
  { name: 'Convertible', tag: 'COAST', icon: Gauge },
  { name: '7-Seater Van', tag: 'CREW', icon: KeyRound },
] as const

const marqueeWords = [
  'AIRPORT PICKUP',
  '24/7 SUPPORT',
  'CLEAR PRICING',
  'BOOK IN 60S',
  'NO HIDDEN FEES',
  'INSURED',
] as const

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden bg-white">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 md:px-8 md:pb-24 md:pt-20">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-14">
            <div>
              <p className="eyebrow-lime">Introducing — MOVE</p>
              <h1 className="display mt-6 text-[12vw] text-ink md:text-[7rem] xl:text-[8.5rem]">
                Drive
                <br />
                <span className="relative inline-block">
                  any
                  <span className="absolute -bottom-2 left-0 right-0 h-2 bg-lime md:-bottom-3 md:h-3" />
                </span>
                where.
              </h1>
              <p className="mt-8 max-w-md text-base leading-relaxed text-ink/70 md:text-lg">
                Book a car in sixty seconds. Pick up the keys.
                Hit the road.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/cars" className="btn-primary px-6">
                  Find a car
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </Link>
                <Link href="/locations" className="btn-ghost px-6">
                  See the map
                </Link>
              </div>
            </div>

            {/* Hero fleet cut-out */}
            <div className="relative w-full lg:-mr-6 xl:-mr-10">
              <div
                className="pointer-events-none absolute bottom-[18%] left-0 z-0 h-[42%] w-[62%] bg-lime sm:bottom-[16%] sm:h-[44%] sm:w-[58%] lg:bottom-[14%] lg:left-2 lg:h-[48%] lg:w-[56%]"
                aria-hidden
              />
              <div className="relative z-10 flex w-full flex-col justify-end">
                <TransparentCarImage
                  src={heroCar.src}
                  alt={heroCar.alt}
                  width={heroCar.width}
                  height={heroCar.height}
                  priority
                  sizes="(max-width: 1024px) 100vw, 720px"
                  className="w-full"
                  imageClassName="mx-auto w-full min-h-[220px] max-h-[min(44vh,380px)] object-contain object-bottom sm:min-h-[280px] sm:max-h-[min(50vh,460px)] md:max-h-[min(54vh,520px)] lg:min-h-[340px] lg:max-h-[min(62vh,640px)] xl:max-h-[680px] xl:min-h-[400px]"
                />
                <div className="mt-3 flex items-end justify-between gap-4 border-t border-ink/15 pt-3 sm:mt-4 sm:pt-4">
                  <div>
                    {heroCar.tag ? (
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50">
                        {heroCar.tag}
                      </p>
                    ) : null}
                    {heroCar.label ? (
                      <p className="mt-1 font-display text-xl font-black uppercase tracking-tightest text-ink">
                        {heroCar.label}
                      </p>
                    ) : null}
                  </div>
                  <ArrowUpRight size={28} strokeWidth={2} className="shrink-0 text-ink" />
                </div>
              </div>
            </div>
          </div>

          {/* Search panel */}
          <div className="mt-12 md:mt-20">
            <p className="eyebrow mb-3">01 — Search</p>
            <SearchPanel />
          </div>
        </div>
      </section>

      {/* ───────── MARQUEE STRIP ───────── */}
      <section className="border-y border-ink bg-lime py-3 overflow-hidden">
        <div className="flex animate-marquee gap-12 whitespace-nowrap font-display text-xl font-black uppercase tracking-tightest text-ink">
          {[...marqueeWords, ...marqueeWords, ...marqueeWords].map((word, i) => (
            <span key={i} className="flex items-center gap-12">
              {word}
              <MoveIcon className="h-5 w-auto" />
            </span>
          ))}
        </div>
      </section>

      {/* ───────── 3 PILLARS ───────── */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:items-end">
            <div>
              <p className="eyebrow-lime">Why MOVE</p>
              <h2 className="display mt-4 text-5xl text-ink md:text-7xl">
                Less friction.
                <br />
                More road.
              </h2>
            </div>
            <p className="text-base leading-relaxed text-ink/70 md:text-lg">
              We strip out the paperwork, the surprises, and the queues. You get a clean
              flow, a real car, and a team you can reach when it matters.
            </p>
          </div>

          <div className="mt-14 grid gap-px bg-ink/10 md:grid-cols-3">
            {[
              {
                num: '01',
                title: 'Book in 60s',
                body: 'Search dates and pickup, choose your car, confirm. That is it.',
                Icon: CalendarCheck,
              },
              {
                num: '02',
                title: 'Anywhere pickup',
                body: 'Airports, hotels, villas, agreed meeting points. Tell us where.',
                Icon: Plane,
              },
              {
                num: '03',
                title: 'Trusted fleet',
                body: 'Company-owned cars, serviced and insured. No third-party lottery.',
                Icon: ShieldCheck,
              },
            ].map(({ num, title, body, Icon }) => (
              <div
                key={num}
                className="group relative bg-white p-7 transition hover:bg-ink"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50 group-hover:text-lime">
                    {num}
                  </span>
                  <Icon size={28} strokeWidth={1.5} className="text-ink group-hover:text-lime" />
                </div>
                <h3 className="mt-12 font-display text-3xl font-black uppercase tracking-tightest text-ink group-hover:text-white">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70 group-hover:text-white/70">
                  {body}
                </p>
                <ArrowUpRight
                  size={20}
                  strokeWidth={2.5}
                  className="absolute bottom-7 right-7 text-ink/0 transition group-hover:text-lime"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── POPULAR CARS ───────── */}
      <section className="bg-bone py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow-lime">Most asked</p>
              <h2 className="display mt-4 text-5xl text-ink md:text-7xl">
                Pick a ride.
              </h2>
            </div>
            <Link
              href="/cars"
              className="group inline-flex items-center gap-2 self-start font-display text-sm font-bold uppercase tracking-[0.1em] text-ink"
            >
              Browse all cars
              <span className="lime-bar transition-all group-hover:w-16" />
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popularCars.map(({ name, tag, icon: Icon }) => (
              <Link
                key={name}
                href="/cars"
                className="group relative flex aspect-square flex-col justify-between border border-ink/10 bg-white p-6 transition hover:border-ink hover:bg-ink"
              >
                <div className="flex items-center justify-between">
                  <span className="chip-lime">{tag}</span>
                  <Icon size={24} strokeWidth={1.5} className="text-ink/60 group-hover:text-lime" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-black uppercase leading-none tracking-tightest text-ink group-hover:text-white">
                    {name}
                  </h3>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50 group-hover:text-lime">
                    From €29 / day
                  </p>
                </div>
                <ArrowUpRight
                  size={18}
                  strokeWidth={2.5}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-ink/0 transition group-hover:translate-x-1 group-hover:text-lime"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="eyebrow-lime">Three steps</p>
              <h2 className="display mt-4 text-5xl text-ink md:text-7xl">
                No maze.
              </h2>
              <div className="mt-6 inline-block diagonal-stripe h-2 w-40" />
            </div>
            <ol className="flex flex-col">
              {[
                'Search your pickup, drop-off, and dates',
                'Choose the vehicle that fits your trip',
                'Confirm — pay online or at the counter',
              ].map((step, index) => (
                <li
                  key={step}
                  className="group flex items-center justify-between gap-6 border-b border-ink/10 py-6 transition hover:pl-2"
                >
                  <div className="flex items-baseline gap-6">
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink/40">
                      0{index + 1}
                    </span>
                    <span className="font-display text-2xl font-black uppercase leading-tight tracking-tightest text-ink md:text-3xl">
                      {step}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={22}
                    strokeWidth={2.5}
                    className="shrink-0 text-ink/30 transition group-hover:text-lime"
                  />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ───────── DELIVERY + FAQ (DARK) ───────── */}
      <section className="relative overflow-hidden bg-ink py-20 text-white md:py-28">
        <div className="absolute -right-20 -top-10 hidden md:block" aria-hidden>
          <MoveIcon className="h-96 w-auto text-white/[0.04]" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-2 md:px-8">
          <div>
            <p className="eyebrow text-lime/80 before:bg-lime">Delivery</p>
            <h2 className="display mt-4 text-5xl md:text-6xl">
              Airport &<br />
              hotel pickup.
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-white/70">
              Drop your flight number or accommodation in the booking form — our
              team coordinates the handoff so the keys are waiting.
            </p>
            <Link
              href="/locations"
              className="mt-8 inline-flex items-center gap-2 border-b border-lime pb-1 font-display text-sm font-bold uppercase tracking-[0.1em] text-lime hover:gap-3"
            >
              <MapPinned size={16} />
              View locations
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
          <div className="flex flex-col">
            <p className="eyebrow text-white/50 mb-4">FAQ</p>
            {[
              {
                q: 'Can I pay later?',
                a: 'Yes — pay-at-counter is supported on most cars. Online payment via Stripe and PayPal is also available.',
              },
              {
                q: 'Can I change my pickup point?',
                a: 'Update it any time before pickup from your account. Surcharges may apply for off-station drops.',
              },
              {
                q: 'Do I need a deposit?',
                a: 'A pre-authorisation may be held depending on the car class and insurance package selected.',
              },
            ].map(({ q, a }) => (
              <details
                key={q}
                className="group border-b border-white/10 py-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-lg font-bold uppercase tracking-[0.02em]">
                  {q}
                  <span className="font-mono text-xs text-lime transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── BIG CTA ───────── */}
      <section className="relative overflow-hidden bg-lime">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-32">
          <p className="eyebrow text-ink/60 before:bg-ink">Ready to roll</p>
          <h2 className="display mt-4 text-[18vw] leading-[0.9] text-ink md:text-[14rem]">
            Move it.
          </h2>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/cars"
              className="btn-primary h-14 px-7 text-[14px] shadow-[6px_6px_0_0_#0E1A14]"
            >
              Book a car
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </Link>
            <Link href="/contact" className="btn-ghost h-14 px-7 text-[14px]">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
