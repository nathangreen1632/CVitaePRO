describe('Session Timeout and Activity Detector', () => {
  const loginURL = '/login';
  const dashboardURL = '/dashboard';

  const apiLogin = () => {
    cy.request('POST', '/api/auth/login', {
      username: 'testuser',
      password: 'password123',
    }).then((response) => {
      expect(response.status).to.eq(200);
      window.localStorage.setItem('token', response.body.token);
      window.localStorage.setItem('user', response.body.username);
    });
  };

  const visitDashboard = () => {
    apiLogin();
    cy.visit(dashboardURL);
    cy.contains('Welcome to your Dashboard', { timeout: 5000 }).should('be.visible');
  };

  const flushIntervals = (totalMs: number, intervalMs: number) => {
    const steps = totalMs / intervalMs;
    for (let i = 0; i < steps; i++) {
      cy.tick(intervalMs);
    }
  };

  it('shows session warning modal after 15 minutes of inactivity', () => {
    cy.clock();
    visitDashboard();

    cy.tick(15 * 60 * 1000);

    cy.contains('Session Expiring Soon', { timeout: 5000 }).should('be.visible');
    cy.contains('Confirm to stay logged in').should('exist');
    cy.get('button[aria-label="I\'m still here"]').should('exist');
  });

  it('resets inactivity timer and refreshes token on user activity', () => {
    cy.clock();
    visitDashboard();

    cy.window().then((win) => {
      const now = Math.floor(Date.now() / 1000);
      const exp = now + 2 * 60;
      const payload = btoa(JSON.stringify({ exp }));
      const token = `header.${payload}.sig`;
      win.localStorage.setItem('token', token);
    });

    cy.reload();

    cy.tick(14 * 60 * 1000);
    cy.contains('Session Expiring Soon').should('not.exist');

    cy.get('body').trigger('mousemove');

    cy.tick(60 * 1000);
    cy.contains('Session Expiring Soon').should('not.exist');
  });

  it('logs user out if modal appears and user ignores it', () => {
    cy.clock();
    visitDashboard();

    cy.tick(15 * 60 * 1000);

    cy.contains('Session Expiring Soon', { timeout: 5000 }).should('be.visible');

    flushIntervals(4 * 60 * 1000, 1000);

    cy.location('pathname', { timeout: 10000 }).should('eq', loginURL);

    cy.contains('Session Expiring Soon').should('not.exist');

    cy.contains('Welcome to your Dashboard').should('not.exist');

    cy.window().should((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
    });
  });

  it('closes modal and resets timers when user clicks "I\'m still here"', () => {
    cy.clock();
    visitDashboard();

    cy.tick(15 * 60 * 1000);

    cy.contains('Session Expiring Soon', { timeout: 5000 }).should('be.visible');

    cy.get('button[aria-label="I\'m still here"]').click();

    cy.contains('Session Expiring Soon').should('not.exist');

    cy.tick(10 * 60 * 1000);

    cy.contains('Session Expiring Soon').should('not.exist');
  });
});
