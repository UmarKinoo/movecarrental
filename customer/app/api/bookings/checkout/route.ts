import { NextRequest, NextResponse } from 'next/server'
import { BookCarsApiError, checkoutBooking, verifyRecaptcha } from '@/lib/api/bookcars'
import { bookCarsConfig } from '@/lib/api/config'
import type { BookingCheckoutInput } from '@/lib/types/bookcars'
import { getSession } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as BookingCheckoutInput

    if (!body.carId || !body.pickupLocation || !body.dropOffLocation || !body.from || !body.to) {
      return NextResponse.json({ message: 'Missing booking details.' }, { status: 400 })
    }

    const session = await getSession()
    const authenticatedUserId = session?.userId

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

    if (!authenticatedUserId) {
      if (!body.driver?.fullName || !body.driver.email || !body.driver.phone) {
        return NextResponse.json({ message: 'Driver name, email, and phone are required.' }, { status: 400 })
      }
    }

    const result = await checkoutBooking({
      ...body,
      authenticatedUserId,
      driver: body.driver || { fullName: '', email: '', phone: '' },
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof BookCarsApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }

    return NextResponse.json({ message: 'Checkout failed.' }, { status: 500 })
  }
}
