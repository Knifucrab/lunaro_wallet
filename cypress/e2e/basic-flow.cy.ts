describe('Wonderland Wallet - Basic Flow', () => {
  it('loads the homepage correctly', () => {
    cy.visit('/');

    // Check title
    cy.title().should('contain', 'Wonderland Wallet');

    // Should show connect wallet screen
    cy.contains('Connect Your Wallet').should('be.visible');
    cy.contains('please connect your wallet first').should('be.visible');
  });

  it('shows the knifucrab logo', () => {
    cy.visit('/');

    // Check for the logo
    cy.get('img[alt="Knifucrab Logo"]')
      .should('be.visible')
      .and('have.attr', 'src', '/knifucrab.svg');
  });

  it('displays connect button', () => {
    cy.visit('/');

    // RainbowKit connect button should be present
    cy.get('button').contains('Connect').should('be.visible');
  });

  // Note: We can't easily test wallet connection in E2E without MetaMask extension
  // So we'll keep it simple and test the UI elements
});
