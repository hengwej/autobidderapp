// login.spec.js
describe('Login Form Tests', () => {

  it('validates logging in with valid credentials and log out functionality', () => {
    cy.visit('localhost:3000/auth/login'); // Assuming your login page is at '/login'

    // Fill in other form fields
    cy.get('[data-testid=inputLoginUsername]').type('byleft555');
    cy.get('[data-testid=inputLoginPassword]').type('byleft555');
    cy.wait(1000);

    cy.get('[type=submit]').should('not.be.disabled');

    // Submit the form
    cy.get('[type=submit]').click(); // Submit button selector may vary

    cy.url().should('include', '/auth/confirmation');

    cy.request({
      method: 'POST',
      url: 'localhost:5000/api/auth/login', // Update with your actual login endpoint
      body: {
        username: 'byleft555',
        password: 'byleft555',
      },
    }).then((response) => {
      // Extract the tempToken from the response body
      const tempToken = response.body.tempToken;

      // Set the tempToken as a cookie
      cy.setCookie('tempToken', tempToken);
    });

    cy.wait(1000);

    cy.get('#inputCode2FA').type('123456');
    cy.get('button').click();

    cy.wait(1000);

    cy.contains('Logout').should('be.visible');
    cy.contains('User Profile').should('be.visible');

    cy.get(':nth-child(4) > .nav-link').click();

    cy.wait(1000);

    cy.contains('Login').should('be.visible');
    cy.contains('Sign Up').should('be.visible');
  });

  it('validates logging in with invalid credentials', () => {
    cy.visit('localhost:3000/auth/login'); // Assuming your login page is at '/login'

    // Fill in other form fields
    cy.get('[data-testid=inputLoginUsername]').type('invalid');
    cy.get('[data-testid=inputLoginPassword]').type('invalid');
    cy.wait(2000);

    cy.get('.error-message').should('be.visible');
    cy.get('[type=submit]').should('be.disabled');


    cy.get('[data-testid=inputLoginUsername]').type('invalid123');
    cy.get('[data-testid=inputLoginPassword]').type('invalid123');

    cy.get('[type=submit]').should('not.be.disabled');

    // Submit the form
    cy.get('[type=submit]').click(); // Submit button selector may vary

    cy.url().should('include', '/auth/login');

  });

});
