/* eslint-disable import/prefer-default-export */
const EMAIL = 'test@wonderverse.xyz';
const PASSWORD = 'Testing123';

export const dataCy = (value: string) => cy.get(`[data-cy=${value}]`);

export const hasOperationName = (req, operationName) => {
  const { body } = req;
  return body.operationName && body.operationName === operationName;
};

export const aliasQuery = (req, operationName) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Query`;
    req.continue();
  }
};

export const aliasMutation = (req, operationName) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Mutation`;
  }
};

export const generateShortId = (name) => `${name}_${Cypress._.random(0, 1e6)}`;

export const login = () => {
  cy.intercept('POST', '**/graphql', (req) => {
    aliasQuery(req, 'getUserPermissionContext');
    aliasQuery(req, 'getPerStatusTaskCountForUserBoard');
    aliasQuery(req, 'getNotifications');
    aliasQuery(req, 'getUserOrgs');
    aliasQuery(req, 'emailSignin');
  });
  cy.visit('/login');
  cy.dataCy('input-email').type(EMAIL);
  cy.dataCy('input-password').type(PASSWORD);
  cy.dataCy('button-login').first().click();
  cy.wait('@gqlemailSigninQuery');
  cy.url({ timeout: 18000 }).should('include', 'mission-control');
  cy.wait('@gqlgetUserPermissionContextQuery');
  cy.wait('@gqlgetPerStatusTaskCountForUserBoardQuery');
  cy.wait('@gqlgetNotificationsQuery');
  cy.wait('@gqlgetUserOrgsQuery');
};
