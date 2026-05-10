import type { Car } from '@/lib/types/bookcars'
import { formatMoney, rentalDays } from '@/lib/utils/pricing'

export const CAR_TYPE_LABELS: Record<string, string> = {
  diesel: 'Diesel',
  gasoline: 'Gasoline',
  electric: 'Electric',
  hybrid: 'Hybrid',
  plugInHybrid: 'Plug-in hybrid',
  unknown: 'Other',
}

export const GEARBOX_LABELS: Record<string, string> = {
  automatic: 'Automatic',
  manual: 'Manual',
}

export const FUEL_POLICY_LABELS: Record<string, string> = {
  likeForlike: 'Like for like',
  freeTank: 'Free tank',
  fullToFull: 'Full to full',
  FullToEmpty: 'Full to empty',
}

export const RANGE_LABELS: Record<string, string> = {
  mini: 'Mini',
  midi: 'Compact',
  maxi: 'Large',
  scooter: 'Scooter',
  bus: 'Bus',
  truck: 'Truck',
  caravan: 'Caravan',
}

export type RentalOptionKey =
  | 'cancellation'
  | 'amendments'
  | 'theftProtection'
  | 'collisionDamageWaiver'
  | 'fullInsurance'
  | 'additionalDriver'

export const RENTAL_OPTIONS: Array<{
  key: RentalOptionKey
  label: string
  perDay?: boolean
}> = [
  { key: 'cancellation', label: 'Cancellation' },
  { key: 'amendments', label: 'Amendments' },
  { key: 'theftProtection', label: 'Theft protection', perDay: true },
  { key: 'collisionDamageWaiver', label: 'Collision damage waiver', perDay: true },
  { key: 'fullInsurance', label: 'Full insurance', perDay: true },
  { key: 'additionalDriver', label: 'Additional driver', perDay: true },
]

export function formatMileage(mileage: number) {
  if (mileage === -1) {
    return 'Unlimited'
  }
  if (mileage === 0) {
    return 'Not included'
  }
  return `${mileage} km`
}

export function formatDateTime(value: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export function formatRentalWindow(from: string, to: string) {
  return `${formatDateTime(from)} - ${formatDateTime(to)}`
}

export function getOptionAmount(car: Car, key: RentalOptionKey, days: number, priceChangeRate = 0) {
  const value = Number(car[key])
  if (value <= 0) {
    return 0
  }
  const option = RENTAL_OPTIONS.find((item) => item.key === key)
  const amount = option?.perDay ? value * Math.max(days, 1) : value
  return amount + amount * (priceChangeRate / 100)
}

export function getOptionSummary(car: Car, key: RentalOptionKey, days: number, currency = 'USD', priceChangeRate = 0) {
  const value = Number(car[key])
  const option = RENTAL_OPTIONS.find((item) => item.key === key)

  if (value === -1) {
    return 'Not available'
  }
  if (value === 0) {
    return 'Included'
  }
  if (option?.perDay) {
    const total = getOptionAmount(car, key, days, priceChangeRate)
    const daily = value + value * (priceChangeRate / 100)
    return `${formatMoney(total, currency)} total (${formatMoney(daily, currency)}/day)`
  }
  return formatMoney(getOptionAmount(car, key, days, priceChangeRate), currency)
}

export function getStatusLabel(car: Car) {
  if (car.comingSoon) {
    return { text: '◐ Coming soon', className: 'bg-amber-100 text-amber-900' }
  }
  if (car.fullyBooked || !car.available) {
    return { text: '✕ Fully booked', className: 'bg-ink/10 text-ink/60' }
  }
  return { text: '● Available', className: 'bg-lime text-ink' }
}

export function getRentalDayLabel(from?: string, to?: string) {
  if (!from || !to) {
    return 'per day'
  }
  const days = rentalDays(from, to)
  return `${days} ${days === 1 ? 'day' : 'days'}`
}
