import { NextRequest, NextResponse } from 'next/server'
import { checkPayPalOrder } from '@/lib/api/bookcars'

export async function POST(request: NextRequest) {
  const body = await request.json() as { bookingId?: string; orderId?: string }
  if (!body.bookingId || !body.orderId) {
    return NextResponse.json({ message: 'bookingId and orderId required.' }, { status: 400 })
  }

  const status = await checkPayPalOrder(body.bookingId, body.orderId)
  if (status !== 200) {
    return NextResponse.json({ ok: false, status }, { status: 200 })
  }

  return NextResponse.json({ ok: true })
}
