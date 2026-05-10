import Link from 'next/link'
import { BadgeCheck, CalendarCheck, CarFront, MapPinned, Plane, ShieldCheck } from 'lucide-react'
import { SearchPanel } from '@/components/forms/search-panel'

const heroImage = 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1800&q=85'

const popularCars = ['Compact automatic', 'Family SUV', 'Convertible', '7-seater van']

export default function HomePage() {
  return (
    <div>
      <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden">
        <img src={heroImage} alt="Premium rental car on a coastal road" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />
        <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col justify-end px-4 pb-8 pt-24">
          <div className="max-w-3xl text-white">
            <p className="text-sm font-semibold uppercase tracking-normal text-white/80">Airport, hotel, and island delivery</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">Move Car Rental</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
              A clean tourist-friendly booking flow for reliable cars, clear prices, and quick pickup.
            </p>
          </div>
          <div className="mt-8 max-w-5xl">
            <SearchPanel />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-16 md:grid-cols-3">
        {[
          { title: 'Simple bookings', body: 'Search dates, choose a vehicle, and reserve in a few taps.', Icon: CalendarCheck },
          { title: 'Tourist support', body: 'Pickup at airports, hotels, villas, and agreed meeting points.', Icon: Plane },
          { title: 'Trusted fleet', body: 'Company-owned cars managed from the BookCars admin engine.', Icon: ShieldCheck },
        ].map(({ title, body, Icon }) => (
          <div key={title} className="rounded-lg border border-neutral-200 bg-white p-5">
            <Icon className="text-brand-600" size={26} />
            <h2 className="mt-5 text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{body}</p>
          </div>
        ))}
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-brand-600">Popular choices</p>
              <h2 className="mt-2 text-3xl font-semibold text-ink">Cars tourists ask for most</h2>
            </div>
            <Link href="/cars" className="text-sm font-semibold text-brand-700">Browse cars</Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {popularCars.map((name) => (
              <div key={name} className="rounded-lg border border-neutral-200 bg-paper p-5">
                <CarFront size={26} />
                <h3 className="mt-5 font-semibold">{name}</h3>
                <p className="mt-2 text-sm text-neutral-600">Availability and exact rates come from BookCars.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-semibold uppercase text-brand-600">How it works</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">Three steps, no maze</h2>
        </div>
        <div className="grid gap-4">
          {['Search your pickup and drop-off dates', 'Choose the vehicle that fits your trip', 'Reserve now and pay at the counter'].map((step, index) => (
            <div key={step} className="flex gap-4 rounded-lg border border-neutral-200 bg-white p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">{index + 1}</span>
              <p className="pt-2 font-medium">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink py-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-2">
          <div>
            <MapPinned size={30} />
            <h2 className="mt-5 text-3xl font-semibold">Airport and hotel delivery</h2>
            <p className="mt-4 leading-7 text-white/75">
              Add your flight number or accommodation details during booking so the team can coordinate collection.
            </p>
          </div>
          <div className="grid gap-3">
            {['Can I pay later?', 'Can I change my pickup point?', 'Do I need a deposit?'].map((question) => (
              <details key={question} className="rounded-lg border border-white/15 p-4">
                <summary className="cursor-pointer font-semibold">{question}</summary>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  The MVP supports pay-at-counter first. Deposit and full online payments are planned in the payment phase.
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-16 md:flex-row md:items-center md:justify-between">
        <div>
          <BadgeCheck className="text-brand-600" size={28} />
          <h2 className="mt-4 text-3xl font-semibold">Ready to move?</h2>
          <p className="mt-2 text-neutral-600">Start with your pickup date and location.</p>
        </div>
        <Link href="/" className="rounded-md bg-ink px-6 py-3 text-center text-sm font-semibold text-white">Search cars</Link>
      </section>
    </div>
  )
}
