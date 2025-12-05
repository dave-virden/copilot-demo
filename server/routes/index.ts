import { Router } from 'express'

import type { Services } from '../services'
import { Page } from '../services/auditService'

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

  router.post('/dates', async (req, res) => {
    const errors: Array<{ text: string; href: string }> = []
    const { startDay, startMonth, startYear, endDay, endMonth, endYear } = req.body

    // Validate start date
    if (!startDay || !startMonth || !startYear) {
      errors.push({ text: 'Enter a start date', href: '#start-date' })
    } else {
      const startDate = new Date(parseInt(startYear), parseInt(startMonth) - 1, parseInt(startDay))
      if (isNaN(startDate.getTime())) {
        errors.push({ text: 'Start date must be a real date', href: '#start-date' })
      }
    }

    // Validate end date
    if (!endDay || !endMonth || !endYear) {
      errors.push({ text: 'Enter an end date', href: '#end-date' })
    } else {
      const endDate = new Date(parseInt(endYear), parseInt(endMonth) - 1, parseInt(endDay))
      if (isNaN(endDate.getTime())) {
        errors.push({ text: 'End date must be a real date', href: '#end-date' })
      }
    }

    // Validate that end date is after start date
    if (errors.length === 0) {
      const startDate = new Date(parseInt(startYear), parseInt(startMonth) - 1, parseInt(startDay))
      const endDate = new Date(parseInt(endYear), parseInt(endMonth) - 1, parseInt(endDay))
      if (endDate <= startDate) {
        errors.push({ text: 'End date must be after start date', href: '#end-date' })
      }
    }

    if (errors.length > 0) {
      req.flash('errors', errors)
      req.flash('formData', req.body)
      return res.redirect('/dates')
    }

    // Success - render a confirmation page or redirect
    return res.render('pages/dates-success', {
      startDate: { day: startDay, month: startMonth, year: startYear },
      endDate: { day: endDay, month: endMonth, year: endYear },
    })
  })

  return router
}
