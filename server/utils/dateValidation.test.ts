import {
  validateDateComponents,
  validateDateRange,
  extractDateComponents,
  type DateComponents,
} from './dateValidation'

describe('dateValidation', () => {
  describe('validateDateComponents', () => {
    describe('valid dates', () => {
      it('should validate a valid date with numeric month', () => {
        const components: DateComponents = {
          day: '5',
          month: '12',
          year: '2025',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(true)
        expect(result.date).toEqual(new Date(2025, 11, 5))
        expect(result.error).toBeUndefined()
      })

      it('should validate a valid date with three-letter month abbreviation', () => {
        const components: DateComponents = {
          day: '15',
          month: 'Mar',
          year: '2024',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(true)
        expect(result.date).toEqual(new Date(2024, 2, 15))
        expect(result.error).toBeUndefined()
      })

      it('should handle lowercase month abbreviations', () => {
        const components: DateComponents = {
          day: '1',
          month: 'jan',
          year: '2024',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(true)
        expect(result.date).toEqual(new Date(2024, 0, 1))
      })

      it('should handle uppercase month abbreviations', () => {
        const components: DateComponents = {
          day: '31',
          month: 'DEC',
          year: '2025',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(true)
        expect(result.date).toEqual(new Date(2025, 11, 31))
      })

      it('should handle mixed case month abbreviations', () => {
        const components: DateComponents = {
          day: '15',
          month: 'JuN',
          year: '2024',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(true)
        expect(result.date).toEqual(new Date(2024, 5, 15))
      })

      it('should handle month abbreviations with whitespace', () => {
        const components: DateComponents = {
          day: '10',
          month: ' Feb ',
          year: '2024',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(true)
        expect(result.date).toEqual(new Date(2024, 1, 10))
      })

      it('should validate all month abbreviations', () => {
        const monthAbbreviations = [
          { abbr: 'Jan', index: 0 },
          { abbr: 'Feb', index: 1 },
          { abbr: 'Mar', index: 2 },
          { abbr: 'Apr', index: 3 },
          { abbr: 'May', index: 4 },
          { abbr: 'Jun', index: 5 },
          { abbr: 'Jul', index: 6 },
          { abbr: 'Aug', index: 7 },
          { abbr: 'Sep', index: 8 },
          { abbr: 'Oct', index: 9 },
          { abbr: 'Nov', index: 10 },
          { abbr: 'Dec', index: 11 },
        ]

        monthAbbreviations.forEach(({ abbr, index }) => {
          const components: DateComponents = {
            day: '15',
            month: abbr,
            year: '2024',
          }
          const result = validateDateComponents(components, 'test date')

          expect(result.isValid).toBe(true)
          expect(result.date?.getMonth()).toBe(index)
        })
      })

      it('should validate leap year date', () => {
        const components: DateComponents = {
          day: '29',
          month: 'Feb',
          year: '2024',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(true)
        expect(result.date).toEqual(new Date(2024, 1, 29))
      })
    })

    describe('missing fields', () => {
      it('should reject when day is missing', () => {
        const components: DateComponents = {
          day: '',
          month: '12',
          year: '2025',
        }
        const result = validateDateComponents(components, 'start date')

        expect(result.isValid).toBe(false)
        expect(result.error).toBe('Enter a start date')
        expect(result.date).toBeUndefined()
      })

      it('should reject when month is missing', () => {
        const components: DateComponents = {
          day: '5',
          month: '',
          year: '2025',
        }
        const result = validateDateComponents(components, 'end date')

        expect(result.isValid).toBe(false)
        expect(result.error).toBe('Enter a end date')
      })

      it('should reject when year is missing', () => {
        const components: DateComponents = {
          day: '5',
          month: '12',
          year: '',
        }
        const result = validateDateComponents(components, 'birth date')

        expect(result.isValid).toBe(false)
        expect(result.error).toBe('Enter a birth date')
      })

      it('should reject when all fields are missing', () => {
        const components: DateComponents = {
          day: '',
          month: '',
          year: '',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(false)
        expect(result.error).toBe('Enter a test date')
      })
    })

    describe('invalid day values', () => {
      it('should reject non-numeric day', () => {
        const components: DateComponents = {
          day: 'abc',
          month: '12',
          year: '2025',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(false)
        expect(result.error).toBe('test date day must be a number')
      })

      it('should reject day out of range (0)', () => {
        const components: DateComponents = {
          day: '0',
          month: '12',
          year: '2025',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(false)
        expect(result.error).toBe('test date must be a real date')
      })

      it('should reject day out of range (32)', () => {
        const components: DateComponents = {
          day: '32',
          month: '12',
          year: '2025',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(false)
        expect(result.error).toBe('test date must be a real date')
      })
    })

    describe('invalid month values', () => {
      it('should reject invalid month abbreviation', () => {
        const components: DateComponents = {
          day: '5',
          month: 'Xyz',
          year: '2025',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(false)
        expect(result.error).toBe('test date month must be a valid month (e.g., Jan, Feb, or 1, 2)')
      })

      it('should reject month number out of range (0)', () => {
        const components: DateComponents = {
          day: '5',
          month: '0',
          year: '2025',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(false)
        expect(result.error).toBe('test date month must be a valid month (e.g., Jan, Feb, or 1, 2)')
      })

      it('should reject month number out of range (13)', () => {
        const components: DateComponents = {
          day: '5',
          month: '13',
          year: '2025',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(false)
        expect(result.error).toBe('test date month must be a valid month (e.g., Jan, Feb, or 1, 2)')
      })

      it('should reject partial month abbreviation', () => {
        const components: DateComponents = {
          day: '5',
          month: 'Ja',
          year: '2025',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(false)
        expect(result.error).toBe('test date month must be a valid month (e.g., Jan, Feb, or 1, 2)')
      })

      it('should reject full month name', () => {
        const components: DateComponents = {
          day: '5',
          month: 'January',
          year: '2025',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(false)
        expect(result.error).toBe('test date month must be a valid month (e.g., Jan, Feb, or 1, 2)')
      })
    })

    describe('invalid year values', () => {
      it('should reject non-numeric year', () => {
        const components: DateComponents = {
          day: '5',
          month: '12',
          year: 'abcd',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(false)
        expect(result.error).toBe('test date year must be a number')
      })
    })

    describe('invalid date combinations', () => {
      it('should reject 31st of February', () => {
        const components: DateComponents = {
          day: '31',
          month: 'Feb',
          year: '2024',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(false)
        expect(result.error).toBe('test date must be a real date')
      })

      it('should reject 29th February in non-leap year', () => {
        const components: DateComponents = {
          day: '29',
          month: 'Feb',
          year: '2023',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(false)
        expect(result.error).toBe('test date must be a real date')
      })

      it('should reject 31st of April', () => {
        const components: DateComponents = {
          day: '31',
          month: 'Apr',
          year: '2024',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(false)
        expect(result.error).toBe('test date must be a real date')
      })

      it('should reject 31st of June', () => {
        const components: DateComponents = {
          day: '31',
          month: '6',
          year: '2024',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(false)
        expect(result.error).toBe('test date must be a real date')
      })

      it('should reject 31st of September', () => {
        const components: DateComponents = {
          day: '31',
          month: 'Sep',
          year: '2024',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(false)
        expect(result.error).toBe('test date must be a real date')
      })

      it('should reject 31st of November', () => {
        const components: DateComponents = {
          day: '31',
          month: '11',
          year: '2024',
        }
        const result = validateDateComponents(components, 'test date')

        expect(result.isValid).toBe(false)
        expect(result.error).toBe('test date must be a real date')
      })
    })
  })

  describe('validateDateRange', () => {
    it('should return true when end date is after start date', () => {
      const startDate = new Date(2024, 0, 1)
      const endDate = new Date(2024, 11, 31)

      expect(validateDateRange(startDate, endDate)).toBe(true)
    })

    it('should return false when end date is before start date', () => {
      const startDate = new Date(2024, 11, 31)
      const endDate = new Date(2024, 0, 1)

      expect(validateDateRange(startDate, endDate)).toBe(false)
    })

    it('should return false when dates are the same', () => {
      const startDate = new Date(2024, 5, 15)
      const endDate = new Date(2024, 5, 15)

      expect(validateDateRange(startDate, endDate)).toBe(false)
    })

    it('should return true when end date is one day after start date', () => {
      const startDate = new Date(2024, 5, 15)
      const endDate = new Date(2024, 5, 16)

      expect(validateDateRange(startDate, endDate)).toBe(true)
    })

    it('should handle dates spanning years', () => {
      const startDate = new Date(2023, 11, 31)
      const endDate = new Date(2024, 0, 1)

      expect(validateDateRange(startDate, endDate)).toBe(true)
    })
  })

  describe('extractDateComponents', () => {
    it('should extract date components with given prefix', () => {
      const body = {
        'start-day': '5',
        'start-month': 'Dec',
        'start-year': '2025',
      }

      const components = extractDateComponents(body, 'start')

      expect(components).toEqual({
        day: '5',
        month: 'Dec',
        year: '2025',
      })
    })

    it('should extract multiple date sets with different prefixes', () => {
      const body = {
        'start-day': '1',
        'start-month': 'Jan',
        'start-year': '2024',
        'end-day': '31',
        'end-month': 'Dec',
        'end-year': '2024',
      }

      const startComponents = extractDateComponents(body, 'start')
      const endComponents = extractDateComponents(body, 'end')

      expect(startComponents).toEqual({
        day: '1',
        month: 'Jan',
        year: '2024',
      })
      expect(endComponents).toEqual({
        day: '31',
        month: 'Dec',
        year: '2024',
      })
    })

    it('should return empty strings for missing fields', () => {
      const body = {
        'other-field': 'value',
      }

      const components = extractDateComponents(body, 'start')

      expect(components).toEqual({
        day: '',
        month: '',
        year: '',
      })
    })

    it('should handle partially missing fields', () => {
      const body = {
        'start-day': '5',
        'start-year': '2025',
      }

      const components = extractDateComponents(body, 'start')

      expect(components).toEqual({
        day: '5',
        month: '',
        year: '2025',
      })
    })

    it('should handle non-string values by preserving them', () => {
      const body = {
        'start-day': 5,
        'start-month': 12,
        'start-year': 2025,
      }

      const components = extractDateComponents(body, 'start')

      // The function preserves values as-is, validation handles type checking
      expect(components).toEqual({
        day: 5,
        month: 12,
        year: 2025,
      })
    })
  })
})
