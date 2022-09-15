describe('test spec', () => {
  it('passes', () => {
    cy.visit('/dashboard');
    cy.dataCy('test');
  });
});

export {};
