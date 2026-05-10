import Link from 'next/link'
import { ArrowUpRight, Mail, MessageSquare, Phone } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'

type Channel = {
  Icon: typeof Mail
  label: string
  value: string
  href?: string
  desc: string
}

const channels: Channel[] = [
  {
    Icon: Mail,
    label: 'Email',
    value: 'hello@movecarrental.com',
    href: 'mailto:hello@movecarrental.com',
    desc: 'Best for booking changes, extensions, and non-urgent questions.',
  },
  {
    Icon: Phone,
    label: 'Phone / WhatsApp',
    value: '+ provided at pickup',
    desc: 'For roadside or pickup-day questions, the team contact arrives in your booking email.',
  },
  {
    Icon: MessageSquare,
    label: 'Account inbox',
    value: 'Notifications',
    href: '/account/notifications',
    desc: 'Replies from the team land in your account inbox while you are signed in.',
  },
]

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact"
        lede="Include your booking reference if you have one. We reply during local business hours and as fast as we can."
      />

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-px bg-ink/10 md:grid-cols-3">
            {channels.map(({ Icon, label, value, href, desc }) => {
              const inner = (
                <>
                  <Icon size={26} strokeWidth={1.5} className="text-ink/70" />
                  <p className="eyebrow mt-8">{label}</p>
                  <p className="mt-2 font-display text-lg font-black tracking-tightest text-ink">
                    {value}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{desc}</p>
                </>
              )
              return href ? (
                <a
                  key={label}
                  href={href}
                  className="group bg-white p-7 transition hover:bg-ink hover:text-white [&_*]:hover:!text-white"
                >
                  {inner}
                  <ArrowUpRight
                    size={18}
                    strokeWidth={2.5}
                    className="mt-6 text-ink/40 transition group-hover:!text-lime"
                  />
                </a>
              ) : (
                <div key={label} className="bg-white p-7">
                  {inner}
                </div>
              )
            })}
          </div>

          <p className="mt-12 font-mono text-xs uppercase tracking-[0.14em] text-ink/55">
            Have an account?{' '}
            <Link href="/account/bookings" className="border-b border-lime pb-0.5 text-ink hover:text-lime">
              View your bookings
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
