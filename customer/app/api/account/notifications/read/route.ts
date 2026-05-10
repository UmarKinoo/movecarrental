import { NextRequest, NextResponse } from 'next/server'
import { getNotifications, markNotificationsRead } from '@/lib/api/bookcars'
import { getSession } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session?.token) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 })
  }

  const body = await request.json() as { userId?: string }
  const userId = body.userId || session.userId
  if (userId !== session.userId) {
    return NextResponse.json({ message: 'Forbidden.' }, { status: 403 })
  }

  const { items } = await getNotifications(userId, 1, 50, session.token)
  const ids = items.filter((n) => !n.isRead).map((n) => n._id)
  await markNotificationsRead(userId, ids, session.token)
  return NextResponse.json({ ok: true })
}
