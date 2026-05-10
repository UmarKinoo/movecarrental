import { NextRequest, NextResponse } from 'next/server'
import { resendActivationOrReset } from '@/lib/api/bookcars'

export async function POST(request: NextRequest) {
  const body = await request.json() as { email?: string }
  const email = String(body.email || '').trim()
  if (!email) {
    return NextResponse.json({ message: 'Email required.' }, { status: 400 })
  }

  await resendActivationOrReset(email, true)
  return NextResponse.json({ ok: true })
}
