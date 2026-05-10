import { bookCarsConfig, joinUrl } from '@/lib/api/config'
import type {
  AggregateResult,
  AdditionalDriverInput,
  BookingCheckoutInput,
  BookingRecord,
  Car,
  CarSpecs,
  CreatePaymentPayload,
  Location,
  NotificationRecord,
  PaymentSessionResult,
  SearchCarsInput,
  Supplier,
  User,
} from '@/lib/types/bookcars'
import {
  ALL_CAR_TYPES,
  ALL_FUEL_POLICY,
  ALL_GEARBOX,
  ALL_MILEAGE,
  ALL_RANGES,
  BOOKING_STATUS_FILTERS,
} from '@/lib/utils/filter-defaults'
import { calculateTotalRentalPrice, truncateForOrderName } from '@/lib/utils/total-price'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  token?: string
}

const ACCESS_HEADER = 'x-access-token'

export class BookCarsApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
  }
}

async function bookCarsRequest<T>(path: string, options: RequestOptions = {}): Promise<T | null> {
  const headers = new Headers()
  headers.set('Accept', 'application/json')

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.token) {
    headers.set(ACCESS_HEADER, options.token)
  }

  let response: Response

  try {
    response = await fetch(`${bookCarsConfig.apiUrl}${path}`, {
      method: options.method || 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      cache: 'no-store',
    })
  } catch {
    throw new BookCarsApiError('BookCars backend is not reachable.', 503)
  }

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    throw new BookCarsApiError(typeof payload === 'string' ? payload : 'BookCars API request failed', response.status)
  }

  return payload as T
}

export async function getLocations(keyword = '', page = 1, size = 50) {
  const language = bookCarsConfig.defaultLanguage
  const data = await bookCarsRequest<AggregateResult<Location>>(
    `/api/locations/${page}/${size}/${language}/?s=${encodeURIComponent(keyword)}`,
  )

  return {
    items: data?.[0]?.resultData || [],
    total: data?.[0]?.pageInfo?.[0]?.totalRecords || 0,
  }
}

export async function getLocationsWithPosition() {
  const language = bookCarsConfig.defaultLanguage
  return (await bookCarsRequest<Location[]>(`/api/locations-with-position/${language}`)) || []
}

export async function getSuppliers() {
  return (await bookCarsRequest<Supplier[]>('/api/all-suppliers')) || []
}

export async function getDefaultSupplierIds() {
  if (bookCarsConfig.defaultSupplierId) {
    return [bookCarsConfig.defaultSupplierId]
  }

  const suppliers = await getSuppliers()
  return suppliers.map((supplier) => supplier._id)
}

function buildFilterBody(input: SearchCarsInput) {
  const carSpecs: CarSpecs = {
    aircon: input.carSpecs?.aircon,
    moreThanFourDoors: input.carSpecs?.moreThanFourDoors,
    moreThanFiveSeats: input.carSpecs?.moreThanFiveSeats,
  }
  const hasAnySpec = carSpecs.aircon || carSpecs.moreThanFourDoors || carSpecs.moreThanFiveSeats

  return {
    suppliers: [] as string[],
    pickupLocation: input.pickupLocation,
    dropOffLocation: input.dropOffLocation || input.pickupLocation,
    from: input.from,
    to: input.to,
    carSpecs: hasAnySpec ? carSpecs : undefined,
    carType: input.carType?.length ? input.carType : [...ALL_CAR_TYPES],
    gearbox: input.gearbox?.length ? input.gearbox : [...ALL_GEARBOX],
    mileage: input.mileage?.length ? input.mileage : [...ALL_MILEAGE],
    fuelPolicy: input.fuelPolicy?.length ? input.fuelPolicy : [...ALL_FUEL_POLICY],
    deposit: typeof input.deposit === 'number' ? input.deposit : -1,
    ranges: input.ranges?.length ? input.ranges : [...ALL_RANGES],
    multimedia: input.multimedia?.length ? input.multimedia : [],
    rating: typeof input.rating === 'number' ? input.rating : -1,
    seats: typeof input.seats === 'number' ? input.seats : -1,
  }
}

export async function searchCars(input: SearchCarsInput) {
  const suppliers = await getDefaultSupplierIds()

  if (!suppliers.length) {
    return { items: [], total: 0 }
  }

  const body = buildFilterBody(input)
  body.suppliers = suppliers

  const data = await bookCarsRequest<AggregateResult<Car>>(
    `/api/frontend-cars/${input.page || 1}/${input.size || 12}`,
    {
      method: 'POST',
      body,
    },
  )

  return {
    items: data?.[0]?.resultData || [],
    total: data?.[0]?.pageInfo?.[0]?.totalRecords || 0,
  }
}

export async function getCar(id: string) {
  return bookCarsRequest<Car>(`/api/car/${encodeURIComponent(id)}/${bookCarsConfig.defaultLanguage}`)
}

export function getCarImageUrl(car: Pick<Car, 'image'>) {
  return car.image
    ? joinUrl(bookCarsConfig.carCdnUrl, car.image)
    : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
}

export async function signIn(email: string, password: string) {
  return bookCarsRequest<User>('/api/sign-in/frontend', {
    method: 'POST',
    body: {
      email,
      password,
      mobile: true,
      stayConnected: true,
    },
  })
}

export async function signUp(input: { fullName: string; email: string; password: string; phone?: string }) {
  await bookCarsRequest('/api/sign-up', {
    method: 'POST',
    body: {
      ...input,
      language: bookCarsConfig.defaultLanguage,
    },
  })
}

export async function getUser(id: string, token: string) {
  return bookCarsRequest<User>(`/api/user/${encodeURIComponent(id)}`, { token })
}

export async function resendActivationOrReset(email: string, reset: boolean) {
  const status = await fetch(
    `${bookCarsConfig.apiUrl}/api/resend/frontend/${encodeURIComponent(email)}/${reset}`,
    { method: 'POST', headers: { Accept: 'application/json' } },
  )
  return status.ok
}

export async function activateAccount(userId: string, token: string, password: string) {
  const response = await fetch(`${bookCarsConfig.apiUrl}/api/activate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ userId, token, password }),
  })
  return response.ok
}

export async function updateUser(
  token: string,
  payload: {
    _id: string
    fullName?: string
    phone?: string
    bio?: string
    location?: string
    birthDate?: string
    enableEmailNotifications?: boolean
  },
) {
  await bookCarsRequest('/api/update-user', {
    method: 'POST',
    body: {
      _id: payload._id,
      fullName: payload.fullName,
      phone: payload.phone,
      bio: payload.bio,
      location: payload.location,
      birthDate: payload.birthDate,
      enableEmailNotifications: payload.enableEmailNotifications,
    },
    token,
  })
}

export async function changePassword(token: string, userId: string, password: string, newPassword: string) {
  await bookCarsRequest('/api/change-password', {
    method: 'POST',
    body: {
      _id: userId,
      password,
      newPassword,
      strict: true,
    },
    token,
  })
}

export async function getCustomerBookings(token: string, page: number, size: number) {
  const suppliers = await getDefaultSupplierIds()
  const body = {
    suppliers,
    statuses: [...BOOKING_STATUS_FILTERS],
  }

  const data = await bookCarsRequest<AggregateResult<BookingRecord>>(
    `/api/bookings/${page}/${size}/${bookCarsConfig.defaultLanguage}`,
    { method: 'POST', body, token },
  )

  return {
    items: data?.[0]?.resultData || [],
    total: data?.[0]?.pageInfo?.[0]?.totalRecords || 0,
  }
}

export async function getBooking(id: string) {
  return bookCarsRequest<BookingRecord>(
    `/api/booking/${encodeURIComponent(id)}/${bookCarsConfig.defaultLanguage}`,
  )
}

export async function getBookingIdBySession(sessionId: string) {
  const res = await fetch(`${bookCarsConfig.apiUrl}/api/booking-id/${encodeURIComponent(sessionId)}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    return null
  }
  const data: unknown = await res.json()
  return typeof data === 'string' ? data : null
}

export async function cancelBooking(token: string, bookingId: string) {
  const response = await fetch(`${bookCarsConfig.apiUrl}/api/cancel-booking/${encodeURIComponent(bookingId)}`, {
    method: 'POST',
    headers: { [ACCESS_HEADER]: token, Accept: 'application/json' },
  })
  return response.ok
}

export async function createCheckoutSession(payload: CreatePaymentPayload) {
  return bookCarsRequest<PaymentSessionResult>('/api/create-checkout-session', {
    method: 'POST',
    body: payload,
  })
}

export async function checkCheckoutSession(sessionId: string) {
  const response = await fetch(`${bookCarsConfig.apiUrl}/api/check-checkout-session/${encodeURIComponent(sessionId)}`, {
    method: 'POST',
  })
  return response.status
}

export async function createPayPalOrder(bookingId: string, amount: number, currency: string, name: string, description: string) {
  const data = await bookCarsRequest<string>('/api/create-paypal-order/', {
    method: 'POST',
    body: { bookingId, amount, currency, name, description },
  })
  return typeof data === 'string' ? data : ''
}

export async function checkPayPalOrder(bookingId: string, orderId: string) {
  const response = await fetch(
    `${bookCarsConfig.apiUrl}/api/check-paypal-order/${encodeURIComponent(bookingId)}/${encodeURIComponent(orderId)}`,
    { method: 'POST' },
  )
  return response.status
}

export async function getNotifications(userId: string, page: number, size: number, token: string) {
  const data = await bookCarsRequest<AggregateResult<NotificationRecord>>(
    `/api/notifications/${encodeURIComponent(userId)}/${page}/${size}`,
    { token },
  )
  return {
    items: data?.[0]?.resultData || [],
    total: data?.[0]?.pageInfo?.[0]?.totalRecords || 0,
  }
}

export async function markNotificationsRead(userId: string, ids: string[], token: string) {
  if (!ids.length) {
    return
  }
  await bookCarsRequest(`/api/mark-notifications-as-read/${encodeURIComponent(userId)}`, {
    method: 'POST',
    body: { ids },
    token,
  })
}

export async function verifyRecaptcha(token: string, ip: string) {
  const response = await fetch(
    `${bookCarsConfig.apiUrl}/api/verify-recaptcha/${encodeURIComponent(token)}/${encodeURIComponent(ip)}`,
  )
  return response.ok
}

const STRIPE_NAME_MAX = 250
const STRIPE_DESC_MAX = 500
const PAYPAL_NAME_MAX = 200
const PAYPAL_DESC_MAX = 1000

export async function checkoutBooking(input: BookingCheckoutInput) {
  const car = await getCar(input.carId)
  if (!car) {
    throw new BookCarsApiError('Car not found.', 404)
  }

  const priceChangeRate = car.supplier.priceChangeRate || 0
  const options = {
    cancellation: !!input.cancellation,
    amendments: !!input.amendments,
    theftProtection: !!input.theftProtection,
    collisionDamageWaiver: !!input.collisionDamageWaiver,
    fullInsurance: !!input.fullInsurance,
    additionalDriver: !!input.additionalDriver,
  }

  const price = calculateTotalRentalPrice(car, input.from, input.to, priceChangeRate, options)
  const payLater = input.paymentOption === 'counter'
  const payDeposit = input.paymentOption === 'deposit'
  const payInFull = input.paymentOption === 'full'

  let depositAmount = Number(car.deposit) || 0
  depositAmount += depositAmount * (priceChangeRate / 100)

  let paymentLine = price
  if (payDeposit) {
    paymentLine = depositAmount
  } else if (payInFull) {
    paymentLine = price + depositAmount
  }

  if (!payLater) {
    const usePayPal = input.payPal ?? bookCarsConfig.paymentGateway === 'payPal'
    if (!usePayPal && (!input.sessionId || !input.customerId)) {
      throw new BookCarsApiError('Missing Stripe session.', 400)
    }
  }

  let driver: Record<string, unknown> | undefined
  if (!input.authenticatedUserId) {
    driver = {
      email: input.driver.email,
      phone: input.driver.phone,
      fullName: input.driver.fullName,
      birthDate: input.driver.birthDate,
      language: input.driver.language || bookCarsConfig.defaultLanguage,
      license: input.driver.license || undefined,
    }
  }

  let additionalDriver: AdditionalDriverInput | undefined
  if (input.additionalDriver && input.additionalDriverDetails) {
    additionalDriver = {
      fullName: input.additionalDriverDetails.fullName,
      email: input.additionalDriverDetails.email,
      phone: input.additionalDriverDetails.phone,
      birthDate: input.additionalDriverDetails.birthDate,
    }
  }

  const booking = {
    supplier: car.supplier._id,
    car: car._id,
    driver: input.authenticatedUserId,
    pickupLocation: input.pickupLocation,
    dropOffLocation: input.dropOffLocation,
    from: input.from,
    to: input.to,
    status: payLater ? 'reserved' : 'pending',
    cancellation: !!input.cancellation,
    amendments: !!input.amendments,
    theftProtection: !!input.theftProtection,
    collisionDamageWaiver: !!input.collisionDamageWaiver,
    fullInsurance: !!input.fullInsurance,
    additionalDriver: !!input.additionalDriver,
    price,
    isDeposit: payDeposit,
    isPayedInFull: payInFull,
  }

  const body = {
    driver,
    booking,
    additionalDriver,
    payLater,
    sessionId: input.sessionId,
    customerId: input.customerId,
    payPal: input.payPal ?? bookCarsConfig.paymentGateway === 'payPal',
  }

  const result = await bookCarsRequest<{ bookingId: string }>('/api/checkout', {
    method: 'POST',
    body,
  })

  if (!result?.bookingId) {
    throw new BookCarsApiError('Checkout did not return a booking id.', 500)
  }

  return {
    bookingId: result.bookingId,
    paymentAmount: paymentLine,
    payPalMeta:
      !payLater && bookCarsConfig.paymentGateway === 'payPal'
        ? {
            amount: paymentLine,
            currency: bookCarsConfig.defaultCurrency.toLowerCase(),
            name: truncateForOrderName(car.name, PAYPAL_NAME_MAX),
            description: truncateForOrderName(
              `${bookCarsConfig.siteName} - ${car.name}`,
              PAYPAL_DESC_MAX,
            ),
          }
        : undefined,
  }
}

export function buildStripePaymentPayload(input: {
  carName: string
  pickupLabel: string
  email: string
  fullName: string
  locale: string
  amount: number
}) {
  const name = truncateForOrderName(`${bookCarsConfig.siteName} - ${input.carName}`, STRIPE_NAME_MAX)
  const description = truncateForOrderName(
    `${bookCarsConfig.siteName} - ${input.carName} - ${input.pickupLabel}`,
    STRIPE_DESC_MAX,
  )

  const payload: CreatePaymentPayload = {
    amount: input.amount,
    currency: bookCarsConfig.defaultCurrency.toLowerCase(),
    locale: input.locale,
    receiptEmail: input.email,
    customerName: input.fullName,
    name,
    description,
  }
  return payload
}
