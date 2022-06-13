/// <reference types="cypress" />

describe('happy path', () => {
  it('runs happy path successfully', () => {
    cy.visit('/');
    cy.getTestEl('table_link').should('be.visible');
    cy.getTestEl('you_go_link').should('be.visible');
    cy.getTestEl('policyholders_link').should('be.visible');

    cy.intercept('GET', '/api/policyholders').as('loadPolicyholders')
    cy.get('a[href*="policyholders"]').click();
    
    cy.wait('@loadPolicyholders').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      cy.get('h5').should(($h5) => {
        const text = $h5.text()
        expect(text).to.match(/Mrs. Holder/);
      })
    });
  });
});
