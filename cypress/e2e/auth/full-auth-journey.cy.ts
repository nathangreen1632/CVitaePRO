/// <reference types="cypress" />

describe('Full Auth Journey', () => {
  it('logs in, loads dashboard, validates state, logs out, and blocks reentry', () => {
    cy.visit('/login');

    // Username input
    const usernameSelector = 'input[placeholder="Username"]';
    cy.get(usernameSelector, { timeout: 10000 }).should('exist');
    cy.get(usernameSelector).should('be.visible');
    cy.get(usernameSelector).should('be.enabled');
    cy.get(usernameSelector).type('testuser');

    // Password input
    const passwordSelector = 'input[placeholder="Password"]';
    cy.get(passwordSelector, { timeout: 10000 }).should('exist');
    cy.get(passwordSelector).should('be.visible');
    cy.get(passwordSelector).should('be.enabled');
    cy.get(passwordSelector).type('password123');

    // Submit login
    const submitSelector = 'button[type="submit"]';
    cy.get(submitSelector, { timeout: 10000 }).should('exist');
    cy.get(submitSelector).should('be.visible');
    cy.get(submitSelector).should('not.be.disabled');
    cy.get(submitSelector).click();

    // Confirm dashboard UI loaded
    cy.contains('Welcome to your Dashboard', { timeout: 5000 }).should('be.visible');

    // Confirm redirect
    cy.url({ timeout: 500 }).should('include', '/dashboard');

    // ✅ Check for key dashboard sections
    cy.contains('Recent Activity').should('exist');
    cy.contains('Your Resumes').should('exist');

    // ✅ Validate localStorage token
    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      expect(token).to.exist;
      expect(token).to.have.length.greaterThan(10);
    });

    // ✅ Click Logout
    const logoutSelector = 'button:contains("Logout")';
    cy.get(logoutSelector, { timeout: 5000 }).should('exist');
    cy.get(logoutSelector).click();

    // ✅ Confirm redirect to login
    cy.url({ timeout: 1000 }).should('include', '/login');

    // ✅ Confirm token cleared from localStorage
    cy.window().then((win) => {
      const cleared = win.localStorage.getItem('token');
      expect(cleared).to.be.null;
    });

    // ✅ Try to visit dashboard again — should fail
    cy.visit('/dashboard');
    cy.contains('Welcome to your Dashboard').should('not.exist');
    cy.url({ timeout: 1000 }).should('include', '/login');
  });
});
