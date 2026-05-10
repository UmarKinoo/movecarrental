import { PageHeader } from '@/components/layout/page-header'

export default function CookiePolicyPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Legal"
        title="Cookie policy"
        lede="We use the bare minimum: keep you signed in, protect forms, and remember a couple of preferences. That's it."
      />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <p className="text-base leading-relaxed text-ink/75">
            Essential cookies keep you signed in and protect forms (for example reCAPTCHA
            when enabled). Analytics or marketing cookies are only used if you configure
            them in this deployment.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink/75">
            Session cookies for the customer site are HTTP-only where possible. You can
            clear cookies in your browser at any time; you may need to sign in again
            afterward.
          </p>
        </div>
      </section>
    </div>
  )
}
