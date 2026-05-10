import { NextRequest, NextResponse } from 'next/server'
import { BookCarsApiError, checkoutBooking } from '@/lib/api/bookcars'
import type { BookingCheckoutInput } from '@/lib/types/bookcars'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as BookingCheckoutInput

    if (!body.carId || !body.pickupLocation || !body.dropOffLocation || !body.from || !body.to) {
      return NextResponse.json({ message: 'Missing booking details.' }, { status: 400 })
    }

    if (!body.driver?.fullName || !body.driver.email || !body.driver.phone) {
      return NextResponse.json({ message: 'Driver name, email, and phone are required.' }, { status: 400 })
    }

    const result = await checkoutBooking(body)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof BookCarsApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }

    return NextResponse.json({ message: 'Checkout failed.' }, { status: 500 })
  }
}
