import { NextRequest, NextResponse } from 'next/server'
import { updateUser } from '@/lib/api/bookcars'
import { getSession } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session?.token) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 })
  }

  const body = await request.json() as {
    fullName?: string
    phone?: string
    bio?: string
    location?: string
    birthDate?: string
    enableEmailNotifications?: boolean
  }

  try {
    await updateUser(session.token, {
      _id: session.userId,
      ...body,
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ message: 'Update failed.' }, { status: 400 })
  }
}
