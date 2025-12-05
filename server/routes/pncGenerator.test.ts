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
  it('should render a page containing a valid PNC (validated by pncValidator)', async () => {
    const res = await request(app).get('/pnc-generator').expect('Content-Type', /html/).expect(200)

    expect(res.text).toContain('PNC:')
    const match = res.text.match(/PNC:\s*(\d{2,4}\/\d{7}[A-Z])/)
    expect(match).not.toBeNull()
    const pnc = match![1]

    // Validate using the shared pncValidator (returns boolean)
    const isValid = pncFormatValidator(pnc)
    expect(isValid).toBe(true)
  })
})
