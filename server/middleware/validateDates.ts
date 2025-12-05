import { Request, Response, NextFunction } from 'express'
import { validateDateComponents, validateDateRange, extractDateComponents } from '../utils/dateValidation'

export interface ValidationError {
  text: string
  href: string
}

export interface DateFieldConfig {
  prefix: string
  fieldName: string
  fieldId: string
  required?: boolean
}

export interface DateRangeConfig {
  startField: DateFieldConfig
  endField: DateFieldConfig
  validateRange?: boolean
}

/**
 * Middleware to validate date input fields
 * Validates dates and optionally checks that end date is after start date
 */
export function validateDates(config: DateRangeConfig) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: ValidationError[] = []
    const { startField, endField, validateRange = true } = config

    // Extract date components from request body
    const startComponents = extractDateComponents(req.body, startField.prefix)
    const endComponents = extractDateComponents(req.body, endField.prefix)

    // Validate start date
    const startValidation = validateDateComponents(startComponents, startField.fieldName)
    if (!startValidation.isValid) {
      errors.push({
        text: startValidation.error!,
        href: `#${startField.fieldId}`,
      })
    }

    // Validate end date
    const endValidation = validateDateComponents(endComponents, endField.fieldName)
    if (!endValidation.isValid) {
      errors.push({
        text: endValidation.error!,
        href: `#${endField.fieldId}`,
      })
    }

    // If both dates are valid, optionally validate the range
    if (validateRange && startValidation.isValid && endValidation.isValid) {
      if (!validateDateRange(startValidation.date!, endValidation.date!)) {
        errors.push({
          text: `${endField.fieldName} must be after ${startField.fieldName}`,
          href: `#${endField.fieldId}`,
        })
      }
    }

    // If there are errors, flash them and redirect back
    if (errors.length > 0) {
      req.flash('errors', errors)
      req.flash('formData', req.body)
      return res.redirect(req.originalUrl.replace(/\?.*$/, ''))
    }

    // Store validated dates in res.locals for the route handler to use
    res.locals.validatedDates = {
      start: startValidation.date,
      end: endValidation.date,
      startComponents,
      endComponents,
    }

    return next()
  }
}

/**
 * Middleware to validate a single date field
 */
export function validateSingleDate(config: DateFieldConfig) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: ValidationError[] = []

    // Extract date components from request body
    const dateComponents = extractDateComponents(req.body, config.prefix)

    // Validate date
    const validation = validateDateComponents(dateComponents, config.fieldName)
    if (!validation.isValid) {
      errors.push({
        text: validation.error!,
        href: `#${config.fieldId}`,
      })
    }

    // If there are errors, flash them and redirect back
    if (errors.length > 0) {
      req.flash('errors', errors)
      req.flash('formData', req.body)
      return res.redirect(req.originalUrl.replace(/\?.*$/, ''))
    }

    // Store validated date in res.locals for the route handler to use
    res.locals.validatedDate = {
      date: validation.date,
      components: dateComponents,
    }

    return next()
  }
}

