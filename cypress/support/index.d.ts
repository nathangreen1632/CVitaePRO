// cypress/support/index.d.ts

/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in by setting the token directly.
     * @example cy.login('testuser', 'password123')
     */
    login(username: string, password: string): Chainable<void>;
  }
}
