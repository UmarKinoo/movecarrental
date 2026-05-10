import { NextRequest, NextResponse } from 'next/server'
import { bookCarsConfig } from '@/lib/api/config'
import { getSession } from '@/lib/auth/session'

const ACCESS_HEADER = 'x-access-token'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session?.token || !session.userId) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const incoming = await request.formData()
    const file = incoming.get('file')
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ message: 'File required.' }, { status: 400 })
    }

    const forward = new FormData()
    forward.append('file', file, (file as File).name || 'license')

    const response = await fetch(
      `${bookCarsConfig.apiUrl}/api/update-license/${encodeURIComponent(session.userId)}`,
      {
        method: 'POST',
        headers: { [ACCESS_HEADER]: session.token },
        body: forward,
      },
    )

    if (!response.ok) {
      const text = await response.text()
      return NextResponse.json({ message: text || 'Upload failed.' }, { status: response.status })
    }

    const filename: unknown = await response.json()
    return NextResponse.json(typeof filename === 'string' ? filename : null)
  } catch {
    return NextResponse.json({ message: 'Upload failed.' }, { status: 500 })
  }
}
