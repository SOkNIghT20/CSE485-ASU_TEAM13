

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should display login form elements', () => {
    // Check if all main elements are visible
    cy.get('#email-input').should('be.visible')
    cy.get('#password-input').should('be.visible')
    cy.get('#login-btn').should('be.visible')
    cy.get('#register-link').should('be.visible')
    cy.get('#forgot-password').should('be.visible')
  })

  it('should show error when terms not accepted', () => {
    cy.get('#email-input').type('test@example.com')
    cy.get('#password-input').type('password123')
    cy.get('#login-btn').click()
    cy.get('.alert-danger').should('be.visible')
      .and('contain', 'Please accept the terms and conditions to continue')
  })

  it('should toggle password visibility', () => {
    cy.get('#password-input').should('have.attr', 'type', 'password')
    cy.get('input[type="checkbox"]').first().click()
    cy.get('#password-input').should('have.attr', 'type', 'text')
  })

  it('should show demo request modal when terms accepted', () => {
    cy.get('#check1').click()
    cy.get('.guest-btn').contains('Apply for Demo').click()
    cy.get('app-demo-request-modal').should('be.visible')
  })

  it('should show error with invalid credentials', () => {
    cy.get('#check1').click() // Accept terms first
    cy.get('#email-input').type('invalid@email.com')
    cy.get('#password-input').type('wrongpassword')
    cy.get('#login-btn').click()
    cy.get('.alert-danger').should('be.visible')
  })


})
