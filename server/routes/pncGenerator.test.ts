import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'
import AuditService from '../services/auditService'

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
  it('should render a page containing a random string (PNC) of length 10', async () => {
    const res = await request(app).get('/pnc-generator').expect('Content-Type', /html/).expect(200)
  })
})
