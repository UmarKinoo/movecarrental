import { notFound } from 'next/navigation'
import { BookingForm } from '@/components/booking/booking-form'
import { bookCarsConfig } from '@/lib/api/config'
import { getCar, getLocations, getUser } from '@/lib/api/bookcars'
import { getSession } from '@/lib/auth/session'
import { calculateBaseRentalPrice } from '@/lib/utils/pricing'

export const dynamic = 'force-dynamic'

type BookingPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const params = await searchParams
  const carId = first(params.carId)
  const pickupLocationId = first(params.pickupLocation)
  const dropOffLocationId = first(params.dropOffLocation) || pickupLocationId
  const from = first(params.from)
  const to = first(params.to)

  if (!carId || !pickupLocationId || !from || !to) {
    notFound()
  }

  const [car, locations, session] = await Promise.all([
    getCar(carId),
    getLocations('', 1, 100),
    getSession(),
  ])

  if (!car) {
    notFound()
  }

  const pickupLocation = locations.items.find((location) => location._id === pickupLocationId)
  const dropOffLocation = locations.items.find((location) => location._id === dropOffLocationId)
  const estimatedPrice = calculateBaseRentalPrice(car, from, to)

  let defaultFullName: string | undefined
  let defaultEmail: string | undefined
  let defaultPhone: string | undefined

  let profileLicense: string | undefined
  if (session?.token) {
    const user = await getUser(session.userId, session.token)
    if (user) {
      defaultFullName = user.fullName
      defaultEmail = user.email
      defaultPhone = user.phone
      profileLicense = user.license
    }
  }

  return (
    <div className="bg-bone py-10 md:py-14">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
      <BookingForm
        car={car}
        pickupLocation={pickupLocation}
        dropOffLocation={dropOffLocation}
        pickupLocationName={pickupLocation?.name}
        dropOffLocationName={dropOffLocation?.name}
        from={from}
        to={to}
        estimatedPrice={estimatedPrice}
        paymentGateway={bookCarsConfig.paymentGateway}
        isLoggedIn={!!session}
        userId={session?.userId}
        profileLicense={profileLicense}
        defaultFullName={defaultFullName}
        defaultEmail={defaultEmail}
        defaultPhone={defaultPhone}
      />
      </div>
    </div>
  )
}
