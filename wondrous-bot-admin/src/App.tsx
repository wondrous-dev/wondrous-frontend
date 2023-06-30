import { useEffect, useMemo, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "pages/home";
import { ThemeProvider as StyledComponentProvider } from "styled-components";

import "./App.css";
import CreatePage from "pages/quests/create";
import Layout from "components/Layout";

import QuestsPage from "pages/quests";
import { createTheme, PaletteMode, ThemeProvider } from "@mui/material";
import { THEME_TYPES } from "utils/constants";
import MembersPage from "pages/quests/members";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import QuestResultsPage from "pages/quests/QuestResultsPage";
import LevelsPage from "pages/levels";
import LoginPage from "pages/login";
import TwitterCallbackPage from "pages/twitter/callback";
import client from "services/apollo";
import { ApolloProvider } from "@apollo/client";
import { SnackbarAlertProvider } from "components/SnackbarAlert";
import { WonderWeb3Provider } from "utils/context/WonderWeb3Context";
import SettingsPage from "pages/settings";
import TeamSettingsPage from "pages/settings/team";
import WalletConnectPage from "pages/wallet/connect";
import OnboardingPage from "pages/onboarding";
import DiscordOrgCallbackPage from "pages/discord/callback/org-connect";
import DiscordCallbackPage from "pages/discord/callback";
import TestPage from "pages/test";
import ViewQuest from "pages/quests/ViewQuest";
import DiscordCallbackCmtyUserConnect from "pages/discord/callback/cmty-user-connect";
import SignupPage from "pages/signup";
import OnboardingWelcomePage from "pages/onboarding/welcome";
import InvitePage from "pages/invite";
import PaymentPage from "pages/payment";
import QuestsPaymentPage from 'pages/quests/Payments';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/onboarding",
        element: <OnboardingPage />,
      },
      {
        path: "/settings/*",
        element: <SettingsPage />,
      },
      {
        path: "/settings/team",
        element: <TeamSettingsPage />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/quests",
        element: <QuestsPage />,
      },
      {
        path: '/quests/:id/payments',
        element: <QuestsPaymentPage />
      },
      {
        path: "/quests/:id",
        element: <QuestResultsPage />,
      },
      {
        path: "/quests/create",
        element: <CreatePage />,
      },
      {
        path: "/quests/view/:id",
        element: <ViewQuest />,
      },
      {
        path: "/members",
        element: <MembersPage />,
      },
      {
        path: "/levels",
        element: <LevelsPage />,
      },
      {
        path: "/twitter/callback",
        element: <TwitterCallbackPage />,
      },
      {
        path: "/wallet/connect",
        element: <WalletConnectPage />,
      },
      {
        path: "/discord/callback/org-connect",
        element: <DiscordOrgCallbackPage />,
      },
      {
        path: "/discord/callback",
        element: <DiscordCallbackPage />,
      },
      {
        path: "/test",
        element: <TestPage />,
      },
      {
        path: "/discord/callback/cmty-user-connect",
        element: <DiscordCallbackCmtyUserConnect />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/onboarding/welcome",
        element: <OnboardingWelcomePage />,
      },
      {
        path: '/invite/:token',
        element: <InvitePage />
      },
      {
        path: '/settings/payments',
        element: <PaymentPage />
      },
    ],
  },
]);

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          // primaryBackground: '#FFFFFF',
          background: {
            default: "#FFFFFF",
            card: "#FFFFFF",
            cardHover: "#FEE2CA",
            header: "#000000",
          },
          text: {
            primary: "#000000",
            labelColor: "#2A8D5C",
          },
        }
      : {
          // palette values for dark mode
          background: {
            default: "#0C002D",
            card: "#0C002D",
            cardHover: "#3B9669",
            header: "#F7F7F7",
          },
          text: {
            primary: "#FFFFFF",
            labelCOlor: "#459B71",
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
        setMode((prevMode: PaletteMode) => (prevMode === THEME_TYPES.LIGHT ? THEME_TYPES.DARK : THEME_TYPES.LIGHT));
      },
    }),
    []
  );

  function getLibrary(provider): Web3Provider {
    const library = new Web3Provider(provider);
    return library;
  }

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  return (
    <StyledComponentProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <SnackbarAlertProvider>
            <Web3ReactProvider getLibrary={getLibrary}>
              <WonderWeb3Provider>
                <RouterProvider router={router} />
              </WonderWeb3Provider>
            </Web3ReactProvider>
          </SnackbarAlertProvider>
        </ApolloProvider>
      </ThemeProvider>
    </StyledComponentProvider>
  );
}

export default App;
