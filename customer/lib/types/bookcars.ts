export type BookingStatus =
  | 'void'
  | 'pending'
  | 'deposit'
  | 'paid'
  | 'paidInFull'
  | 'reserved'
  | 'cancelled'

export type GearboxType = 'manual' | 'automatic'

export type CarType = 'diesel' | 'gasoline' | 'electric' | 'hybrid' | 'plugInHybrid' | 'unknown'

export type FuelPolicy = 'likeForlike' | 'freeTank' | 'fullToFull' | 'FullToEmpty'

export type Location = {
  _id: string
  name?: string
  latitude?: number
  longitude?: number
  image?: string
  parentLocation?: Location
}

export type Supplier = {
  _id: string
  fullName: string
  avatar?: string
  payLater?: boolean
  licenseRequired?: boolean
  priceChangeRate?: number
}

export type DateBasedPrice = {
  _id?: string
  startDate: string | Date | null
  endDate: string | Date | null
  dailyPrice: number | string
}

export type Car = {
  _id: string
  name: string
  supplier: Supplier
  locations?: Location[]
  dailyPrice: number
  discountedDailyPrice?: number | null
  hourlyPrice?: number | null
  discountedHourlyPrice?: number | null
  biWeeklyPrice?: number | null
  discountedBiWeeklyPrice?: number | null
  weeklyPrice?: number | null
  discountedWeeklyPrice?: number | null
  monthlyPrice?: number | null
  discountedMonthlyPrice?: number | null
  isDateBasedPrice?: boolean
  dateBasedPrices?: DateBasedPrice[]
  deposit: number
  available: boolean
  fullyBooked?: boolean
  comingSoon?: boolean
  type: CarType
  gearbox: GearboxType
  image?: string
  seats: number
  doors: number
  fuelPolicy: FuelPolicy
  mileage: number
  cancellation: number
  amendments: number
  theftProtection: number
  collisionDamageWaiver: number
  fullInsurance: number
  additionalDriver: number
  range?: string
  multimedia?: string[]
}

export type User = {
  _id: string
  email: string
  fullName: string
  phone?: string
  language?: string
  blacklisted?: boolean
  accessToken?: string
}

export type AggregateResult<T> = [{
  resultData: T[]
  pageInfo: Array<{ totalRecords: number }>
}]

export type SearchCarsInput = {
  pickupLocation: string
  dropOffLocation?: string
  from: string
  to: string
  page?: number
  size?: number
}

export type BookingCheckoutInput = {
  carId: string
  pickupLocation: string
  dropOffLocation: string
  from: string
  to: string
  paymentOption: 'counter' | 'deposit' | 'full'
  driver: {
    fullName: string
    email: string
    phone: string
  }
  flightNumber?: string
  accommodation?: string
  notes?: string
}
