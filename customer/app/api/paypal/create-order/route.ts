import { NextRequest, NextResponse } from 'next/server'
import { createPayPalOrder } from '@/lib/api/bookcars'

export async function POST(request: NextRequest) {
  const body = await request.json() as {
    bookingId?: string
    amount?: number
    currency?: string
    name?: string
    description?: string
  }

  if (!body.bookingId || body.amount == null || !body.currency || !body.name) {
    return NextResponse.json({ message: 'Invalid order payload.' }, { status: 400 })
  }

  try {
    const orderId = await createPayPalOrder(
      body.bookingId,
      body.amount,
      body.currency,
      body.name,
      body.description || body.name,
    )
    return NextResponse.json({ orderId })
  } catch {
    return NextResponse.json({ message: 'PayPal order failed.' }, { status: 502 })
  }
}
