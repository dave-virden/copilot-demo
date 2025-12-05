import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './testutils/appSetup'
import AuditService, { Page } from '../services/auditService'
import fs from 'fs'
import xml2js from 'xml2js'

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

describe('GET /', () => {
  it('should render index page', () => {
    auditService.logPageView.mockResolvedValue(null)

    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('This site is under construction...')
        expect(auditService.logPageView).toHaveBeenCalledWith(Page.EXAMPLE_PAGE, {
          who: 'anonymous',
          correlationId: expect.any(String),
        })
      })
  })
})

describe('GET /dashboard', () => {
  it('should render the dashboard with parsed test coverage data', async () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue(`
      <?xml version="1.0" encoding="UTF-8"?>
      <testsuites tests="36" failures="0" skipped="0">
        <testsuite tests="10" failures="0" skipped="0" />
        <testsuite tests="26" failures="0" skipped="0" />
      </testsuites>
    `)

    jest.spyOn(xml2js, 'Parser').mockImplementation(() => {
      return {
        parseStringPromise: jest.fn().mockResolvedValue({
          testsuites: {
            testsuite: [
              { $: { tests: '10', failures: '0', skipped: '0' } },
              { $: { tests: '26', failures: '0', skipped: '0' } },
            ],
          },
        }),
        parseString: jest.fn(),
        reset: jest.fn(),
        addListener: jest.fn(),
        on: jest.fn(),
        once: jest.fn(),
        removeListener: jest.fn(),
        off: jest.fn(),
        removeAllListeners: jest.fn(),
        setMaxListeners: jest.fn(),
        getMaxListeners: jest.fn(),
        listeners: jest.fn(),
        rawListeners: jest.fn(),
        emit: jest.fn(),
        listenerCount: jest.fn(),
        prependListener: jest.fn(),
        prependOnceListener: jest.fn(),
        eventNames: jest.fn(),
      };
    }); // Fixed missing semicolon

    const response = await request(app).get('/dashboard');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Total Tests: 36');
    expect(response.text).toContain('Failures: 0');
    expect(response.text).toContain('Skipped: 0');
  }); // Fixed missing semicolon

  it('should handle errors when parsing test results', async () => {
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('File not found'); // Fixed missing semicolon
    });

    const response = await request(app).get('/dashboard');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Total Tests: N/A');
    expect(response.text).toContain('Failures: N/A');
    expect(response.text).toContain('Skipped: N/A');
  }); // Fixed missing semicolon
}); // Fixed missing semicolon
