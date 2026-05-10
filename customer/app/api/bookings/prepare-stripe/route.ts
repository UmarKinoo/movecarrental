import { NextRequest, NextResponse } from 'next/server'
import {
  BookCarsApiError,
  buildStripePaymentPayload,
  checkoutBooking,
  createCheckoutSession,
  getCar,
  getUser,
  verifyRecaptcha,
} from '@/lib/api/bookcars'
import { bookCarsConfig } from '@/lib/api/config'
import type { BookingCheckoutInput } from '@/lib/types/bookcars'
import { getSession } from '@/lib/auth/session'
import { calculateTotalRentalPrice } from '@/lib/utils/total-price'

export async function POST(request: NextRequest) {
  try {
    if (bookCarsConfig.paymentGateway !== 'stripe') {
      return NextResponse.json({ message: 'Stripe is not the configured payment gateway.' }, { status: 400 })
    }

    const body = await request.json() as BookingCheckoutInput & { recaptchaToken?: string }

    if (bookCarsConfig.recaptchaSiteKey) {
      if (!body.recaptchaToken) {
        return NextResponse.json({ message: 'reCAPTCHA is required.' }, { status: 400 })
      }
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '0.0.0.0'
      const ok = await verifyRecaptcha(body.recaptchaToken, ip)
      if (!ok) {
        return NextResponse.json({ message: 'reCAPTCHA verification failed.' }, { status: 400 })
      }
    }
    if (!body.carId || !body.pickupLocation || !body.dropOffLocation || !body.from || !body.to) {
      return NextResponse.json({ message: 'Missing booking details.' }, { status: 400 })
    }

    if (body.paymentOption === 'counter') {
      return NextResponse.json({ message: 'Use the standard checkout for pay-at-counter.' }, { status: 400 })
    }

    const session = await getSession()
    const authenticatedUserId = session?.userId
    let email = body.driver?.email || ''
    let fullName = body.driver?.fullName || ''
    let locale = bookCarsConfig.defaultLanguage

    if (authenticatedUserId && session?.token) {
      const user = await getUser(authenticatedUserId, session.token)
      if (user) {
        email = user.email
        fullName = user.fullName
        locale = user.language || locale
      }
    } else {
      if (!email || !fullName) {
        return NextResponse.json({ message: 'Email and full name are required for payment.' }, { status: 400 })
      }
    }

    const car = await getCar(body.carId)
    if (!car) {
      return NextResponse.json({ message: 'Car not found.' }, { status: 404 })
    }

    const priceChangeRate = car.supplier.priceChangeRate || 0
    const options = {
      cancellation: !!body.cancellation,
      amendments: !!body.amendments,
      theftProtection: !!body.theftProtection,
      collisionDamageWaiver: !!body.collisionDamageWaiver,
      fullInsurance: !!body.fullInsurance,
      additionalDriver: !!body.additionalDriver,
    }
    const price = calculateTotalRentalPrice(car, body.from, body.to, priceChangeRate, options)
    let depositAmount = Number(car.deposit) || 0
    depositAmount += depositAmount * (priceChangeRate / 100)

    let paymentLine = price
    if (body.paymentOption === 'deposit') {
      paymentLine = depositAmount
    } else if (body.paymentOption === 'full') {
      paymentLine = price + depositAmount
    }

    const pickupLabel =
      body.pickupLocationName && body.dropOffLocationName
        ? `${body.pickupLocationName} – ${body.dropOffLocationName}`
        : 'Pickup and drop-off'

    const stripePayload = buildStripePaymentPayload({
      carName: car.name,
      pickupLabel,
      email,
      fullName,
      locale,
      amount: paymentLine,
    })

    const paymentSession = await createCheckoutSession(stripePayload)
    if (!paymentSession?.clientSecret || !paymentSession.sessionId || !paymentSession.customerId) {
      return NextResponse.json({ message: 'Could not start Stripe checkout.' }, { status: 502 })
    }

    const checkout = await checkoutBooking({
      ...body,
      authenticatedUserId,
      driver: {
        fullName: body.driver?.fullName || fullName,
        email: body.driver?.email || email,
        phone: body.driver?.phone || '',
      },
      sessionId: paymentSession.sessionId,
      customerId: paymentSession.customerId,
      payPal: false,
    })

    return NextResponse.json({
      clientSecret: paymentSession.clientSecret,
      bookingId: checkout.bookingId,
    })
  } catch (error) {
    if (error instanceof BookCarsApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    return NextResponse.json({ message: 'Payment preparation failed.' }, { status: 500 })
  }
}
