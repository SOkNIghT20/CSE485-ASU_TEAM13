describe('Search page', () => {
  beforeEach(() => {
    // Login first
    cy.visit('/login')
    cy.get('#email-input').type('bobshapiro40@gmail.com')
    cy.get('#password-input').type('84hello62')
    cy.get('#check1').check() // Accept terms
    cy.get('#login-btn').click()
    cy.url().should('include', '/search')
  })

  it('should display the search interface', () => {
    cy.get('.welcome-box').should('contain', 'DigiClips')
    cy.get('#search-bar').should('be.visible')
  })

  it('should perform a search and show results and buttons', () => {
    cy.get('#search-bar').type('Tariffs{enter}')
    cy.contains('Newspaper Results', { timeout: 10000 }).should('be.visible')
    cy.contains('button', 'Download').should('be.visible')
    cy.contains('button', 'Send email').should('be.visible')
  })

  it('should show advanced options when clicking More options', () => {
    cy.contains('button', 'More options').click()
    cy.contains('Media Source').should('be.visible')
    cy.contains('Media Type').should('be.visible')
  })
})