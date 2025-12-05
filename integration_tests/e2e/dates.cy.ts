import Page from '../pages/page'
import DatesPage from '../pages/dates'
import DatesSuccessPage from '../pages/datesSuccess'

context('Dates Route', () => {
  beforeEach(() => {
    cy.task('reset')
  })

  describe('Navigation', () => {
    it('should display the dates form when visiting /dates', () => {
      cy.visit('/dates')
      Page.verifyOnPage(DatesPage)
    })

    it('should have a link to dates page from home', () => {
      cy.visit('/')
      cy.contains('a', 'Enter two dates').should('be.visible')
      cy.contains('a', 'Enter two dates').click()
      Page.verifyOnPage(DatesPage)
    })
  })

  describe('Form Display', () => {
    beforeEach(() => {
      cy.visit('/dates')
    })

    it('should display all date input fields', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.startDayInput().should('be.visible')
      datesPage.startMonthInput().should('be.visible')
      datesPage.startYearInput().should('be.visible')
      datesPage.endDayInput().should('be.visible')
      datesPage.endMonthInput().should('be.visible')
      datesPage.endYearInput().should('be.visible')
    })

    it('should display the continue button', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.continueButton().should('be.visible').should('contain.text', 'Continue')
    })

    it('should show hint text with three-letter month format', () => {
      cy.contains('For example, 27 Mar 2024').should('be.visible')
      cy.contains('For example, 15 Jun 2024').should('be.visible')
    })
  })

  describe('Valid Date Submissions - Numeric Months', () => {
    beforeEach(() => {
      cy.visit('/dates')
    })

    it('should accept valid dates with numeric months', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('1', '1', '2024')
      datesPage.fillEndDate('31', '12', '2024')
      datesPage.submitForm()

      const successPage = Page.verifyOnPage(DatesSuccessPage)
      successPage.startDateValue().should('contain.text', '1 January 2024')
      successPage.endDateValue().should('contain.text', '31 December 2024')
    })

    it('should calculate inclusive days correctly for numeric dates', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('1', '1', '2024')
      datesPage.fillEndDate('7', '1', '2024')
      datesPage.submitForm()

      const successPage = Page.verifyOnPage(DatesSuccessPage)
      successPage.totalDaysValue().should('contain.text', '7 days (inclusive)')
    })

    it('should format interval description for short period', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('1', '12', '2024')
      datesPage.fillEndDate('10', '12', '2024')
      datesPage.submitForm()

      const successPage = Page.verifyOnPage(DatesSuccessPage)
      successPage.insetText().should('contain.text', '1 week and 3 days')
    })
  })

  describe('Valid Date Submissions - Three-Letter Months', () => {
    beforeEach(() => {
      cy.visit('/dates')
    })

    it('should accept three-letter month abbreviations', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('5', 'Mar', '2024')
      datesPage.fillEndDate('15', 'Jun', '2024')
      datesPage.submitForm()

      const successPage = Page.verifyOnPage(DatesSuccessPage)
      successPage.startDateValue().should('contain.text', '5 March 2024')
      successPage.endDateValue().should('contain.text', '15 June 2024')
    })

    it('should accept lowercase month abbreviations', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('1', 'jan', '2024')
      datesPage.fillEndDate('31', 'dec', '2024')
      datesPage.submitForm()

      const successPage = Page.verifyOnPage(DatesSuccessPage)
      successPage.startDateValue().should('contain.text', '1 January 2024')
      successPage.endDateValue().should('contain.text', '31 December 2024')
    })

    it('should accept uppercase month abbreviations', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('15', 'FEB', '2024')
      datesPage.fillEndDate('20', 'APR', '2024')
      datesPage.submitForm()

      const successPage = Page.verifyOnPage(DatesSuccessPage)
      successPage.startDateValue().should('contain.text', '15 February 2024')
      successPage.endDateValue().should('contain.text', '20 April 2024')
    })

    it('should accept mixed case month abbreviations', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('10', 'SeP', '2024')
      datesPage.fillEndDate('25', 'OcT', '2024')
      datesPage.submitForm()

      const successPage = Page.verifyOnPage(DatesSuccessPage)
      successPage.startDateValue().should('contain.text', '10 September 2024')
      successPage.endDateValue().should('contain.text', '25 October 2024')
    })

    it('should test all twelve month abbreviations', () => {
      const months = [
        { abbr: 'Jan', full: 'January' },
        { abbr: 'Feb', full: 'February' },
        { abbr: 'Mar', full: 'March' },
        { abbr: 'Apr', full: 'April' },
        { abbr: 'May', full: 'May' },
        { abbr: 'Jun', full: 'June' },
        { abbr: 'Jul', full: 'July' },
        { abbr: 'Aug', full: 'August' },
        { abbr: 'Sep', full: 'September' },
        { abbr: 'Oct', full: 'October' },
        { abbr: 'Nov', full: 'November' },
        { abbr: 'Dec', full: 'December' },
      ]

      months.forEach(month => {
        cy.visit('/dates')
        const datesPage = Page.verifyOnPage(DatesPage)
        datesPage.fillStartDate('15', month.abbr, '2024')
        datesPage.fillEndDate('20', month.abbr, '2024')
        datesPage.submitForm()

        const successPage = Page.verifyOnPage(DatesSuccessPage)
        successPage.startDateValue().should('contain.text', `15 ${month.full} 2024`)
      })
    })
  })

  describe('Date Interval Formatting', () => {
    beforeEach(() => {
      cy.visit('/dates')
    })

    it('should format two consecutive days correctly', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('5', 'Dec', '2024')
      datesPage.fillEndDate('6', 'Dec', '2024')
      datesPage.submitForm()

      const successPage = Page.verifyOnPage(DatesSuccessPage)
      successPage.totalDaysValue().should('contain.text', '2 days (inclusive)')
      successPage.insetText().should('contain.text', '2 days')
    })

    it('should format multiple days', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('1', 'Dec', '2024')
      datesPage.fillEndDate('5', 'Dec', '2024')
      datesPage.submitForm()

      const successPage = Page.verifyOnPage(DatesSuccessPage)
      successPage.totalDaysValue().should('contain.text', '5 days (inclusive)')
      successPage.insetText().should('contain.text', '5 days')
    })

    it('should format exact weeks', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('1', 'Dec', '2024')
      datesPage.fillEndDate('14', 'Dec', '2024')
      datesPage.submitForm()

      const successPage = Page.verifyOnPage(DatesSuccessPage)
      successPage.insetText().should('contain.text', '2 weeks')
    })

    it('should format weeks and days', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('1', 'Dec', '2024')
      datesPage.fillEndDate('17', 'Dec', '2024')
      datesPage.submitForm()

      const successPage = Page.verifyOnPage(DatesSuccessPage)
      successPage.insetText().should('contain.text', '2 weeks and 3 days')
    })

    it('should format approximate months', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('1', 'Jan', '2024')
      datesPage.fillEndDate('10', 'Apr', '2024')
      datesPage.submitForm()

      const successPage = Page.verifyOnPage(DatesSuccessPage)
      successPage.insetText().should('contain.text', 'approximately')
      successPage.insetText().should('contain.text', 'months')
    })
  })

  describe('Validation Errors - Missing Fields', () => {
    beforeEach(() => {
      cy.visit('/dates')
    })

    it('should show error when start date is missing', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillEndDate('31', 'Dec', '2024')
      datesPage.submitForm()

      datesPage.errorSummary().should('be.visible')
      datesPage.errorSummaryList().should('contain.text', 'Enter a start date')
    })

    it('should show error when end date is missing', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('1', 'Jan', '2024')
      datesPage.submitForm()

      datesPage.errorSummary().should('be.visible')
      datesPage.errorSummaryList().should('contain.text', 'Enter an end date')
    })

    it('should show error when both dates are missing', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.submitForm()

      datesPage.errorSummary().should('be.visible')
      datesPage.errorSummaryList().should('contain.text', 'Enter a start date')
      datesPage.errorSummaryList().should('contain.text', 'Enter an end date')
    })

    it('should preserve form data when validation fails', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('5', 'Dec', '2024')
      datesPage.submitForm()

      datesPage.errorSummary().should('be.visible')
      datesPage.startDayInput().should('have.value', '5')
      datesPage.startMonthInput().should('have.value', 'Dec')
      datesPage.startYearInput().should('have.value', '2024')
    })
  })

  describe('Validation Errors - Invalid Dates', () => {
    beforeEach(() => {
      cy.visit('/dates')
    })

    it('should reject invalid day', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('abc', 'Jan', '2024')
      datesPage.fillEndDate('15', 'Dec', '2024')
      datesPage.submitForm()

      datesPage.errorSummary().should('be.visible')
      datesPage.errorSummaryList().should('contain.text', 'day must be a number')
    })

    it('should reject invalid month abbreviation', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('5', 'Xyz', '2024')
      datesPage.fillEndDate('15', 'Dec', '2024')
      datesPage.submitForm()

      datesPage.errorSummary().should('be.visible')
      datesPage.errorSummaryList().should('contain.text', 'month must be a valid month')
    })

    it('should reject invalid month number (0)', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('5', '0', '2024')
      datesPage.fillEndDate('15', '12', '2024')
      datesPage.submitForm()

      datesPage.errorSummary().should('be.visible')
      datesPage.errorSummaryList().should('contain.text', 'month must be a valid month')
    })

    it('should reject invalid month number (13)', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('5', '13', '2024')
      datesPage.fillEndDate('15', '12', '2024')
      datesPage.submitForm()

      datesPage.errorSummary().should('be.visible')
      datesPage.errorSummaryList().should('contain.text', 'month must be a valid month')
    })

    it('should reject invalid year', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('5', 'Dec', 'abcd')
      datesPage.fillEndDate('15', 'Dec', '2024')
      datesPage.submitForm()

      datesPage.errorSummary().should('be.visible')
      datesPage.errorSummaryList().should('contain.text', 'year must be a number')
    })

    it('should reject 31st February', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('31', 'Feb', '2024')
      datesPage.fillEndDate('15', 'Dec', '2024')
      datesPage.submitForm()

      datesPage.errorSummary().should('be.visible')
      datesPage.errorSummaryList().should('contain.text', 'must be a real date')
    })

    it('should reject 29th February in non-leap year', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('29', 'Feb', '2023')
      datesPage.fillEndDate('15', 'Dec', '2024')
      datesPage.submitForm()

      datesPage.errorSummary().should('be.visible')
      datesPage.errorSummaryList().should('contain.text', 'must be a real date')
    })

    it('should accept 29th February in leap year', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('29', 'Feb', '2024')
      datesPage.fillEndDate('1', 'Mar', '2024')
      datesPage.submitForm()

      const successPage = Page.verifyOnPage(DatesSuccessPage)
      successPage.startDateValue().should('contain.text', '29 February 2024')
    })

    it('should reject 31st April', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('31', 'Apr', '2024')
      datesPage.fillEndDate('15', 'Dec', '2024')
      datesPage.submitForm()

      datesPage.errorSummary().should('be.visible')
      datesPage.errorSummaryList().should('contain.text', 'must be a real date')
    })

    it('should reject 31st June', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('1', 'Jan', '2024')
      datesPage.fillEndDate('31', 'Jun', '2024')
      datesPage.submitForm()

      datesPage.errorSummary().should('be.visible')
      datesPage.errorSummaryList().should('contain.text', 'must be a real date')
    })

    it('should reject 31st September', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('31', 'Sep', '2024')
      datesPage.fillEndDate('15', 'Dec', '2024')
      datesPage.submitForm()

      datesPage.errorSummary().should('be.visible')
      datesPage.errorSummaryList().should('contain.text', 'must be a real date')
    })

    it('should reject 31st November', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('1', 'Jan', '2024')
      datesPage.fillEndDate('31', 'Nov', '2024')
      datesPage.submitForm()

      datesPage.errorSummary().should('be.visible')
      datesPage.errorSummaryList().should('contain.text', 'must be a real date')
    })
  })

  describe('Validation Errors - Date Range', () => {
    beforeEach(() => {
      cy.visit('/dates')
    })

    it('should reject when end date is before start date', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('31', 'Dec', '2024')
      datesPage.fillEndDate('1', 'Jan', '2024')
      datesPage.submitForm()

      datesPage.errorSummary().should('be.visible')
      datesPage.errorSummaryList().should('contain.text', 'end date must be after start date')
    })

    it('should reject when dates are the same', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('15', 'Jun', '2024')
      datesPage.fillEndDate('15', 'Jun', '2024')
      datesPage.submitForm()

      datesPage.errorSummary().should('be.visible')
      datesPage.errorSummaryList().should('contain.text', 'end date must be after start date')
    })

    it('should accept when end date is one day after start date', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('15', 'Jun', '2024')
      datesPage.fillEndDate('16', 'Jun', '2024')
      datesPage.submitForm()

      const successPage = Page.verifyOnPage(DatesSuccessPage)
      successPage.totalDaysValue().should('contain.text', '2 days (inclusive)')
    })
  })

  describe('Error Summary Links', () => {
    beforeEach(() => {
      cy.visit('/dates')
    })

    it('should link to start date field when clicked', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.submitForm()

      datesPage.errorSummaryList().contains('a', 'Enter a start date').click()
      datesPage.startDayInput().should('have.focus')
    })

    it('should link to end date field when clicked', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('1', 'Jan', '2024')
      datesPage.submitForm()

      datesPage.errorSummaryList().contains('a', 'Enter an end date').click()
      datesPage.endDayInput().should('have.focus')
    })
  })

  describe('Success Page Navigation', () => {
    beforeEach(() => {
      cy.visit('/dates')
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('1', 'Jan', '2024')
      datesPage.fillEndDate('31', 'Dec', '2024')
      datesPage.submitForm()
    })

    it('should have a link to enter different dates', () => {
      const successPage = Page.verifyOnPage(DatesSuccessPage)
      successPage.enterDifferentDatesLink().should('be.visible')
      successPage.enterDifferentDatesLink().click()
      Page.verifyOnPage(DatesPage)
    })

    it('should have a link to return home', () => {
      const successPage = Page.verifyOnPage(DatesSuccessPage)
      successPage.returnHomeLink().should('be.visible')
      successPage.returnHomeLink().should('have.attr', 'href', '/')
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      cy.visit('/dates')
      cy.get('label[for="start-day"]').should('exist')
      cy.get('label[for="start-month"]').should('exist')
      cy.get('label[for="start-year"]').should('exist')
      cy.get('label[for="end-day"]').should('exist')
      cy.get('label[for="end-month"]').should('exist')
      cy.get('label[for="end-year"]').should('exist')
    })

    it('should have fieldsets with legends', () => {
      cy.visit('/dates')
      cy.get('fieldset legend').contains('Start date').should('be.visible')
      cy.get('fieldset legend').contains('End date').should('be.visible')
    })

    it('should have hint text for date format', () => {
      cy.visit('/dates')
      cy.get('.govuk-hint').should('have.length.at.least', 2)
    })
  })

  describe('Edge Cases', () => {
    beforeEach(() => {
      cy.visit('/dates')
    })

    it('should handle dates spanning years', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('31', 'Dec', '2023')
      datesPage.fillEndDate('1', 'Jan', '2024')
      datesPage.submitForm()

      const successPage = Page.verifyOnPage(DatesSuccessPage)
      successPage.totalDaysValue().should('contain.text', '2 days (inclusive)')
    })

    it('should handle very long date ranges', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('1', 'Jan', '2020')
      datesPage.fillEndDate('31', 'Dec', '2024')
      datesPage.submitForm()

      const successPage = Page.verifyOnPage(DatesSuccessPage)
      successPage.insetText().should('contain.text', 'approximately')
      successPage.insetText().should('contain.text', 'years')
    })

    it('should handle dates with leading zeros', () => {
      const datesPage = Page.verifyOnPage(DatesPage)
      datesPage.fillStartDate('05', '01', '2024')
      datesPage.fillEndDate('09', '01', '2024')
      datesPage.submitForm()

      const successPage = Page.verifyOnPage(DatesSuccessPage)
      successPage.startDateValue().should('contain.text', '5 January 2024')
      successPage.endDateValue().should('contain.text', '9 January 2024')
    })
  })
})
