import { NextRequest, NextResponse } from 'next/server'
import { signIn } from '@/lib/api/bookcars'
import { authCookieName, userCookieName } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const user = await signIn(String(body.email || ''), String(body.password || ''))

  if (!user?.accessToken || !user._id) {
    return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 })
  }

  const response = NextResponse.json({ user: { ...user, accessToken: undefined } })
  response.cookies.set(authCookieName, user.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
  response.cookies.set(userCookieName, user._id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })

  return response
}
