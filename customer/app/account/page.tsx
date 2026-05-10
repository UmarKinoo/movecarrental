import { getSession } from '@/lib/auth/session'
import { getUser } from '@/lib/api/bookcars'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const session = await getSession()
  const user = session ? await getUser(session.userId, session.token) : null

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-lg border border-neutral-200 bg-white p-8">
        <p className="text-sm font-semibold uppercase text-brand-600">Account</p>
        <h1 className="mt-2 text-3xl font-semibold">{user ? user.fullName : 'Sign in required'}</h1>
        <p className="mt-3 text-neutral-600">{user ? user.email : 'Use the login page to access your booking history.'}</p>
      </div>
    </div>
  )
}
