import Page from '../pages/page'
import DatesPage from '../pages/dates'

context('Dates Route - Diagnostic', () => {
  it('can access the dates page', () => {
    cy.visit('/dates')
    cy.get('h1').should('exist')
    cy.get('h1').then($h1 => {
      cy.log('H1 content:', $h1.text())
    })
  })

  it('verifies page structure', () => {
    cy.visit('/dates')
    cy.get('body').then($body => {
      cy.log('Page loaded')
      cy.log('Body class:', $body.attr('class'))
    })
  })

  it('checks for form elements', () => {
    cy.visit('/dates')
    cy.get('form').should('exist')
    cy.get('#start-day').should('exist')
  })
})

