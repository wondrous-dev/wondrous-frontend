import { useMemo, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from 'pages/home';
import { ThemeProvider as StyledComponentProvider } from 'styled-components';

import './App.css';
import CreatePage from 'pages/quests/create';
import Layout from 'components/Layout';
import QuestsPage from 'pages/quests';
import { createTheme, PaletteMode, ThemeProvider } from '@mui/material';
import { THEME_TYPES } from 'utils/constants';
import MembersPage from 'pages/quests/members';
import QuestResultsPage from 'pages/quests/QuestResultsPage';
import LevelsPage from 'pages/levels';
import LoginPage from 'pages/login';
import client from 'services/apollo';
import { ApolloProvider } from '@apollo/client';
import { SnackbarAlertProvider } from 'components/SnackbarAlert';
import { WonderWeb3Provider } from 'utils/context/WonderWeb3Context';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/quests',
        element: <QuestsPage />,
      },
      {
        path: '/quests/:id',
        element: <QuestResultsPage />,
      },
      {
        path: '/quests/create',
        element: <CreatePage />,
      },
      {
        path: '/members',
        element: <MembersPage />,
      },
      {
        path: '/levels',
        element: <LevelsPage />,
      },
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
            header: '#000000',
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
            header: '#F7F7F7',
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
        <ApolloProvider client={client}>
          <SnackbarAlertProvider>
            <WonderWeb3Provider>
              <RouterProvider router={router} />
            </WonderWeb3Provider>
          </SnackbarAlertProvider>
        </ApolloProvider>
      </ThemeProvider>
    </StyledComponentProvider>
  );
}

export default App;
