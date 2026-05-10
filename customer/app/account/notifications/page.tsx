import { redirect } from 'next/navigation'
import { MarkNotificationsRead } from '@/components/account/mark-notifications-read'
import { AccountShell } from '@/components/account/account-shell'
import { getNotifications } from '@/lib/api/bookcars'
import { getSession } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export default async function NotificationsPage() {
  const session = await getSession()
  if (!session?.token) {
    redirect('/login?next=/account/notifications')
  }

  const { items } = await getNotifications(session.userId, 1, 50, session.token)
  const unreadCount = items.filter((n) => !n.isRead).length

  return (
    <AccountShell
      eyebrow={`Inbox · ${items.length}`}
      title="Notifications"
      active="/account/notifications"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55">
          {unreadCount > 0
            ? `${unreadCount} unread`
            : 'All caught up'}
        </p>
        {items.length > 0 ? <MarkNotificationsRead userId={session.userId} /> : null}
      </div>

      {items.length === 0 ? (
        <div className="mt-10 border-2 border-dashed border-ink/15 bg-white p-12 text-center">
          <p className="eyebrow-lime justify-center">Empty</p>
          <h2 className="display mt-3 text-3xl text-ink">Nothing here yet</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm text-ink/65">
            When the rental team sends you an update, it lands here.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-2">
          {items.map((n) => (
            <li
              key={n._id}
              className={`flex gap-4 border-l-2 p-4 transition ${
                n.isRead
                  ? 'border-ink/15 bg-white'
                  : 'border-lime bg-lime/10'
              }`}
            >
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 ${
                  n.isRead ? 'bg-ink/20' : 'bg-lime'
                }`}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-relaxed text-ink">{n.message}</p>
                {n.createdAt ? (
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </AccountShell>
  )
}
