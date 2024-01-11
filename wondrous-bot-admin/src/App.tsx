import { useMemo, useState } from "react";
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
import BillingPage from "pages/settings/billing";
import NotificationSettingsPage from "pages/settings/notification";
import WalletConnectPage from "pages/wallet/connect";
import OnboardingPage from "pages/onboarding";
import DiscordOrgCallbackPage from "pages/discord/callback/org-connect";
import DiscordCallbackPage from "pages/discord/callback";
import ViewQuest from "pages/quests/ViewQuest";
import DiscordCallbackCmtyUserConnect from "pages/discord/callback/cmty-user-connect";
import SignupPage from "pages/signup";
import OnboardingWelcomePage from "pages/onboarding/welcome";
import InvitePage from "pages/invite";
import GoogleOauthCallbackPage from "pages/oauth/google/callback";
import PaymentPage from "pages/payment";
import QuestsPaymentPage from "pages/quests/Payments";
import PricingPage from "pages/pricing";
import VerifyLinkPage from "pages/verify-link";
import AnalyticsPage from "pages/analytics";
import ConnectPage from "pages/settings/connect";
import TelegramStatQuest from "pages/telegram/start-quest";
import PaywallContextProvider from "utils/context/PaywallContext";
import ReferralComponent from "components/Referral";
import DiscordCallbackReferralUserConnect from "pages/discord/callback/referral-user-connect";
import TelegramConnect from "pages/telegram/connect";
import StorePage from "pages/store";
import CreateStoreItem from "pages/store/CreateStoreItem";
import StoreItem from "pages/store/StoreItem";
import CommunityNFTSettingsPage from "pages/settings/nft";
import CommunityBadgeClaimPage from "pages/community-badge/claim";
import ReferralsPage from "pages/referrals";
import ReferralsCreatePage from "pages/referrals/ReferralsCreate";
import ViewReferralPage from "pages/referrals/ViewReferral";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";
import { SUPPORTED_CHAINS_META } from "utils/web3Constants";
import RewardfulTag from "components/AddFormEntity/components/RewardfulTag";
import CmtyUserActivityPage from "pages/activity";

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

const metadata = {
  name: "Wonderverse",
  description: "Empower your community",
  url: "https://communities.wonderverse.xyz/",
  icons: ["https://communities.wonderverse.xyz/wonder-black.svg"],
};

createWeb3Modal({
  ethersConfig: defaultConfig({
    metadata,
    defaultChainId: 1,
    enableEIP6963: true,
    enableInjected: true,
    enableCoinbase: true,
  }),
  chains: SUPPORTED_CHAINS_META,
  projectId,
});

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
        path: "/settings/notifications",
        element: <NotificationSettingsPage />,
      },
      {
        path: "/settings/team",
        element: <TeamSettingsPage />,
      },
      {
        path: "/settings/billing",
        element: <BillingPage />,
      },
      {
        path: "/settings/connect",
        element: <ConnectPage />,
      },
      {
        path: "/settings/nft",
        element: <CommunityNFTSettingsPage />,
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
        path: "/quests/:id/payments",
        element: <QuestsPaymentPage />,
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
        path: "/referral-campaign",
        element: <ReferralComponent />,
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
        path: "/discord/callback/cmty-user-connect",
        element: <DiscordCallbackCmtyUserConnect />,
      },
      {
        path: "/discord/callback/referral",
        element: <DiscordCallbackReferralUserConnect />,
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
        path: "/invite/:token",
        element: <InvitePage />,
      },
      {
        path: "/settings/payments",
        element: <PaymentPage />,
      },
      {
        path: "/oauth/google/callback",
        element: <GoogleOauthCallbackPage />,
      },
      {
        path: "/pricing",
        element: <PricingPage />,
      },
      {
        path: "/verify-link",
        element: <VerifyLinkPage />,
      },
      {
        path: "/analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "/telegram/start-quest/:id",
        element: <TelegramStatQuest />,
      },
      {
        path: "/telegram/connect",
        element: <TelegramConnect />,
      },
      {
        path: "/store",
        element: <StorePage />,
      },
      {
        path: "/store/items/create",
        element: <CreateStoreItem />,
      },
      {
        path: "/store/items/:id",
        element: <StoreItem />,
      },
      {
        path: "/community-badge/claim",
        element: <CommunityBadgeClaimPage />,
      },
      {
        path: "/referrals",
        element: <ReferralsPage />,
      },
      {
        path: "/referrals/create",
        element: <ReferralsCreatePage />,
      },
      {
        path: "/referrals/:id",
        element: <ViewReferralPage />,
      },
      {
        path: "/activity/:id",
        element: <CmtyUserActivityPage />,
      },
    ],
  },
]);

const getDesignTokens = (mode) => ({
  typography: {
    fontFamily: "Poppins",
  },
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
  console.log(theme, 'theme')
  return (
    <StyledComponentProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <SnackbarAlertProvider>
            <WonderWeb3Provider>
              <PaywallContextProvider>
                <RouterProvider router={router} />
              </PaywallContextProvider>
            </WonderWeb3Provider>
            <RewardfulTag />
          </SnackbarAlertProvider>
        </ApolloProvider>
      </ThemeProvider>
    </StyledComponentProvider>
  );
}

export default App;
