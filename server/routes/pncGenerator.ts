import express from 'express'
import { generatePncShort, generatePncLong } from '../utils/pnc'

export default function pncGeneratorRouter() {
  const router = express.Router()

  router.get('/pnc-generator', (req, res) => {
    const pncShort = generatePncShort()
    const pncLong = generatePncLong()
    return res.render('pages/pnc-generator', { pncShort, pncLong })
  })

  return router
}
