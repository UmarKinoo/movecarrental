'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import type { Car, Location } from '@/lib/types/bookcars'
import type { RentalOptionKey } from '@/lib/utils/car-display'
import { bookCarsConfig } from '@/lib/api/config'
import { formatMoney, rentalDays } from '@/lib/utils/pricing'
import { calculateTotalRentalPrice } from '@/lib/utils/total-price'
import {
  FUEL_POLICY_LABELS,
  GEARBOX_LABELS,
  RENTAL_OPTIONS,
  formatDateTime,
  getOptionAmount,
  getOptionSummary,
} from '@/lib/utils/car-display'
import { StripeEmbedded } from '@/components/booking/stripe-embedded'

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''

type BookingFormProps = {
  car: Car
  pickupLocation?: Location | null
  dropOffLocation?: Location | null
  pickupLocationName?: string
  dropOffLocationName?: string
  from: string
  to: string
  estimatedPrice: number
  paymentGateway: 'stripe' | 'payPal'
  isLoggedIn?: boolean
  /** Logged-in user id — required to save license on profile before checkout */
  userId?: string
  /** Filename of license already stored on the user profile (CDN), if any */
  profileLicense?: string
  defaultFullName?: string
  defaultEmail?: string
  defaultPhone?: string
}

async function getRecaptchaToken(): Promise<string | undefined> {
  if (!recaptchaSiteKey || typeof window === 'undefined') {
    return undefined
  }
  const g = (
    window as unknown as {
      grecaptcha?: {
        ready: (fn: () => void) => void
        execute: (siteKey: string, opts: { action: string }) => Promise<string>
      }
    }
  ).grecaptcha
  if (!g) {
    return undefined
  }
  return new Promise((resolve) => {
    g.ready(() => {
      g.execute(recaptchaSiteKey, { action: 'checkout' })
        .then((t) => resolve(t))
        .catch(() => resolve(undefined))
    })
  })
}

function ageFromBirthDate(value: string) {
  const birthDate = new Date(value)
  if (!Number.isFinite(birthDate.getTime())) {
    return 0
  }
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDelta = today.getMonth() - birthDate.getMonth()
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1
  }
  return age
}

export function BookingForm({
  car,
  pickupLocation,
  dropOffLocation,
  pickupLocationName,
  dropOffLocationName,
  from,
  to,
  estimatedPrice: _initialEstimate,
  paymentGateway,
  isLoggedIn,
  userId,
  profileLicense,
  defaultFullName,
  defaultEmail,
  defaultPhone,
}: BookingFormProps) {
  const router = useRouter()
  const priceChangeRate = car.supplier.priceChangeRate || 0

  const [paymentOption, setPaymentOption] = useState<'counter' | 'deposit' | 'full'>(
    car.supplier.payLater === false ? (car.deposit > 0 ? 'deposit' : 'full') : 'counter',
  )
  const [cancellation, setCancellation] = useState(false)
  const [amendments, setAmendments] = useState(false)
  const [theftProtection, setTheftProtection] = useState(false)
  const [collisionDamageWaiver, setCollisionDamageWaiver] = useState(false)
  const [fullInsurance, setFullInsurance] = useState(false)
  const [additionalDriver, setAdditionalDriver] = useState(false)

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null)
  const [payPalBookingId, setPayPalBookingId] = useState<string | null>(null)
  const [payPalAmount, setPayPalAmount] = useState<number>(0)
  const [payPalCurrency, setPayPalCurrency] = useState('usd')
  const [payPalName, setPayPalName] = useState('')
  const [payPalDescription, setPayPalDescription] = useState('')

  const licenseRequired = !!car.supplier.licenseRequired
  const hasProfileLicense = !!profileLicense
  const licenseFieldRequired = licenseRequired && (!isLoggedIn || !hasProfileLicense)

  useEffect(() => {
    if (!recaptchaSiteKey) {
      return
    }
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`
    script.async = true
    document.body.appendChild(script)
    return () => {
      script.remove()
    }
  }, [])

  useEffect(() => {
    setCancellation(car.cancellation === 0)
    setAmendments(car.amendments === 0)
    setTheftProtection(car.theftProtection === 0)
    setCollisionDamageWaiver(car.collisionDamageWaiver === 0)
    setFullInsurance(car.fullInsurance === 0)
    setAdditionalDriver(car.additionalDriver === 0)
  }, [car._id, car.amendments, car.additionalDriver, car.cancellation, car.collisionDamageWaiver, car.fullInsurance, car.theftProtection])

  useEffect(() => {
    if (car.supplier.payLater === false && paymentOption === 'counter') {
      setPaymentOption(car.deposit > 0 ? 'deposit' : 'full')
    }
    if (car.deposit <= 0 && paymentOption === 'deposit') {
      setPaymentOption(car.supplier.payLater === false ? 'full' : 'counter')
    }
  }, [car.deposit, car.supplier.payLater, paymentOption])

  const options = useMemo(
    () => ({
      cancellation,
      amendments,
      theftProtection,
      collisionDamageWaiver,
      fullInsurance,
      additionalDriver,
    }),
    [additionalDriver, amendments, cancellation, collisionDamageWaiver, fullInsurance, theftProtection],
  )

  const liveTotal = useMemo(
    () => calculateTotalRentalPrice(car, from, to, priceChangeRate, options),
    [car, from, options, priceChangeRate, to],
  )

  const days = rentalDays(from, to)

  let depositAmount = Number(car.deposit) || 0
  depositAmount += depositAmount * (priceChangeRate / 100)

  const minimumAge = Number(car.minimumAge) || 0
  const canPayAtCounter = car.supplier.payLater !== false
  const canPayDeposit = depositAmount > 0
  const additionalDriverNeedsDetails = additionalDriver && car.additionalDriver > 0

  const paymentLine =
    paymentOption === 'deposit' ? depositAmount : paymentOption === 'full' ? liveTotal + depositAmount : 0
  const averageDailyPrice = days > 0 ? liveTotal / days : liveTotal

  const setRentalOption = (key: RentalOptionKey, checked: boolean) => {
    if (Number(car[key]) <= 0 || stripeClientSecret || payPalBookingId) {
      return
    }
    switch (key) {
      case 'cancellation':
        setCancellation(checked)
        break
      case 'amendments':
        setAmendments(checked)
        break
      case 'theftProtection':
        setTheftProtection(checked)
        break
      case 'collisionDamageWaiver':
        setCollisionDamageWaiver(checked)
        break
      case 'fullInsurance':
        setFullInsurance(checked)
        break
      case 'additionalDriver':
        setAdditionalDriver(checked)
        break
    }
  }

  const buildPayload = async (formData: FormData, recaptchaToken?: string) => {
    if (!pickupLocation?._id) {
      throw new Error('Pickup location is required.')
    }
    if (new Date(to).getTime() <= new Date(from).getTime()) {
      throw new Error('Drop-off date must be after pickup date.')
    }
    if (paymentOption === 'counter' && !canPayAtCounter) {
      throw new Error('Pay at counter is not available for this vehicle.')
    }
    if (paymentOption === 'deposit' && !canPayDeposit) {
      throw new Error('Deposit payment is not available for this vehicle.')
    }

    const licenseFile = formData.get('license') as File | null
    let licenseFilename: string | undefined

    if (licenseRequired) {
      const hasNewFile = !!(licenseFile && licenseFile.size > 0)
      if (isLoggedIn && userId) {
        if (hasNewFile) {
          const fd = new FormData()
          fd.append('file', licenseFile)
          const up = await fetch('/api/account/license', { method: 'POST', body: fd })
          const name = await up.json()
          if (!up.ok || typeof name !== 'string') {
            throw new Error(
              typeof name === 'object' && name && 'message' in name && typeof name.message === 'string'
                ? name.message
                : 'License upload failed.',
            )
          }
        } else if (!hasProfileLicense) {
          throw new Error('Driver license upload is required.')
        }
      } else {
        if (!hasNewFile) {
          throw new Error('Driver license upload is required.')
        }
        const fd = new FormData()
        fd.append('file', licenseFile)
        const up = await fetch('/api/upload/license', { method: 'POST', body: fd })
        const name = await up.json()
        if (!up.ok || typeof name !== 'string') {
          throw new Error(
            typeof name === 'object' && name && 'message' in name && typeof name.message === 'string'
              ? name.message
              : 'License upload failed.',
          )
        }
        licenseFilename = name
      }
    }

    const additionalDriverDetails =
      additionalDriverNeedsDetails
        ? {
            fullName: String(formData.get('adFullName') || ''),
            email: String(formData.get('adEmail') || ''),
            phone: String(formData.get('adPhone') || ''),
            birthDate: String(formData.get('adBirthDate') || ''),
          }
        : undefined

    if (additionalDriverNeedsDetails && additionalDriverDetails) {
      if (
        !additionalDriverDetails.fullName
        || !additionalDriverDetails.email
        || !additionalDriverDetails.phone
        || !additionalDriverDetails.birthDate
      ) {
        throw new Error('Please complete additional driver details.')
      }
      if (minimumAge && ageFromBirthDate(additionalDriverDetails.birthDate) < minimumAge) {
        throw new Error(`Additional driver must be at least ${minimumAge}.`)
      }
    }

    const driver = {
      fullName: String(formData.get('fullName') || ''),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      birthDate: isLoggedIn ? undefined : String(formData.get('birthDate') || '') || undefined,
      license: licenseFilename,
    }

    if (!driver.fullName || !driver.email || !driver.phone) {
      throw new Error('Please complete driver name, email, and phone.')
    }

    if (!isLoggedIn) {
      if (!driver.birthDate) {
        throw new Error('Date of birth is required.')
      }
      if (minimumAge && ageFromBirthDate(driver.birthDate) < minimumAge) {
        throw new Error(`Driver must be at least ${minimumAge}.`)
      }
      if (formData.get('tos') !== 'on') {
        throw new Error('Please accept the terms and conditions.')
      }
    }

    return {
      carId: car._id,
      pickupLocation: pickupLocation?._id || '',
      dropOffLocation: dropOffLocation?._id || pickupLocation?._id || '',
      pickupLocationName: pickupLocationName || pickupLocation?.name,
      dropOffLocationName: dropOffLocationName || dropOffLocation?.name || pickupLocation?.name,
      from,
      to,
      paymentOption,
      driver,
      cancellation,
      amendments,
      theftProtection,
      collisionDamageWaiver,
      fullInsurance,
      additionalDriver,
      additionalDriverDetails,
      flightNumber: String(formData.get('flightNumber') || ''),
      accommodation: String(formData.get('accommodation') || ''),
      notes: String(formData.get('notes') || ''),
      recaptchaToken,
    }
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    setStripeClientSecret(null)
    setPayPalBookingId(null)

    const formData = new FormData(event.currentTarget)

    try {
      const recaptchaToken = (await getRecaptchaToken()) || undefined

      if (bookCarsConfig.recaptchaSiteKey && !recaptchaToken) {
        throw new Error('reCAPTCHA could not be verified. Refresh and try again.')
      }

      const base = await buildPayload(formData, recaptchaToken)

      if (paymentOption === 'counter') {
        const response = await fetch('/api/bookings/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(base),
        })
        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload.message || 'Booking failed.')
        }
        router.push(`/booking/confirmation?id=${payload.bookingId}`)
        return
      }

      if (paymentGateway === 'stripe') {
        const response = await fetch('/api/bookings/prepare-stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(base),
        })
        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload.message || 'Could not start payment.')
        }
        if (!payload.clientSecret) {
          throw new Error('Missing Stripe client secret.')
        }
        setStripeClientSecret(payload.clientSecret)
        return
      }

      const response = await fetch('/api/bookings/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...base, payPal: true }),
      })
      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.message || 'Booking failed.')
      }
      if (!payload.payPalMeta) {
        throw new Error('PayPal metadata missing.')
      }
      setPayPalBookingId(payload.bookingId)
      setPayPalAmount(payload.payPalMeta.amount)
      setPayPalCurrency(String(payload.payPalMeta.currency || 'usd'))
      setPayPalName(payload.payPalMeta.name)
      setPayPalDescription(payload.payPalMeta.description)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''

  return (
    <div className="grid gap-6 border border-ink/10 bg-white p-6 shadow-soft md:p-8">
      <div className="border-b border-ink/10 pb-6">
        <p className="eyebrow-lime">Step 02 — Booking</p>
        <h1 className="display mt-3 text-4xl text-ink md:text-5xl">{car.name}</h1>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/60">
          {pickupLocation?.name || 'Pickup'} → {dropOffLocation?.name || pickupLocation?.name || 'Drop-off'}
        </p>
      </div>

      <div className="grid gap-5 border-l-2 border-lime bg-bone p-5 md:grid-cols-2">
        <div>
          <span className="eyebrow block">Pickup</span>
          <span className="mt-1.5 block font-display text-base font-bold text-ink">{pickupLocation?.name || 'Selected location'}</span>
          <span className="mt-0.5 block font-mono text-xs text-ink/60">{formatDateTime(from)}</span>
        </div>
        <div>
          <span className="eyebrow block">Drop-off</span>
          <span className="mt-1.5 block font-display text-base font-bold text-ink">
            {dropOffLocation?.name || pickupLocation?.name || 'Selected location'}
          </span>
          <span className="mt-0.5 block font-mono text-xs text-ink/60">{formatDateTime(to)}</span>
        </div>
        <div>
          <span className="eyebrow block">Vehicle</span>
          <span className="mt-1.5 block font-display text-base font-bold text-ink">
            {GEARBOX_LABELS[car.gearbox] || car.gearbox} · {car.seats} seats · {car.doors} doors
          </span>
          <span className="mt-0.5 block font-mono text-xs text-ink/60">
            {FUEL_POLICY_LABELS[car.fuelPolicy] || car.fuelPolicy}
            {minimumAge ? ` · Min age ${minimumAge}` : ''}
          </span>
        </div>
        <div>
          <span className="eyebrow block">Price</span>
          <span className="mt-1.5 block font-display text-base font-bold text-ink">
            {formatMoney(liveTotal, bookCarsConfig.defaultCurrency)} · {days} {days === 1 ? 'day' : 'days'}
          </span>
          <span className="mt-0.5 block font-mono text-xs text-ink/60">
            ~ {formatMoney(averageDailyPrice, bookCarsConfig.defaultCurrency)}/day
          </span>
        </div>
      </div>

      {!stripeClientSecret && !payPalBookingId ? (
        <form onSubmit={onSubmit} className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="field">
              <span className="field-label">Driver name</span>
              <input className="field-control" name="fullName" required defaultValue={defaultFullName} />
            </label>
            <label className="field">
              <span className="field-label">Email</span>
              <input className="field-control" type="email" name="email" required defaultValue={defaultEmail} />
            </label>
            <label className="field">
              <span className="field-label">Phone / WhatsApp</span>
              <input className="field-control" name="phone" required defaultValue={defaultPhone} />
            </label>
            {!isLoggedIn ? (
              <>
                <label className="field">
                  <span className="field-label">
                    Date of birth{minimumAge ? ` (driver must be ${minimumAge}+)` : ''}
                  </span>
                  <input className="field-control" name="birthDate" type="date" required />
                </label>
                <label className="flex items-start gap-3 rounded-md border border-neutral-200 p-3 text-sm md:col-span-2">
                  <input name="tos" type="checkbox" required className="mt-1" />
                  <span className="text-neutral-700">
                    I agree to the{' '}
                    <Link href="/terms" className="font-semibold text-ink underline">
                      terms
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="font-semibold text-ink underline">
                      privacy policy
                    </Link>
                    .
                  </span>
                </label>
              </>
            ) : null}
            <label className="field">
              <span className="field-label">Flight number</span>
              <input className="field-control" name="flightNumber" placeholder="Optional" />
            </label>
            <label className="field md:col-span-2">
              <span className="field-label">Hotel / accommodation</span>
              <input className="field-control" name="accommodation" placeholder="Optional" />
            </label>
            <label className="field md:col-span-2">
              <span className="field-label">Notes</span>
              <textarea className="field-area" name="notes" placeholder="Optional" />
            </label>
          </div>

          {licenseRequired ? (
            <label className="field">
              <span className="field-label">
                Driver license (image or PDF)
                {hasProfileLicense ? (
                  <span className="ml-1 font-normal text-neutral-500">— on file; upload to replace</span>
                ) : null}
              </span>
              <input
                className="field-control"
                name="license"
                type="file"
                accept="image/*,.pdf"
                required={licenseFieldRequired}
              />
            </label>
          ) : null}

          <fieldset className="grid gap-3 border border-ink/10 p-5">
            <legend className="px-1 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink/70">Booking options</legend>
            {RENTAL_OPTIONS.map((option) => {
              const rawValue = Number(car[option.key])
              const checked = options[option.key]
              const disabled = rawValue <= 0 || !!stripeClientSecret || !!payPalBookingId
              const included = rawValue === 0
              const unavailable = rawValue === -1
              const amount = getOptionAmount(car, option.key, days, priceChangeRate)

              return (
                <label
                  key={option.key}
                  className={`flex items-start justify-between gap-3 border p-3 text-sm transition ${
                    disabled
                      ? 'border-ink/10 bg-bone text-ink/45'
                      : checked
                        ? 'border-ink bg-lime/15'
                        : 'border-ink/15 bg-white hover:border-ink/40'
                  }`}
                >
                  <span className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={(event) => setRentalOption(option.key, event.target.checked)}
                      className="mt-1 h-4 w-4 accent-lime"
                    />
                    <span>
                      <span className="block font-display text-sm font-bold uppercase tracking-[0.04em] text-ink">{option.label}</span>
                      <span className="mt-1 block text-xs text-ink/65">
                        {unavailable
                          ? 'Not available for this vehicle'
                          : included
                            ? 'Included in this rental'
                            : getOptionSummary(car, option.key, days, bookCarsConfig.defaultCurrency, priceChangeRate)}
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0 text-right font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
                    {included ? '✓ Included' : amount > 0 ? `+${formatMoney(amount, bookCarsConfig.defaultCurrency)}` : ''}
                  </span>
                </label>
              )
            })}
          </fieldset>

          {additionalDriverNeedsDetails ? (
            <div className="grid gap-4 border-2 border-dashed border-ink/25 p-5 md:grid-cols-2">
              <p className="eyebrow-lime md:col-span-2">Additional driver</p>
              <label className="field">
                <span className="field-label">Full name</span>
                <input className="field-control" name="adFullName" required={additionalDriverNeedsDetails} />
              </label>
              <label className="field">
                <span className="field-label">Email</span>
                <input className="field-control" type="email" name="adEmail" required={additionalDriverNeedsDetails} />
              </label>
              <label className="field">
                <span className="field-label">Phone</span>
                <input className="field-control" name="adPhone" required={additionalDriverNeedsDetails} />
              </label>
              <label className="field">
                <span className="field-label">Birth date{minimumAge ? ` (${minimumAge}+)` : ''}</span>
                <input className="field-control" type="date" name="adBirthDate" required={additionalDriverNeedsDetails} />
              </label>
            </div>
          ) : null}

          <fieldset className="grid gap-3 border border-ink/10 p-5">
            <legend className="px-1 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink/70">Payment option</legend>
            {canPayAtCounter ? (
              <PayOption
                checked={paymentOption === 'counter'}
                onChange={() => setPaymentOption('counter')}
                title="Pay at counter"
                desc={`Reserve now; pay ${formatMoney(liveTotal, bookCarsConfig.defaultCurrency)} when you collect the car.`}
              />
            ) : null}
            {canPayDeposit ? (
              <PayOption
                checked={paymentOption === 'deposit'}
                onChange={() => setPaymentOption('deposit')}
                title="Pay deposit online"
                desc={`${paymentGateway === 'stripe' ? 'Stripe Checkout' : 'PayPal'} · Charge today: ${formatMoney(depositAmount, bookCarsConfig.defaultCurrency)}`}
              />
            ) : null}
            <PayOption
              checked={paymentOption === 'full'}
              onChange={() => setPaymentOption('full')}
              title="Pay in full online"
              desc={`Rental + deposit: ${formatMoney(liveTotal + depositAmount, bookCarsConfig.defaultCurrency)}`}
            />
          </fieldset>

          <div className="grid gap-3 border border-ink/10 p-5 text-sm">
            <p className="eyebrow-lime">Pickup checklist</p>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <span className="block font-display text-sm font-bold uppercase tracking-[0.04em] text-ink">Arrive on time</span>
                <span className="mt-1 block text-xs leading-relaxed text-ink/65">
                  Please be ready at the pickup point for {formatDateTime(from)}.
                </span>
              </div>
              <div>
                <span className="block font-display text-sm font-bold uppercase tracking-[0.04em] text-ink">Bring documents</span>
                <span className="mt-1 block text-xs leading-relaxed text-ink/65">
                  Driver license, passport or ID, and the card used for any online payment.
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t-2 border-ink pt-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Estimated rental</p>
              <p className="display mt-2 text-4xl text-ink">{formatMoney(liveTotal, bookCarsConfig.defaultCurrency)}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/65">
                {paymentOption === 'counter'
                  ? '— No online charge today'
                  : `— Charge today: ${formatMoney(paymentLine, bookCarsConfig.defaultCurrency)}`}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45">
                Reference only — final total from BookCars.
              </p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-lime h-14 px-8 text-[14px] shadow-[6px_6px_0_0_#0E1A14] disabled:shadow-none"
            >
              {submitting ? 'Processing…' : paymentOption === 'counter' ? 'Confirm booking' : 'Continue to payment'}
            </button>
          </div>
        </form>
      ) : null}

      {stripeClientSecret ? <StripeEmbedded clientSecret={stripeClientSecret} /> : null}

      {payPalBookingId && paypalClientId ? (
        <PayPalScriptProvider options={{ clientId: paypalClientId, currency: payPalCurrency.toUpperCase() }}>
          <div className="mt-4">
            <p className="mb-2 text-sm font-semibold">Pay with PayPal</p>
            <PayPalButtons
              style={{ layout: 'vertical' }}
              createOrder={async () => {
                const response = await fetch('/api/paypal/create-order', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    bookingId: payPalBookingId,
                    amount: payPalAmount,
                    currency: payPalCurrency,
                    name: payPalName,
                    description: payPalDescription,
                  }),
                })
                const data = await response.json()
                if (!response.ok) {
                  throw new Error(data.message || 'PayPal order failed')
                }
                return data.orderId
              }}
              onApprove={async (data) => {
                const response = await fetch('/api/paypal/complete', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ bookingId: payPalBookingId, orderId: data.orderID }),
                })
                const payload = await response.json()
                if (payload.ok) {
                  router.push(`/booking/confirmation?id=${payPalBookingId}`)
                } else {
                  setError('PayPal payment could not be confirmed.')
                }
              }}
            />
          </div>
        </PayPalScriptProvider>
      ) : null}

      {payPalBookingId && !paypalClientId ? (
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-red-700">! Set NEXT_PUBLIC_PAYPAL_CLIENT_ID to enable PayPal.</p>
      ) : null}

      {error ? (
        <p className="border-l-4 border-red-600 bg-red-50 p-4 font-mono text-xs uppercase tracking-[0.14em] text-red-700">
          ! {error}
        </p>
      ) : null}
    </div>
  )
}

function PayOption({
  checked,
  onChange,
  title,
  desc,
}: {
  checked: boolean
  onChange: () => void
  title: string
  desc: string
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 border p-3 transition ${
        checked ? 'border-ink bg-lime/15' : 'border-ink/15 bg-white hover:border-ink/40'
      }`}
    >
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 accent-lime"
      />
      <span>
        <span className="block font-display text-sm font-bold uppercase tracking-[0.04em] text-ink">{title}</span>
        <span className="mt-1 block text-xs text-ink/65">{desc}</span>
      </span>
    </label>
  )
}
