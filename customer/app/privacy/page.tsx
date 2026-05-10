import { PageHeader } from '@/components/layout/page-header'

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Legal"
        title="Privacy"
        lede="This frontend forwards your booking data to the BookCars backend. The production deployment must be paired with the operator's privacy policy."
      />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <p className="text-base leading-relaxed text-ink/75">
            We collect only the data we need to complete your reservation: name, email,
            phone, optional driver license, and trip details. Payment data is handled by
            Stripe or PayPal where applicable; MOVE does not store your card.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink/75">
            You can request deletion or export of your account data via{' '}
            <a
              href="mailto:hello@movecarrental.com"
              className="border-b border-lime pb-0.5 text-ink hover:text-lime"
            >
              hello@movecarrental.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  )
}
