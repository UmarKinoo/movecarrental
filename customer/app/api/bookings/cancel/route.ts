import { NextRequest, NextResponse } from 'next/server'
import { cancelBooking } from '@/lib/api/bookcars'
import { getSession } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session?.token) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 })
  }

  const body = await request.json() as { bookingId?: string }
  if (!body.bookingId) {
    return NextResponse.json({ message: 'bookingId required.' }, { status: 400 })
  }

  const ok = await cancelBooking(session.token, body.bookingId)
  if (!ok) {
    return NextResponse.json({ message: 'Could not cancel booking.' }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
