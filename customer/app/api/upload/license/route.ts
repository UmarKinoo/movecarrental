import { NextRequest, NextResponse } from 'next/server'
import { bookCarsConfig } from '@/lib/api/config'

export async function POST(request: NextRequest) {
  try {
    const incoming = await request.formData()
    const file = incoming.get('file')
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ message: 'File required.' }, { status: 400 })
    }

    const forward = new FormData()
    forward.append('file', file, (file as File).name || 'license')

    const response = await fetch(`${bookCarsConfig.apiUrl}/api/create-license`, {
      method: 'POST',
      body: forward,
    })

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
