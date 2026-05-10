import { bookCarsConfig, joinUrl } from '@/lib/api/config'
import type {
  AggregateResult,
  BookingCheckoutInput,
  Car,
  Location,
  SearchCarsInput,
  Supplier,
  User,
} from '@/lib/types/bookcars'
import { calculateBaseRentalPrice } from '@/lib/utils/pricing'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  token?: string
}

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
    headers.set('x-access-token', options.token)
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

const defaultCarFilters = {
  carType: ['diesel', 'gasoline', 'electric', 'hybrid', 'plugInHybrid', 'unknown'],
  gearbox: ['automatic', 'manual'],
  mileage: ['limited', 'unlimited'],
  fuelPolicy: ['likeForlike', 'freeTank', 'fullToFull', 'FullToEmpty'],
  deposit: -1,
  ranges: ['mini', 'midi', 'maxi', 'scooter', 'bus', 'truck', 'caravan'],
  multimedia: [],
  rating: -1,
  seats: -1,
}

export async function searchCars(input: SearchCarsInput) {
  const suppliers = await getDefaultSupplierIds()

  if (!suppliers.length) {
    return { items: [], total: 0 }
  }

  const data = await bookCarsRequest<AggregateResult<Car>>(
    `/api/frontend-cars/${input.page || 1}/${input.size || 12}`,
    {
      method: 'POST',
      body: {
        suppliers,
        pickupLocation: input.pickupLocation,
        dropOffLocation: input.dropOffLocation || input.pickupLocation,
        from: input.from,
        to: input.to,
        ...defaultCarFilters,
      },
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

export async function checkoutBooking(input: BookingCheckoutInput) {
  if (input.paymentOption !== 'counter') {
    throw new BookCarsApiError('Online payments will be enabled in the next payment phase.', 400)
  }

  const car = await getCar(input.carId)
  if (!car) {
    throw new BookCarsApiError('Car not found.', 404)
  }

  const price = calculateBaseRentalPrice(car, input.from, input.to)

  return bookCarsRequest<{ bookingId: string }>('/api/checkout', {
    method: 'POST',
    body: {
      driver: {
        fullName: input.driver.fullName,
        email: input.driver.email,
        phone: input.driver.phone,
        language: bookCarsConfig.defaultLanguage,
      },
      booking: {
        supplier: car.supplier._id,
        car: car._id,
        pickupLocation: input.pickupLocation,
        dropOffLocation: input.dropOffLocation,
        from: input.from,
        to: input.to,
        status: 'reserved',
        cancellation: false,
        amendments: false,
        theftProtection: false,
        collisionDamageWaiver: false,
        fullInsurance: false,
        additionalDriver: false,
        price,
      },
      payLater: true,
    },
  })
}
