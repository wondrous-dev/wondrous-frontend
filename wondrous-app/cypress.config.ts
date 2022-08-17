/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'xw5k6b', // TODO: We need to create a new `projectId`
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-localstorage-commands/plugin')(on, config);
      return config;
    },
    baseUrl: 'http://localhost:3000',
  },
});
