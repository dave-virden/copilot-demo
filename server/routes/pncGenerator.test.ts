import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'
import AuditService from '../services/auditService'
import { pncFormatValidator } from '../utils/pncValidator'

jest.mock('../services/auditService')

const auditService = new AuditService(null) as jest.Mocked<AuditService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      auditService,
    },
  })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /pnc-generator', () => {
  it('should render PNC generator page with short and long form PNC values that validate', async () => {
    const res = await request(app).get('/pnc-generator').expect('Content-Type', /html/).expect(200)

    // Short form
    const shortMatch = res.text.match(/Short form PNC:\s*(\d{2}\/\d{1,7}[A-Z])/)
    expect(shortMatch).not.toBeNull()
    const shortPnc = shortMatch![1]
    expect(pncFormatValidator(shortPnc)).toBe(true)

    // Long form
    const longMatch = res.text.match(/Long form PNC:\s*(\d{4}\/\d{7}[A-Z])/)
    expect(longMatch).not.toBeNull()
    const longPnc = longMatch![1]
    expect(pncFormatValidator(longPnc)).toBe(true)
  })
})
