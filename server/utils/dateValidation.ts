export interface DateComponents {
  day: string
  month: string
  year: string
}

export interface DateValidationResult {
  isValid: boolean
  date?: Date
  error?: string
}

const MONTH_ABBREVIATIONS: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
}

/**
 * Parses a month string that can be either numeric (1-12) or a three-letter abbreviation (Jan, Feb, etc.)
 * Returns the month index (0-11) or NaN if invalid
 */
function parseMonth(monthStr: string): number {
  // Try parsing as a number first
  const monthNum = parseInt(monthStr, 10)
  if (!Number.isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
    return monthNum - 1 // Convert to 0-indexed
  }

  // Try parsing as a three-letter abbreviation
  const monthAbbr = monthStr.toLowerCase().trim()
  if (monthAbbr in MONTH_ABBREVIATIONS) {
    return MONTH_ABBREVIATIONS[monthAbbr]
  }

  return NaN
}

/**
 * Validates date components and returns a Date object if valid
 */
export function validateDateComponents(components: DateComponents, fieldName: string): DateValidationResult {
  const { day, month, year } = components

  // Check if all fields are provided
  if (!day || !month || !year) {
    return {
      isValid: false,
      error: `Enter a ${fieldName}`,
    }
  }

  // Parse the components
  const dayNum = parseInt(day, 10)
  const monthIndex = parseMonth(month)
  const yearNum = parseInt(year, 10)

  // Check if parsing was successful
  if (Number.isNaN(dayNum)) {
    return {
      isValid: false,
      error: `${fieldName} day must be a number`,
    }
  }

  if (Number.isNaN(monthIndex)) {
    return {
      isValid: false,
      error: `${fieldName} month must be a valid month (e.g., Jan, Feb, or 1, 2)`,
    }
  }

  if (Number.isNaN(yearNum)) {
    return {
      isValid: false,
      error: `${fieldName} year must be a number`,
    }
  }

  // Create date object (month is 0-indexed in JavaScript)
  const date = new Date(yearNum, monthIndex, dayNum)

  // Check if date is valid
  if (Number.isNaN(date.getTime())) {
    return {
      isValid: false,
      error: `${fieldName} must be a real date`,
    }
  }

  // Check if the date components match what was entered
  // (this catches invalid dates like 31/02/2024)
  if (date.getDate() !== dayNum || date.getMonth() !== monthIndex || date.getFullYear() !== yearNum) {
    return {
      isValid: false,
      error: `${fieldName} must be a real date`,
    }
  }

  return {
    isValid: true,
    date,
  }
}

/**
 * Validates that endDate is after startDate
 */
export function validateDateRange(startDate: Date, endDate: Date): boolean {
  return endDate > startDate
}

/**
 * Extracts date components from request body with a given prefix
 */
export function extractDateComponents(body: Record<string, unknown>, prefix: string): DateComponents {
  return {
    day: (body[`${prefix}-day`] as string) || '',
    month: (body[`${prefix}-month`] as string) || '',
    year: (body[`${prefix}-year`] as string) || '',
  }
}
