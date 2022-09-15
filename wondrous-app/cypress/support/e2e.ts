/* eslint-disable import/no-extraneous-dependencies */
import 'cypress-localstorage-commands';
import { dataCy, login } from './commands';

Cypress.Commands.add('dataCy', dataCy);
Cypress.Commands.add('login', login);
