import Page, { PageElement } from './page'

export default class DatesPage extends Page {
  constructor() {
    super('Enter two dates')
  }

  startDayInput = (): PageElement => cy.get('#start-day')

  startMonthInput = (): PageElement => cy.get('#start-month')

  startYearInput = (): PageElement => cy.get('#start-year')

  endDayInput = (): PageElement => cy.get('#end-day')

  endMonthInput = (): PageElement => cy.get('#end-month')

  endYearInput = (): PageElement => cy.get('#end-year')

  continueButton = (): PageElement => cy.get('button[type="submit"]')

  errorSummary = (): PageElement => cy.get('.govuk-error-summary')

  errorSummaryList = (): PageElement => cy.get('.govuk-error-summary__list')

  fillStartDate(day: string, month: string, year: string): void {
    this.startDayInput().clear().type(day)
    this.startMonthInput().clear().type(month)
    this.startYearInput().clear().type(year)
  }

  fillEndDate(day: string, month: string, year: string): void {
    this.endDayInput().clear().type(day)
    this.endMonthInput().clear().type(month)
    this.endYearInput().clear().type(year)
  }

  submitForm(): void {
    this.continueButton().click()
  }
}

