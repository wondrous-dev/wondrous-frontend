// .storybook/preview.js
// import * as NextImage from 'next/image';
import { themes } from '@storybook/theming';

import '../styles/body.css';
import '../styles/globals.css';

export const parameters = {
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
  }
};
