import Page, { PageElement } from './page'

export default class DatesSuccessPage extends Page {
  constructor() {
    super('Dates received')
  }

  summaryList = (): PageElement => cy.get('.govuk-summary-list')

  startDateValue = (): PageElement => cy.get('.govuk-summary-list__row').eq(0).find('.govuk-summary-list__value')

  endDateValue = (): PageElement => cy.get('.govuk-summary-list__row').eq(1).find('.govuk-summary-list__value')

  totalDaysValue = (): PageElement => cy.get('.govuk-summary-list__row').eq(2).find('.govuk-summary-list__value')

  insetText = (): PageElement => cy.get('.govuk-inset-text')

  enterDifferentDatesLink = (): PageElement => cy.contains('a', 'Enter different dates')

  returnHomeLink = (): PageElement => cy.contains('a', 'Return to home')
}
