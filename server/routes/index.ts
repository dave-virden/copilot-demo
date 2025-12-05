import { Router } from 'express'

import type { Services } from '../services'
import { Page } from '../services/auditService'
import { validateDates } from '../middleware/validateDates'
import { formatDateWithMonthName, formatDateInterval, calculateInclusiveDays } from '../utils/dateFormatting'

export default function routes({ auditService }: Services): Router {
  const router = Router()

  router.get('/', async (req, res) => {
    await auditService.logPageView(Page.EXAMPLE_PAGE, { who: 'anonymous', correlationId: req.id })

    return res.render('pages/index')
  })

  router.get('/dates', async (req, res) => {
    await auditService.logPageView(Page.EXAMPLE_PAGE, { who: 'anonymous', correlationId: req.id })

    return res.render('pages/dates', {
      errors: req.flash('errors'),
      formData: req.flash('formData')[0] || {},
    })
  })

  router.post(
    '/dates',
    validateDates({
      startField: {
        prefix: 'start',
        fieldName: 'start date',
        fieldId: 'start-date',
      },
      endField: {
        prefix: 'end',
        fieldName: 'end date',
        fieldId: 'end-date',
      },
      validateRange: true,
    }),
    async (req, res) => {
      // Validated dates are now available in res.locals.validatedDates
      const { start, end, startComponents, endComponents } = res.locals.validatedDates!

      // Format dates with month names
      const formattedStartDate = formatDateWithMonthName(start)
      const formattedEndDate = formatDateWithMonthName(end)

      // Calculate inclusive interval
      const totalDays = calculateInclusiveDays(start, end)
      const intervalDescription = formatDateInterval(start, end)

      // Success - render a confirmation page or redirect
      return res.render('pages/dates-success', {
        startDate: startComponents,
        endDate: endComponents,
        formattedStartDate,
        formattedEndDate,
        totalDays,
        intervalDescription,
      })
    },
  )

  return router
}
