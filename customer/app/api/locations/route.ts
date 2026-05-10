import { NextRequest, NextResponse } from 'next/server'
import { BookCarsApiError, getLocations } from '@/lib/api/bookcars'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query') || ''

  try {
    const data = await getLocations(query, 1, 60)
    return NextResponse.json(data)
  } catch (error) {
    const status = error instanceof BookCarsApiError ? error.status : 503
    const message = error instanceof Error ? error.message : 'Locations are temporarily unavailable.'

    return NextResponse.json(
      {
        items: [],
        total: 0,
        error: message,
      },
      { status },
    )
  }
}
