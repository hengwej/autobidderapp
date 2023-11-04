// login.spec.js
describe('Login Form Tests', () => {
  it('validates the login form with valid data', () => {
    cy.visit('localhost:3000/auth/login'); // Assuming your login page is at '/login'

    // Fill in other form fields
    cy.get('[data-testid=inputLoginUsername]').type('byleft555');
    cy.get('[data-testid=inputLoginPassword]').type('byleft555');
    cy.wait(1000);

    cy.get('[type=submit]').should('not.be.disabled');

    cy.setCookie('tempToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SUQiOjcsIm90cCI6Ijc2ODE4MCIsInRpbWVzdGFtcCI6IjIwMjMtMTEtMDRUMDc6MDA6NTEuNjA2WiIsImlhdCI6MTY5OTA4MTI1MSwiZXhwIjoxNjk5MDgxODUxfQ.OKvj0O37urPvTj42Kbt5MUdUqQyDDToWIEwbL6jue_I')

    // Submit the form
    cy.get('[type=submit]').click(); // Submit button selector may vary

    // Assert the desired behavior
    // ...
    cy.url().should('include', '/auth/confirmation');
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#inputCode2FA').type('123456');
    cy.get('button').click();
    /* ==== End Cypress Studio ==== */
  });
});
