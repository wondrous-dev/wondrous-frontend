import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ThemeProvider as StyledComponentProvider } from 'styled-components';
import Head from 'next/head';
import { ApolloProvider } from '@apollo/client';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { SnackbarAlertProvider } from 'components/Common/SnackbarAlert';
import { Web3Provider } from '@ethersproject/providers';
import NavigationProgress from 'components/NavigationProgress';
import '../styles/body.css';
import '../styles/globals.css';

import apollo from 'services/apollo';
import theme from 'theme';
import { HotkeyContext, IsMobileContext } from 'utils/contexts';
import { initHotjar } from 'utils/hotjar';
import { Web3ReactProvider } from '@web3-react/core';
import { WonderWeb3Provider } from 'services/web3/context/WonderWeb3Context';
import OnboardingTour from 'components/Guide';
import SidebarLayout from 'components/Common/Layout';
import { useHotkeys } from 'react-hotkeys-hook';
import { HOTKEYS } from 'utils/hotkeyHelper';

declare global {
  interface Window {
    gtag: any;
  }
}

type User = {
  dummy: String;
};

type AppContextStore = {
  isAuthenticated: boolean;
  // TODO change type of this context
  context: any;
  user: User;
};

function MyApp({ Component, context, isAuthenticated, user, pageProps: { session, ...pageProps } }) {
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showHotkeys, setShowHotkeys] = useState(false);

  useHotkeys(
    HOTKEYS.SHOW_SHORTCUTS,
    () => {
      setShowHotkeys(!showHotkeys);
    },
    [showHotkeys]
  );

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
        page_path: url,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    initHotjar();
  }, []);

  function getLibrary(provider): Web3Provider {
    const library = new Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
  }

  return (
    <>
      <Head>
        <title>Wonder</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/images/favicon.ico" />
      </Head>

      <IsMobileContext.Provider value={isMobile}>
        <StyledComponentProvider theme={theme}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ApolloProvider client={apollo}>
              <SnackbarAlertProvider>
                <Web3ReactProvider getLibrary={getLibrary}>
                  <WonderWeb3Provider>
                    <HotkeyContext.Provider value={showHotkeys}>
                      <NavigationProgress />
                      <SidebarLayout>
                        <OnboardingTour>
                          <Component
                            {...pageProps}
                            query={context?.query}
                            user={user}
                            isAuthenticated={isAuthenticated}
                            key={router.asPath}
                          />
                        </OnboardingTour>
                      </SidebarLayout>
                    </HotkeyContext.Provider>
                  </WonderWeb3Provider>
                </Web3ReactProvider>
              </SnackbarAlertProvider>
            </ApolloProvider>
          </ThemeProvider>
        </StyledComponentProvider>
      </IsMobileContext.Provider>
    </>
  );
}

export default MyApp;
