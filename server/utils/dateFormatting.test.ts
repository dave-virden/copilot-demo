import { formatDateWithMonthName, calculateInclusiveDays, formatDateInterval } from './dateFormatting'

describe('dateFormatting', () => {
  describe('formatDateWithMonthName', () => {
    it('should format a date with full month name', () => {
      const date = new Date(2025, 11, 5) // 5 December 2025
      const formatted = formatDateWithMonthName(date)

      expect(formatted).toBe('5 December 2025')
    })

    it('should format first day of month', () => {
      const date = new Date(2024, 0, 1) // 1 January 2024
      const formatted = formatDateWithMonthName(date)

      expect(formatted).toBe('1 January 2024')
    })

    it('should format last day of month', () => {
      const date = new Date(2024, 11, 31) // 31 December 2024
      const formatted = formatDateWithMonthName(date)

      expect(formatted).toBe('31 December 2024')
    })

    it('should format leap year date', () => {
      const date = new Date(2024, 1, 29) // 29 February 2024
      const formatted = formatDateWithMonthName(date)

      expect(formatted).toBe('29 February 2024')
    })

    it('should format all months correctly', () => {
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]

      months.forEach((monthName, index) => {
        const date = new Date(2024, index, 15)
        const formatted = formatDateWithMonthName(date)

        expect(formatted).toBe(`15 ${monthName} 2024`)
      })
    })
  })

  describe('calculateInclusiveDays', () => {
    it('should calculate one day for same date', () => {
      const date = new Date(2024, 0, 1)
      const days = calculateInclusiveDays(date, date)

      expect(days).toBe(1)
    })

    it('should calculate two days for consecutive dates', () => {
      const start = new Date(2024, 0, 1)
      const end = new Date(2024, 0, 2)
      const days = calculateInclusiveDays(start, end)

      expect(days).toBe(2)
    })

    it('should calculate days in same month', () => {
      const start = new Date(2024, 0, 1)
      const end = new Date(2024, 0, 31)
      const days = calculateInclusiveDays(start, end)

      expect(days).toBe(31)
    })

    it('should calculate days across months', () => {
      const start = new Date(2024, 0, 15)
      const end = new Date(2024, 1, 14)
      const days = calculateInclusiveDays(start, end)

      expect(days).toBe(31)
    })

    it('should calculate days across years', () => {
      const start = new Date(2023, 11, 31)
      const end = new Date(2024, 0, 1)
      const days = calculateInclusiveDays(start, end)

      expect(days).toBe(2)
    })

    it('should calculate a full year (non-leap)', () => {
      const start = new Date(2023, 0, 1)
      const end = new Date(2023, 11, 31)
      const days = calculateInclusiveDays(start, end)

      expect(days).toBe(365)
    })

    it('should calculate a full leap year', () => {
      const start = new Date(2024, 0, 1)
      const end = new Date(2024, 11, 31)
      const days = calculateInclusiveDays(start, end)

      expect(days).toBe(366)
    })

    it('should calculate a week', () => {
      const start = new Date(2024, 0, 1)
      const end = new Date(2024, 0, 7)
      const days = calculateInclusiveDays(start, end)

      expect(days).toBe(7)
    })
  })

  describe('formatDateInterval', () => {
    describe('single day', () => {
      it('should format 1 day', () => {
        const start = new Date(2024, 0, 1)
        const end = new Date(2024, 0, 1)
        const interval = formatDateInterval(start, end)

        expect(interval).toBe('1 day')
      })
    })

    describe('days only (less than a week)', () => {
      it('should format 2 days', () => {
        const start = new Date(2024, 0, 1)
        const end = new Date(2024, 0, 2)
        const interval = formatDateInterval(start, end)

        expect(interval).toBe('2 days')
      })

      it('should format 6 days', () => {
        const start = new Date(2024, 0, 1)
        const end = new Date(2024, 0, 6)
        const interval = formatDateInterval(start, end)

        expect(interval).toBe('6 days')
      })
    })

    describe('weeks and days', () => {
      it('should format exactly 1 week', () => {
        const start = new Date(2024, 0, 1)
        const end = new Date(2024, 0, 7)
        const interval = formatDateInterval(start, end)

        expect(interval).toBe('1 week')
      })

      it('should format exactly 2 weeks', () => {
        const start = new Date(2024, 0, 1)
        const end = new Date(2024, 0, 14)
        const interval = formatDateInterval(start, end)

        expect(interval).toBe('2 weeks')
      })

      it('should format 1 week and 1 day', () => {
        const start = new Date(2024, 0, 1)
        const end = new Date(2024, 0, 8)
        const interval = formatDateInterval(start, end)

        expect(interval).toBe('1 week and 1 day')
      })

      it('should format 2 weeks and 3 days', () => {
        const start = new Date(2024, 0, 1)
        const end = new Date(2024, 0, 17)
        const interval = formatDateInterval(start, end)

        expect(interval).toBe('2 weeks and 3 days')
      })

      it('should format 4 weeks', () => {
        const start = new Date(2024, 0, 1)
        const end = new Date(2024, 0, 28)
        const interval = formatDateInterval(start, end)

        expect(interval).toBe('4 weeks')
      })
    })

    describe('months and days (less than a year)', () => {
      it('should format approximately 1 month', () => {
        const start = new Date(2024, 0, 1)
        const end = new Date(2024, 0, 30) // 30 days inclusive
        const interval = formatDateInterval(start, end)

        expect(interval).toBe('4 weeks and 2 days') // 30 days = 4 weeks + 2 days
      })

      it('should format approximately 2 months', () => {
        const start = new Date(2024, 0, 1)
        const end = new Date(2024, 2, 1) // 61 days inclusive
        const interval = formatDateInterval(start, end)

        expect(interval).toBe('approximately 2 months and 1 day') // 61 days = 2*30 + 1
      })

      it('should format approximately 1 month and 5 days', () => {
        const start = new Date(2024, 0, 1)
        const end = new Date(2024, 1, 5) // 36 days inclusive
        const interval = formatDateInterval(start, end)

        expect(interval).toBe('approximately 1 month and 6 days') // 36 days = 30 + 6
      })

      it('should format approximately 3 months and 10 days', () => {
        const start = new Date(2024, 0, 1)
        const end = new Date(2024, 3, 10)
        const interval = formatDateInterval(start, end)

        expect(interval).toBe('approximately 3 months and 10 days')
      })

      it('should format approximately 11 months', () => {
        const start = new Date(2024, 0, 1)
        const end = new Date(2024, 10, 30) // 335 days inclusive
        const interval = formatDateInterval(start, end)

        expect(interval).toBe('approximately 11 months and 5 days') // 335 = 11*30 + 5
      })
    })

    describe('years and months', () => {
      it('should format approximately 1 year', () => {
        const start = new Date(2024, 0, 1)
        const end = new Date(2024, 11, 31) // 366 days (leap year)
        const interval = formatDateInterval(start, end)

        expect(interval).toBe('approximately 1 year and 1 day') // 366 = 365 + 1
      })

      it('should format approximately 2 years', () => {
        const start = new Date(2023, 0, 1)
        const end = new Date(2024, 11, 31) // 731 days
        const interval = formatDateInterval(start, end)

        expect(interval).toBe('approximately 2 years and 1 day') // 731 = 2*365 + 1
      })

      it('should format approximately 1 year and 1 month', () => {
        const start = new Date(2024, 0, 1)
        const end = new Date(2025, 1, 15)
        const interval = formatDateInterval(start, end)

        expect(interval).toBe('approximately 1 year and 1 month')
      })

      it('should format approximately 2 years and 3 months', () => {
        const start = new Date(2023, 0, 1)
        const end = new Date(2025, 3, 15)
        const interval = formatDateInterval(start, end)

        expect(interval).toBe('approximately 2 years and 3 months')
      })

      it('should format approximately 1 year and days when months round to 0', () => {
        const start = new Date(2024, 0, 1)
        const end = new Date(2025, 0, 5) // 371 days (leap year + 5)
        const interval = formatDateInterval(start, end)

        expect(interval).toBe('approximately 1 year and 6 days') // 371 = 365 + 6
      })

      it('should format approximately 3 years and days', () => {
        const start = new Date(2022, 0, 1)
        const end = new Date(2025, 0, 20) // 1116 days
        const interval = formatDateInterval(start, end)

        expect(interval).toBe('approximately 3 years and 21 days') // 1116 = 3*365 + 21
      })
    })
  })
})
