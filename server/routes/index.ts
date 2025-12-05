import { Router } from 'express'

import type { Services } from '../services'
import { Page } from '../services/auditService'

export default function routes({ auditService }: Services): Router {
  const router = Router()

  const siteRoutes = [
    { path: '/', description: 'Home page', hasE2ETest: true },
    { path: '/dashboard', description: 'Dashboard page', hasE2ETest: false },
  ]

  router.get('/', async (req, res) => {
    await auditService.logPageView(Page.EXAMPLE_PAGE, { who: 'anonymous', correlationId: req.id })

    return res.render('pages/index')
  })

  // Dashboard endpoint
  router.get('/dashboard', async (req, res) => {
    await auditService.logPageView(Page.DASHBOARD, { who: 'anonymous', correlationId: req.id })

    return res.render('pages/dashboard', {
      routes: siteRoutes,
    })
  })

  return router
}
