import { pncFormatValidator } from '../../server/utils/pncValidator'

context('PNC Generator page', () => {
  beforeEach(() => {
    cy.task('reset')
  })

  it('loads and displays a short and long form PNC in the correct format', () => {
    cy.visit('/pnc-generator')

    cy.get('h1').contains('PNC Generator')

    // Short form
    cy.get('p')
      .contains('Short form PNC:')
      .invoke('text')
      .then(text => {
        const match = text.match(/Short form PNC:\s*(\d{2}\/\d{1,7}[A-Z])/)
        expect(match).to.not.equal(null)
        const pnc = match![1]
        const isValid = pncFormatValidator(pnc)
        expect(isValid).to.equal(true)
      })

    // Long form
    cy.get('p')
      .contains('Long form PNC:')
      .invoke('text')
      .then(text => {
        const match = text.match(/Long form PNC:\s*(\d{4}\/\d{7}[A-Z])/)
        expect(match).to.not.equal(null)
        const pnc = match![1]
        const isValid = pncFormatValidator(pnc)
        expect(isValid).to.equal(true)
      })
  })
})
