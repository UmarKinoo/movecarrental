import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-neutral-600 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="font-semibold text-ink">Move Car Rental</p>
          <p className="mt-3 max-w-md leading-6">
            Tourist-friendly car rental with clear pricing, flexible pickup, and a simple booking flow built on the BookCars API.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/cars">Cars</Link>
          <Link href="/account/bookings">My bookings</Link>
          <Link href="/booking/confirmation">Confirmation</Link>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <a href="mailto:hello@movecarrental.com">hello@movecarrental.com</a>
        </div>
      </div>
    </footer>
  )
}
