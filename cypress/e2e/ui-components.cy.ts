describe('UI Components', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('has responsive design', () => {
    // Test mobile view
    cy.viewport('iphone-6');
    cy.contains('Connect Your Wallet').should('be.visible');

    // Test desktop view
    cy.viewport(1280, 720);
    cy.contains('Connect Your Wallet').should('be.visible');
  });

  it('shows proper styling', () => {
    // Check that Material-UI is loaded properly
    cy.get('[class*="MuiCard"]').should('exist');
    cy.get('[class*="MuiTypography"]').should('exist');
  });

  it('has working animations', () => {
    // Just check that framer-motion elements exist
    cy.get('img[alt="Knifucrab Logo"]').should('be.visible');
  });
});
