'use client'

import { useMemo } from 'react'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

type StripeEmbeddedProps = {
  clientSecret: string
}

export function StripeEmbedded({ clientSecret }: StripeEmbeddedProps) {
  const stripePromise = useMemo(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    return key ? loadStripe(key) : null
  }, [])

  if (!stripePromise) {
    return (
      <p className="border-l-4 border-red-600 bg-red-50 p-4 font-mono text-xs uppercase tracking-[0.14em] text-red-700">
        ! Stripe publishable key is not configured.
      </p>
    )
  }

  return (
    <div className="mt-2 border-t-2 border-ink pt-6">
      <p className="eyebrow-lime mb-4">Complete payment</p>
      <EmbeddedCheckoutProvider options={{ clientSecret }} stripe={stripePromise}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
