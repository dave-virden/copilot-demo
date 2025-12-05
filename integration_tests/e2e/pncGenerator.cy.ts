import { pncFormatValidator } from '../../server/utils/pncValidator'

context('PNC Generator page', () => {
  beforeEach(() => {
    cy.task('reset')
  })

  it('loads and displays a PNC in the correct format', () => {
    cy.visit('/pnc-generator')

    // Check basic page structure renders
    cy.get('h1').contains('PNC Generator')
    cy.get('p').contains('PNC:')

    // Extract the PNC value from the page text and validate with shared validator
    cy.get('p')
      .contains('PNC:')
      .invoke('text')
      .then(text => {
        const match = text.match(/PNC:\s*(\d{2,4}\/\d{7}[A-Z])/)
        expect(match).to.not.equal(null)
        const pnc = match![1]

        const isValid = pncFormatValidator(pnc)
        expect(isValid).to.equal(true)
      })
  })
})
