import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

/** Legacy BookCars path was /checkout; this app uses `/booking` with query params. */
export default function CheckoutAliasPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col justify-center px-4 py-16 text-center md:px-8">
        <p className="eyebrow-lime justify-center">Redirect</p>
        <h1 className="display mt-4 text-5xl text-ink md:text-6xl">Checkout moved</h1>
        <p className="mt-5 leading-relaxed text-ink/70">
          Start from your car search and tap <strong>Continue booking</strong> on a
          vehicle. The checkout form lives at{' '}
          <code className="rounded-sm bg-bone px-1.5 py-0.5 font-mono text-sm">/booking</code>.
        </p>
        <Link href="/cars" className="btn-lime mx-auto mt-8 px-6">
          Go to cars
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  )
}
