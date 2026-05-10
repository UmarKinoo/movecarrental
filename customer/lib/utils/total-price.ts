import type { Car } from '@/lib/types/bookcars'

export type RentalCarOptions = {
  cancellation?: boolean
  amendments?: boolean
  theftProtection?: boolean
  collisionDamageWaiver?: boolean
  fullInsurance?: boolean
  additionalDriver?: boolean
}

function daysBetween(from: Date, to: Date) {
  return (from && to && Math.ceil((to.getTime() - from.getTime()) / (1000 * 3600 * 24))) || 0
}

function hoursBetween(from: Date, to: Date) {
  if (!from || !to) {
    return 0
  }
  const ms = to.getTime() - from.getTime()
  return Math.ceil(ms / (1000 * 60 * 60))
}

/**
 * Matches bookcars-helper pricing: rental total + per-day add-ons + supplier priceChangeRate %.
 */
export function calculateTotalRentalPrice(
  car: Car,
  fromIso: string,
  toIso: string,
  priceChangeRate: number,
  options?: RentalCarOptions,
) {
  const from = new Date(fromIso)
  const to = new Date(toIso)
  let totalPrice = 0
  let totalDays = daysBetween(from, to)

  if (car.isDateBasedPrice && car.dateBasedPrices?.length) {
    let currentDate = new Date(from)
    currentDate.setHours(0, 0, 0, 0)
    let currentDay = 1
    while (currentDay <= totalDays) {
      let applicableRate = Number(car.discountedDailyPrice || car.dailyPrice)
      for (const dateBasedPrice of car.dateBasedPrices) {
        if (!dateBasedPrice.startDate || !dateBasedPrice.endDate) {
          continue
        }
        const start = new Date(dateBasedPrice.startDate)
        start.setHours(0, 0, 0, 0)
        const end = new Date(dateBasedPrice.endDate)
        end.setHours(0, 0, 0, 0)
        if (currentDate.getTime() >= start.getTime() && currentDate.getTime() <= end.getTime()) {
          applicableRate = Number(dateBasedPrice.dailyPrice)
          break
        }
      }
      totalPrice += applicableRate
      currentDate.setDate(currentDate.getDate() + 1)
      currentDate.setHours(0, 0, 0, 0)
      currentDay += 1
    }
  } else {
    const totalHours = hoursBetween(from, to)
    totalDays = Math.floor(totalHours / 24)
    const remainingHours = totalHours % 24
    let remainingDays = totalDays

    if (remainingDays >= 30 && (car.discountedMonthlyPrice || car.monthlyPrice)) {
      totalPrice += Number(car.discountedMonthlyPrice || car.monthlyPrice) * Math.floor(remainingDays / 30)
      remainingDays %= 30
    }
    if (remainingDays >= 7 && (car.discountedWeeklyPrice || car.weeklyPrice)) {
      totalPrice += Number(car.discountedWeeklyPrice || car.weeklyPrice) * Math.floor(remainingDays / 7)
      remainingDays %= 7
    }
    if (remainingDays >= 3 && (car.discountedBiWeeklyPrice || car.biWeeklyPrice)) {
      totalPrice += Number(car.discountedBiWeeklyPrice || car.biWeeklyPrice) * Math.floor(remainingDays / 3)
      remainingDays %= 3
    }
    if (remainingDays > 0) {
      totalPrice += Number(car.discountedDailyPrice || car.dailyPrice) * remainingDays
    }
    if (totalDays === 0 || remainingHours > 0) {
      const hourlyRate = car.discountedHourlyPrice || car.hourlyPrice
      if (hourlyRate) {
        totalPrice += Number(hourlyRate) * remainingHours
      } else {
        totalPrice += Number(car.discountedDailyPrice || car.dailyPrice)
      }
    }
  }

  if (options) {
    if (options.cancellation && car.cancellation > 0) {
      totalPrice += car.cancellation
    }
    if (options.amendments && car.amendments > 0) {
      totalPrice += car.amendments
    }
    if (options.theftProtection && car.theftProtection > 0) {
      totalPrice += car.theftProtection * totalDays
    }
    if (options.collisionDamageWaiver && car.collisionDamageWaiver > 0) {
      totalPrice += car.collisionDamageWaiver * totalDays
    }
    if (options.fullInsurance && car.fullInsurance > 0) {
      totalPrice += car.fullInsurance * totalDays
    }
    if (options.additionalDriver && car.additionalDriver > 0) {
      totalPrice += car.additionalDriver * totalDays
    }
  }

  totalPrice += totalPrice * (priceChangeRate / 100)
  return totalPrice
}

export function truncateForOrderName(text: string, max: number) {
  return text.length <= max ? text : text.slice(0, max - 1) + '…'
}
