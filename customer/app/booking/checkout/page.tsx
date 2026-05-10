export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-lg border border-neutral-200 bg-white p-8">
        <p className="text-sm font-semibold uppercase text-brand-600">Checkout</p>
        <h1 className="mt-2 text-3xl font-semibold">Online payments phase</h1>
        <p className="mt-3 leading-7 text-neutral-600">
          The first MVP slice reserves bookings with pay-at-counter. Stripe deposit and full payment will plug into this page next.
        </p>
      </div>
    </div>
  )
}
