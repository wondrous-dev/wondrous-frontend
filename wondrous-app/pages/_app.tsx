import 'react-aspect-ratio/aspect-ratio.css';
import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { ThemeProvider as StyledComponentProvider } from 'styled-components';
import Head from 'next/head';
import { ApolloProvider } from '@apollo/client';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { SnackbarAlertProvider } from 'components/Common/SnackbarAlert';
import { Web3Provider } from '@ethersproject/providers';
import NavigationProgress from 'components/NavigationProgress';
import '../styles/body.css';
import '../styles/globals.css';
// eslint-disable-next-line import/no-unresolved
import 'swiper/css';
// eslint-disable-next-line import/no-unresolved
import 'swiper/css/pagination';

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
import * as snippet from '@segment/snippet';
import { CornerWidgetProvider } from 'components/Common/CornerWidget';

declare global {
  interface Window {
    analytics: any;
    Localize: any;
  }
}

const LOCALIZE_KEY = process.env.NEXT_PUBLIC_LOCALIZE_KEY;
function renderSnippet() {
  const opts = {
    apiKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY || '',
    page: false,
  };

  if (process.env.NODE_ENV === 'development') {
    return snippet.max(opts);
  }

  return snippet.min(opts);
}

const Layout = ({ Component, pageProps }) =>
  Component.getLayout ? (
    Component.getLayout(<Component id="tour-header-launch" {...pageProps} />)
  ) : (
    <Component id="tour-header-launch" {...pageProps} />
  );

function MyApp({ Component, pageProps }) {
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
      if (process.env.NODE_ENV === 'production') {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        window.analytics.page(params);
      }
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
      <Script id="segment-script" dangerouslySetInnerHTML={{ __html: renderSnippet() }} />
      <Script
        id="localize"
        src="https://global.localizecdn.com/localize.js"
        onLoad={(a) => {
          // eslint-disable-next-line no-unused-vars
          !(function (a) {
            if (!a.Localize) {
              a.Localize = {};
              for (
                let e = [
                    'translate',
                    'untranslate',
                    'phrase',
                    'initialize',
                    'translatePage',
                    'setLanguage',
                    'getLanguage',
                    'getSourceLanguage',
                    'detectLanguage',
                    'getAvailableLanguages',
                    'untranslatePage',
                    'bootstrap',
                    'prefetch',
                    'on',
                    'off',
                    'hideWidget',
                    'showWidget',
                  ],
                  t = 0;
                t < e.length;
                t++
              )
                a.Localize[e[t]] = function () {};
              return true;
            }
          })(window);
          // @ts-ignore
          Localize.initialize({ key: LOCALIZE_KEY, rememberLanguage: true, autoApprove: true });
        }}
      />
      <IsMobileContext.Provider value={isMobile}>
        <StyledComponentProvider theme={theme}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ApolloProvider client={apollo}>
              <SnackbarAlertProvider>
                <CornerWidgetProvider>
                  <Web3ReactProvider getLibrary={getLibrary}>
                    <WonderWeb3Provider>
                      <HotkeyContext.Provider value={showHotkeys}>
                        <NavigationProgress />
                        <SidebarLayout>
                          <OnboardingTour>
                            <Layout Component={Component} pageProps={pageProps} />≈
                          </OnboardingTour>
                        </SidebarLayout>
                      </HotkeyContext.Provider>
                    </WonderWeb3Provider>
                  </Web3ReactProvider>
                </CornerWidgetProvider>
              </SnackbarAlertProvider>
            </ApolloProvider>
          </ThemeProvider>
        </StyledComponentProvider>
      </IsMobileContext.Provider>
    </>
  );
}

export default MyApp;
