import { NextRequest, NextResponse } from 'next/server'
import { BookCarsApiError, changePassword } from '@/lib/api/bookcars'
import { getSession } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session?.token) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 })
  }

  const body = await request.json() as { currentPassword?: string; newPassword?: string }
  if (!body.currentPassword || !body.newPassword) {
    return NextResponse.json({ message: 'Missing passwords.' }, { status: 400 })
  }

  try {
    await changePassword(session.token, session.userId, body.currentPassword, body.newPassword)
    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof BookCarsApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    return NextResponse.json({ message: 'Password change failed.' }, { status: 400 })
  }
}
