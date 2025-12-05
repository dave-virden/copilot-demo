import fs from 'fs'
import path from 'path'
import xml2js from 'xml2js'
import { Router } from 'express'

import type { Services } from '../services'
import { Page } from '../services/auditService'
import { validateDates } from '../middleware/validateDates'
import { formatDateWithMonthName, formatDateInterval, calculateInclusiveDays } from '../utils/dateFormatting'
import pncGeneratorRouter from './pncGenerator'

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

  router.get('/dates', async (req, res) => {
    await auditService.logPageView(Page.EXAMPLE_PAGE, { who: 'anonymous', correlationId: req.id })

    return res.render('pages/dates', {
      errors: req.flash('errors'),
      formData: req.flash('formData')[0] || {},
    })
  })

  router.post(
    '/dates',
    validateDates({
      startField: {
        prefix: 'start',
        fieldName: 'start date',
        fieldId: 'start-date',
      },
      endField: {
        prefix: 'end',
        fieldName: 'end date',
        fieldId: 'end-date',
      },
      validateRange: true,
    }),
    async (req, res) => {
      // Validated dates are now available in res.locals.validatedDates
      const { start, end, startComponents, endComponents } = res.locals.validatedDates!

      // Format dates with month names
      const formattedStartDate = formatDateWithMonthName(start)
      const formattedEndDate = formatDateWithMonthName(end)

      // Calculate inclusive interval
      const totalDays = calculateInclusiveDays(start, end)
      const intervalDescription = formatDateInterval(start, end)

      // Success - render a confirmation page or redirect
      return res.render('pages/dates-success', {
        startDate: startComponents,
        endDate: endComponents,
        formattedStartDate,
        formattedEndDate,
        totalDays,
        intervalDescription,
      })
    },
  )

  // Mount PNC generator route
  router.use(pncGeneratorRouter())
  // Dashboard endpoint
  router.get('/dashboard', async (req, res) => {
    await auditService.logPageView(Page.DASHBOARD, { who: 'anonymous', correlationId: req.id })

    // Parse test results from jest/junit.xml
    const testResultsPath = path.resolve(process.cwd(), 'test_results/jest/junit.xml'); // Updated to use runtime path
    let testCoverageData = {}

    // Check if the test results file exists
    if (!fs.existsSync(testResultsPath)) {
      console.error('Test results file not found:', testResultsPath)
      return res.render('pages/dashboard', {
        routes: siteRoutes,
        testCoverage: { totalTests: 'N/A', failures: 'N/A', skipped: 'N/A' },
      })
    }

    try {
      const xmlData = fs.readFileSync(testResultsPath, 'utf-8')
      const parser = new xml2js.Parser()
      const result = await parser.parseStringPromise(xmlData)

      // Aggregate test coverage data
      const testsuites = result.testsuites.testsuite || []
      let totalTests = 0
      let totalFailures = 0
      let totalSkipped = 0

      testsuites.forEach((suite: any) => {
        totalTests += parseInt(suite.$.tests, 10) || 0
        totalFailures += parseInt(suite.$.failures, 10) || 0
        totalSkipped += parseInt(suite.$.skipped, 10) || 0
      })

      testCoverageData = {
        totalTests,
        failures: totalFailures,
        skipped: totalSkipped,
      }
      console.log('Parsed Test Coverage Data:', testCoverageData) // Debugging log to verify parsed data
    } catch (error) {
      console.error('Error parsing test results:', error)
    }

    return res.render('pages/dashboard', {
      routes: siteRoutes,
      testCoverage: testCoverageData,
    })
  })

  return router
}
