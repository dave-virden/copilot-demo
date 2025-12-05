import express from 'express'

export default function pncGeneratorRouter() {
  const router = express.Router()

  router.get('/pnc-generator', (req, res) => {
    return res.render('pages/pnc-generator', { pnc: 'something' })
  })

  return router
}

export {}
