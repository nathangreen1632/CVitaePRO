/// <reference types="cypress" />

describe('Invalid Login Attempt', () => {
  it('displays an error when login fails with wrong credentials', () => {
    cy.visit('/login');

    const usernameSelector = 'input[placeholder="Username"]';
    const passwordSelector = 'input[placeholder="Password"]';
    const submitSelector = 'button[type="submit"]';

    // Enter wrong credentials
    cy.get(usernameSelector, { timeout: 10000 }).should('exist');
    cy.get(usernameSelector).should('be.visible');
    cy.get(usernameSelector).should('be.enabled');
    cy.get(usernameSelector).type('wronguser');

    cy.get(passwordSelector, { timeout: 10000 }).should('exist');
    cy.get(passwordSelector).should('be.visible');
    cy.get(passwordSelector).should('be.enabled');
    cy.get(passwordSelector).type('wrongpass');

    cy.get(submitSelector, { timeout: 10000 }).should('exist');
    cy.get(submitSelector).should('be.visible');
    cy.get(submitSelector).should('not.be.disabled');
    cy.get(submitSelector).click();

    // Confirm error message appears
    cy.contains('Invalid credentials', { timeout: 3000 }).should('be.visible');

    // Should remain on login page
    cy.url({ timeout: 500 }).should('include', '/login');
  });
});
