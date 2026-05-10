import { redirect } from 'next/navigation'

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

/** BookCars uses the same activate endpoint for password reset links. */
export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams
  const u = typeof params.u === 'string' ? params.u : Array.isArray(params.u) ? params.u[0] : ''
  const e = typeof params.e === 'string' ? params.e : Array.isArray(params.e) ? params.e[0] : ''
  const t = typeof params.t === 'string' ? params.t : Array.isArray(params.t) ? params.t[0] : ''
  const query = new URLSearchParams()
  if (u) {
    query.set('u', u)
  }
  if (e) {
    query.set('e', e)
  }
  if (t) {
    query.set('t', t)
  }
  redirect(`/activate?${query.toString()}`)
}
