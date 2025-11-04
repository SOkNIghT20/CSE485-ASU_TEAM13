import { HttpClient, HttpHandler } from '@angular/common/http';
import { LoginComponent } from '../../../src/app/login/login.component';
import { AuthService } from '../../../src/app/services/auth.service';

describe('LoginComponent.cy.ts', () => {
  // it('playground', () => {
  //   cy.mount(LoginComponent, {
  //     providers: [AuthService, HttpClient, HttpHandler],
  //   })
  //   cy.mount()
  // })
  it('mounts', () => {
    cy.mount(LoginComponent, {
          providers: [AuthService, HttpClient, HttpHandler],
      })
      // cy.get('[id=login-btn]').click()
      // cy.get('[data-cy=increment]').click()
      // cy.get('[data-cy=counter]').should('have.text', '1')
  })
  it('login button can be clicked'), () => {
    cy.mount(LoginComponent, {
      providers: [AuthService, HttpClient, HttpHandler],
    })
    cy.get('[id=login-btn]').click()
  }
})