import { redirect } from 'next/navigation'
import { ChangePasswordForm } from '@/components/account/change-password-form'
import { AccountShell } from '@/components/account/account-shell'
import { getSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export default async function ChangePasswordPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login?next=/account/change-password')
  }

  return (
    <AccountShell
      eyebrow="Security"
      title="Change password"
      active="/account/change-password"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55">
        Use a strong password — minimum 6 characters. We recommend a passphrase.
      </p>
      <div className="mt-8 max-w-md border border-ink/10 bg-white p-6 md:p-8">
        <ChangePasswordForm />
      </div>
    </AccountShell>
  )
}
