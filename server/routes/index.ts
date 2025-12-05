import { Router } from 'express'

import type { Services } from '../services'
import { Page } from '../services/auditService'
import pncGeneratorRouter from './pncGenerator'

export default function routes({ auditService }: Services): Router {
  const router = Router()

  router.get('/', async (req, res) => {
    await auditService.logPageView(Page.EXAMPLE_PAGE, { who: 'anonymous', correlationId: req.id })

    return res.render('pages/index')
  })

  // Mount PNC generator route
  router.use(pncGeneratorRouter())

  return router
}
