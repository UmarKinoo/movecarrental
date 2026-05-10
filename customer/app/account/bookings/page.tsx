export default function AccountBookingsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-lg border border-neutral-200 bg-white p-8">
        <p className="text-sm font-semibold uppercase text-brand-600">My bookings</p>
        <h1 className="mt-2 text-3xl font-semibold">Booking history</h1>
        <p className="mt-3 leading-7 text-neutral-600">
          The auth foundation is in place. The next slice will call BookCars `/api/bookings` through the Next.js server route and render customer bookings here.
        </p>
      </div>
    </div>
  )
}
