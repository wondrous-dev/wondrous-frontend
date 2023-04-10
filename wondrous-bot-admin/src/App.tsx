import { useMemo, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardPage from 'pages/dashboard';
import { ThemeProvider as StyledComponentProvider } from 'styled-components';

import './App.css';
import CreatePage from 'pages/quests/create';
import Layout from 'components/Layout';
import QuestsPage from 'pages/quests';
import { createTheme, PaletteMode, ThemeProvider } from '@mui/material';
import { THEME_TYPES } from 'utils/constants';
import MembersPage from 'pages/quests/members';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
      {
        path: '/quests',
        element: <QuestsPage />,
      },
      {
        path: '/levels',
        element: <div>levels</div>,
      },
      {
        path: '/quests/create',
        element: <CreatePage />,
      },
      {
        path: '/members',
        element: <MembersPage />
      }
    ],
  },
]);

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          // primaryBackground: '#FFFFFF',
          background: {
            default: '#FFFFFF',
            card: '#FFFFFF',
            cardHover: '#FEE2CA',
            header: '#B9AEEC'
          },
          text: {
            primary: '#000000',
            labelColor: '#2A8D5C',
          },
          
        }
      : {
          // palette values for dark mode
          background: {
            default: '#0C002D',
            card: '#0C002D',
            cardHover: '#3B9669',
            header: '#B9AEEC'
          },
          text: {
            primary: '#FFFFFF',
            labelCOlor: '#459B71',
          },
        }),
  },
});

function App() {
  const [mode, setMode] = useState(THEME_TYPES.LIGHT);

  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === THEME_TYPES.LIGHT ? THEME_TYPES.DARK : THEME_TYPES.LIGHT
        );
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <StyledComponentProvider theme={theme}>
      <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
    </StyledComponentProvider>
  );
}

export default App;
