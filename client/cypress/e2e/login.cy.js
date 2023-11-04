// login.spec.js
describe('Login Form Tests', () => {
  it('validates the login form with valid data', () => {
    cy.visit('localhost:3000/auth/login'); // Assuming your login page is at '/login'

    // Fill in other form fields
    cy.get('[data-testid=inputLoginUsername]').type('byleft555');
    cy.get('[data-testid=inputLoginPassword]').type('byleft555');
    cy.wait(500);

    cy.get('[type=submit]').should('not.be.disabled');

    // Submit the form
    cy.get('[type=submit]').click(); // Submit button selector may vary

    cy.wait(500);

    cy.url().should('include', '/auth/confirmation');
    
    cy.getCookie('tempToken').should('exist');

    cy.get('#inputCode2FA').type('123456');
    cy.get('button').click();
  
    cy.contains('Logout').should('be.visible');
    cy.contains('User Profile').should('be.visible');

    cy.get(':nth-child(4) > .nav-link').click();

    cy.contains('Login').should('be.visible');
    cy.contains('Sign Up').should('be.visible');
  });

  
});
