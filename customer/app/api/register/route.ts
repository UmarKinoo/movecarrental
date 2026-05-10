import { NextRequest, NextResponse } from 'next/server'
import { BookCarsApiError, signUp } from '@/lib/api/bookcars'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const fullName = String(body.fullName || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    const phone = String(body.phone || '').trim()

    if (!fullName || !email || !password) {
      return NextResponse.json({ message: 'Full name, email, and password are required.' }, { status: 400 })
    }

    await signUp({
      fullName,
      email,
      password,
      ...(phone ? { phone } : {}),
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof BookCarsApiError) {
      const status = error.status >= 400 && error.status < 600 ? error.status : 502
      return NextResponse.json(
        { message: error.message || 'Registration failed.' },
        { status },
      )
    }
    return NextResponse.json({ message: 'Registration failed. Please try again later.' }, { status: 500 })
  }
}
