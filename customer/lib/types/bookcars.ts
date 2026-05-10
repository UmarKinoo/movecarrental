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
  parkingSpots?: Array<{
    _id?: string
    latitude?: number
    longitude?: number
    name?: string
  }>
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
  minimumAge?: number
  licensePlate?: string
  aircon?: boolean
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
  rating?: number
  trips?: number
  co2?: number
}

export type User = {
  _id: string
  email: string
  fullName: string
  phone?: string
  language?: string
  blacklisted?: boolean
  accessToken?: string
  birthDate?: string | Date
  bio?: string
  location?: string
  avatar?: string
  enableEmailNotifications?: boolean
  license?: string
  verified?: boolean
}

export type CarSpecs = {
  aircon?: boolean
  moreThanFourDoors?: boolean
  moreThanFiveSeats?: boolean
}

export type SearchCarFilters = {
  carSpecs?: CarSpecs
  carType?: string[]
  gearbox?: string[]
  mileage?: string[]
  fuelPolicy?: string[]
  deposit?: number
  ranges?: string[]
  multimedia?: string[]
  rating?: number
  seats?: number
}

export type BookingRecord = {
  _id: string
  status: BookingStatus
  from: string
  to: string
  price?: number
  cancellation?: boolean
  amendments?: boolean
  theftProtection?: boolean
  collisionDamageWaiver?: boolean
  fullInsurance?: boolean
  additionalDriver?: boolean
  supplier?: Supplier
  car?: Car
  driver?: User
  pickupLocation?: Location & { values?: { language: string; value: string }[] }
  dropOffLocation?: Location & { values?: { language: string; value: string }[] }
}

export type NotificationRecord = {
  _id: string
  message: string
  booking?: string
  isRead?: boolean
  createdAt?: string
}

export type AdditionalDriverInput = {
  fullName: string
  email: string
  phone: string
  birthDate: string
}

export type CreatePaymentPayload = {
  amount: number
  currency: string
  locale: string
  receiptEmail: string
  customerName: string
  name: string
  description?: string
}

export type PaymentSessionResult = {
  sessionId: string
  customerId: string
  clientSecret: string | null
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
} & SearchCarFilters

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
    birthDate?: string
    language?: string
    license?: string
  }
  authenticatedUserId?: string
  pickupLocationName?: string
  dropOffLocationName?: string
  flightNumber?: string
  accommodation?: string
  notes?: string
  cancellation?: boolean
  amendments?: boolean
  theftProtection?: boolean
  collisionDamageWaiver?: boolean
  fullInsurance?: boolean
  additionalDriver?: boolean
  additionalDriverDetails?: AdditionalDriverInput
  sessionId?: string
  customerId?: string
  payPal?: boolean
  /** v3 token from grecaptcha.execute when NEXT_PUBLIC_RECAPTCHA_SITE_KEY is set */
  recaptchaToken?: string
}
