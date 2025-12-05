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
  const monthNum = parseInt(month, 10)
  const yearNum = parseInt(year, 10)

  // Check if parsing was successful
  if (Number.isNaN(dayNum) || Number.isNaN(monthNum) || Number.isNaN(yearNum)) {
    return {
      isValid: false,
      error: `${fieldName} must contain numbers`,
    }
  }

  // Create date object (month is 0-indexed in JavaScript)
  const date = new Date(yearNum, monthNum - 1, dayNum)

  // Check if date is valid
  if (Number.isNaN(date.getTime())) {
    return {
      isValid: false,
      error: `${fieldName} must be a real date`,
    }
  }

  // Check if the date components match what was entered
  // (this catches invalid dates like 31/02/2024)
  if (date.getDate() !== dayNum || date.getMonth() !== monthNum - 1 || date.getFullYear() !== yearNum) {
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
