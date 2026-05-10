import { NextRequest, NextResponse } from 'next/server'
import { signUp } from '@/lib/api/bookcars'

export async function POST(request: NextRequest) {
  const body = await request.json()
  await signUp({
    fullName: String(body.fullName || ''),
    email: String(body.email || ''),
    phone: String(body.phone || ''),
    password: String(body.password || ''),
  })

  return NextResponse.json({ ok: true })
}
