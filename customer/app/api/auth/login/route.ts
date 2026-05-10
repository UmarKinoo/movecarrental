import { NextRequest, NextResponse } from 'next/server'
import { BookCarsApiError, signIn } from '@/lib/api/bookcars'
import { authCookieName, userCookieName } from '@/lib/auth/session'

const INVALID_SIGN_IN =
  'Sign-in was rejected. Check your email and password. This page is for rental customers only: admin and supplier accounts must use the admin app (usually port 3001), not the storefront login.'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = String(body.email || '').trim()
    const password = String(body.password || '')

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 })
    }

    const user = await signIn(email, password)

    if (!user?.accessToken || !user._id) {
      return NextResponse.json({ message: INVALID_SIGN_IN }, { status: 401 })
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
  } catch (error) {
    if (error instanceof BookCarsApiError) {
      const status = error.status >= 400 && error.status < 600 ? error.status : 502
      return NextResponse.json({ message: error.message }, { status })
    }
    return NextResponse.json({ message: 'Sign-in failed unexpectedly.' }, { status: 500 })
  }
}
