import { NextResponse } from 'next/server'
import { getUser } from '@/lib/api/bookcars'
import { getSession } from '@/lib/auth/session'

export async function GET() {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const user = await getUser(session.userId, session.token)
  return NextResponse.json({ user })
}
