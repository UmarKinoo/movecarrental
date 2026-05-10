import { NextRequest, NextResponse } from 'next/server'
import { activateAccount } from '@/lib/api/bookcars'

export async function POST(request: NextRequest) {
  const body = await request.json() as { userId?: string; token?: string; password?: string }
  if (!body.userId || !body.token || !body.password) {
    return NextResponse.json({ message: 'Missing fields.' }, { status: 400 })
  }

  const ok = await activateAccount(body.userId, body.token, body.password)
  if (!ok) {
    return NextResponse.json({ message: 'Activation failed.' }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
