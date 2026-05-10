import type { Car } from '@/lib/types/bookcars'

export function rentalDays(from: string | Date, to: string | Date) {
  const start = new Date(from)
  const end = new Date(to)
  const value = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return Number.isFinite(value) && value > 0 ? value : 0
}

export function calculateBaseRentalPrice(car: Car, from: string | Date, to: string | Date) {
  const days = rentalDays(from, to)

  if (!days) {
    return 0
  }

  if (car.isDateBasedPrice && car.dateBasedPrices?.length) {
    let total = 0
    const current = new Date(from)
    current.setHours(0, 0, 0, 0)

    for (let index = 0; index < days; index += 1) {
      const customRate = car.dateBasedPrices.find((rate) => {
        if (!rate.startDate || !rate.endDate) {
          return false
        }

        const start = new Date(rate.startDate)
        const end = new Date(rate.endDate)
        start.setHours(0, 0, 0, 0)
        end.setHours(0, 0, 0, 0)
        return current >= start && current <= end
      })

      total += Number(customRate?.dailyPrice || car.discountedDailyPrice || car.dailyPrice)
      current.setDate(current.getDate() + 1)
      current.setHours(0, 0, 0, 0)
    }

    return total
  }

  return (car.discountedDailyPrice || car.dailyPrice) * days
}

export function formatMoney(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}
