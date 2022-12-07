describe('test spec', () => {
  it('passes', () => {
    cy.visit('/login');
    cy.dataCy('test');
  });
});

export {};
