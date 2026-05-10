import { NextRequest, NextResponse } from 'next/server'
import { searchCars } from '@/lib/api/bookcars'

export async function GET(request: NextRequest) {
  const pickupLocation = request.nextUrl.searchParams.get('pickupLocation')
  const dropOffLocation = request.nextUrl.searchParams.get('dropOffLocation') || undefined
  const from = request.nextUrl.searchParams.get('from')
  const to = request.nextUrl.searchParams.get('to')

  if (!pickupLocation || !from || !to) {
    return NextResponse.json({ message: 'pickupLocation, from, and to are required.' }, { status: 400 })
  }

  const data = await searchCars({ pickupLocation, dropOffLocation, from, to })
  return NextResponse.json(data)
}
