/* eslint-disable cypress/no-unnecessary-waiting */
import { generateShortId } from '../support/commands';

const USERNAME = 'cypressuser';

const TASK_TITLE = generateShortId('title');

describe('Task Spec', () => {
  before(() => {
    cy.restoreLocalStorage();
    cy.login();
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.visit('/dashboard');
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('Create task', () => {
    cy.dataCy('header-button-create').click();
    cy.dataCy('modal-base');
    cy.dataCy('modal-item-Task').click();
    cy.dataCy('modal-create-entity');
    cy.dataCy('create-entity-input-title').type(TASK_TITLE);
    cy.get('[role=textbox]').type('test description');
    cy.dataCy('button-add-assignee').click();
    cy.dataCy('input-autocomplete-assignee').click().type(USERNAME);
    cy.dataCy(`assignee-option-${USERNAME}`).click();
    cy.dataCy('create-entity-button-submit').click();
  });

  it('Edit task', () => {
    cy.reload();

    cy.dataCy(`task-card-item-${TASK_TITLE}`);
    cy.dataCy(`task-card-item-${TASK_TITLE}-link`).first().click();
    cy.dataCy('button-more-actions').click();
    cy.dataCy('task-header-option-Edit').click();
    cy.dataCy('create-entity-input-title').clear().type(`edit-${TASK_TITLE}`);
    cy.dataCy('create-entity-button-submit').click();
    cy.dataCy(`task-card-item-edit-${TASK_TITLE}`);
  });
});

export {};
