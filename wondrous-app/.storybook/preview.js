// .storybook/preview.js
import { themes } from '@storybook/theming';
import { MockedProvider } from '@apollo/client/testing';

import '../styles/body.css';
import '../styles/globals.css';

export const parameters = {
  apolloClient: {
    MockedProvider,
    addTypename: false,
    // any props you want to pass to MockedProvider on every story
  },
  darkMode: {
    current: 'dark',
    stylePreview: true,
    // Override the default dark theme
    dark: { ...themes.dark, appBg: '#0f0f0f' },
    // Override the default light theme
    light: { ...themes.normal, appBg: 'white' },
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'dark',
    values: [
      {
        name: 'dark',
        value: '#0f0f0f',
      },
    ],
  },
};
