/**
 * Formats a date as "DD Month YYYY"
 */
export function formatDateWithMonthName(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

/**
 * Calculates the inclusive number of days between two dates
 */
export function calculateInclusiveDays(startDate: Date, endDate: Date): number {
  const millisecondsPerDay = 1000 * 60 * 60 * 24
  const diffInMilliseconds = endDate.getTime() - startDate.getTime()
  const diffInDays = Math.floor(diffInMilliseconds / millisecondsPerDay)
  return diffInDays + 1 // Add 1 to make it inclusive
}

/**
 * Formats the interval between two dates as a human-readable string
 */
export function formatDateInterval(startDate: Date, endDate: Date): string {
  const days = calculateInclusiveDays(startDate, endDate)

  if (days === 1) {
    return '1 day'
  }

  if (days < 7) {
    return `${days} days`
  }

  const weeks = Math.floor(days / 7)
  const remainingDays = days % 7

  if (days < 31) {
    if (remainingDays === 0) {
      return weeks === 1 ? '1 week' : `${weeks} weeks`
    }
    const weekPart = weeks === 1 ? '1 week' : `${weeks} weeks`
    const dayPart = remainingDays === 1 ? '1 day' : `${remainingDays} days`
    return `${weekPart} and ${dayPart}`
  }

  const months = Math.floor(days / 30)
  const remainingDaysAfterMonths = days % 30

  if (days < 365) {
    if (remainingDaysAfterMonths === 0) {
      return months === 1 ? 'approximately 1 month' : `approximately ${months} months`
    }
    const monthPart = months === 1 ? '1 month' : `${months} months`
    const dayPart = remainingDaysAfterMonths === 1 ? '1 day' : `${remainingDaysAfterMonths} days`
    return `approximately ${monthPart} and ${dayPart}`
  }

  const years = Math.floor(days / 365)
  const remainingDaysAfterYears = days % 365

  if (remainingDaysAfterYears === 0) {
    return years === 1 ? 'approximately 1 year' : `approximately ${years} years`
  }

  const remainingMonthsAfterYears = Math.floor(remainingDaysAfterYears / 30)
  if (remainingMonthsAfterYears > 0) {
    const yearPart = years === 1 ? '1 year' : `${years} years`
    const monthPart = remainingMonthsAfterYears === 1 ? '1 month' : `${remainingMonthsAfterYears} months`
    return `approximately ${yearPart} and ${monthPart}`
  }

  const yearPart = years === 1 ? '1 year' : `${years} years`
  const dayPart = remainingDaysAfterYears === 1 ? '1 day' : `${remainingDaysAfterYears} days`
  return `approximately ${yearPart} and ${dayPart}`
}
