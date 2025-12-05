import express from 'express'
import { generatePnc } from '../utils/pnc'

export default function pncGeneratorRouter() {
  const router = express.Router()

  router.get('/pnc-generator', (req, res) => {
    const pnc = generatePnc()
    return res.render('pages/pnc-generator', { pnc })
  })

  return router
}
