import { NextRequest, NextResponse } from 'next/server'
import { checkCheckoutSession, getBookingIdBySession } from '@/lib/api/bookcars'

export async function POST(request: NextRequest) {
  const body = await request.json() as { sessionId?: string }
  if (!body.sessionId) {
    return NextResponse.json({ message: 'sessionId required.' }, { status: 400 })
  }

  const status = await checkCheckoutSession(body.sessionId)
  if (status !== 200) {
    return NextResponse.json({ ok: false, status }, { status: 200 })
  }

  const bookingId = await getBookingIdBySession(body.sessionId)
  return NextResponse.json({ ok: true, bookingId })
}
