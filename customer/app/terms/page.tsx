import { PageHeader } from '@/components/layout/page-header'

export default function TermsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Legal"
        title="Terms"
        lede="Rental terms, deposit rules, cancellation rules, and driver requirements should be reviewed with the client before launch."
      />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 prose prose-neutral md:px-8">
          <p className="text-base leading-relaxed text-ink/75">
            By booking a vehicle on MOVE you agree to the rental policies presented at
            checkout. Deposit, fuel, mileage and cancellation rules vary by vehicle and
            are made visible before you confirm.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink/75">
            For the legally binding version of these terms tied to your booking, refer
            to the contract presented in the rental agreement at pickup.
          </p>
        </div>
      </section>
    </div>
  )
}
