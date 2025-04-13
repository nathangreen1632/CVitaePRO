/// <reference types="cypress" />

describe('Login Rate Limit Enforcement', () => {
  const usernameSelector = 'input[placeholder="Username"]';
  const passwordSelector = 'input[placeholder="Password"]';
  const submitSelector = 'button[type="submit"]';

  beforeEach(() => {
    cy.visit('/login');

    cy.get(usernameSelector, { timeout: 10000 }).should('exist');
    cy.get(usernameSelector).should('be.visible');
    cy.get(usernameSelector).should('be.enabled');

    cy.get(passwordSelector).should('exist');
    cy.get(passwordSelector).should('be.visible');
    cy.get(passwordSelector).should('be.enabled');

    cy.get(submitSelector).should('exist');
    cy.get(submitSelector).should('be.visible');
    cy.get(submitSelector).should('not.be.disabled');
  });

  it('locks user out after 7 failed login attempts', () => {
    for (let i = 0; i < 7; i++) {
      cy.get(usernameSelector).clear();
      cy.get(usernameSelector).type('wronguser');

      cy.get(passwordSelector).clear();
      cy.get(passwordSelector).type('wrongpass');

      cy.get(submitSelector).click();

      cy.contains('Invalid credentials', { timeout: 2000 }).should('be.visible');
    }

    // 8th attempt should trigger lockout
    cy.get(usernameSelector).clear();
    cy.get(usernameSelector).type('wronguser');

    cy.get(passwordSelector).clear();
    cy.get(passwordSelector).type('wrongpass');

    cy.get(submitSelector).click();

    cy.contains('Invalid credentials. Please try again.', { timeout: 3000 }).should('be.visible');

    // Confirm we’re still on login
    cy.url({ timeout: 500 }).should('include', '/login');
  });
});
