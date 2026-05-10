import { NextResponse } from 'next/server'
import { authCookieName, userCookieName } from '@/lib/auth/session'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete(authCookieName)
  response.cookies.delete(userCookieName)
  return response
}
