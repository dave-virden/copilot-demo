import { Router } from 'express'

import type { Services } from '../services'
import { Page } from '../services/auditService'
import { validateDates } from '../middleware/validateDates'

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
      const { startComponents, endComponents } = res.locals.validatedDates!

      // Success - render a confirmation page or redirect
      return res.render('pages/dates-success', {
        startDate: startComponents,
        endDate: endComponents,
      })
    },
  )

  return router
}
