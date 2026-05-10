import { NextRequest, NextResponse } from 'next/server'
import { getLocations } from '@/lib/api/bookcars'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query') || ''
  const data = await getLocations(query, 1, 60)
  return NextResponse.json(data)
}
