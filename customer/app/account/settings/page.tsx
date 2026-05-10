import { redirect } from 'next/navigation'
import { SettingsForm } from '@/components/account/settings-form'
import { AccountShell } from '@/components/account/account-shell'
import { getUser } from '@/lib/api/bookcars'
import { getSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export default async function AccountSettingsPage() {
  const session = await getSession()
  if (!session?.token) {
    redirect('/login?next=/account/settings')
  }

  const user = await getUser(session.userId, session.token)
  if (!user) {
    redirect('/login')
  }

  const birth =
    user.birthDate instanceof Date
      ? user.birthDate.toISOString().slice(0, 10)
      : user.birthDate
        ? String(user.birthDate).slice(0, 10)
        : ''

  return (
    <AccountShell eyebrow="Profile" title="Settings" active="/account/settings">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55">
        Updates sync to your BookCars customer profile.
      </p>
      <div className="mt-8 max-w-xl border border-ink/10 bg-white p-6 md:p-8">
        <SettingsForm
          userId={user._id}
          initialFullName={user.fullName}
          initialPhone={user.phone || ''}
          initialBio={user.bio || ''}
          initialLocation={user.location || ''}
          initialBirthDate={birth}
          initialEmailNotifications={user.enableEmailNotifications ?? false}
        />
      </div>
    </AccountShell>
  )
}
