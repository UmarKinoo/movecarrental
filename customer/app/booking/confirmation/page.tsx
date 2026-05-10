import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

type ConfirmationPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const params = await searchParams
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="rounded-lg border border-neutral-200 bg-white p-8 shadow-soft">
        <CheckCircle2 className="mx-auto text-emerald-600" size={44} />
        <h1 className="mt-5 text-3xl font-semibold">Booking request received</h1>
        {id && <p className="mt-3 text-sm font-medium text-neutral-600">Reference: {id}</p>}
        <p className="mt-4 leading-7 text-neutral-600">
          We sent the booking to BookCars. The rental team can manage it from the admin panel and follow up with the customer.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-md bg-ink px-6 py-3 text-sm font-semibold text-white">
          Back home
        </Link>
      </div>
    </div>
  )
}
