import type { AppProps } from "next/app";
import React from "react";
import App from "next/app";
import { ThemeProvider as StyledComponentProvider } from "styled-components";
import Head from "next/head";
import { ApolloProvider } from "@apollo/client";
import { CssBaseline, useMediaQuery } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";

import apollo from "../services/apollo";
import theme from "../services/theme";
import { IsMobileContext } from "../utils/contexts";

type User = {
  dummy: String;
};

type AppContextStore = {
  isAuthenticated: boolean;
  // TODO change type of this context
  context: any;
  user: User;
};

const MyApp = (props) => {
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.

  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));
  const {
    Component,
    pageProps,
    context,
    isAuthenticated,
    user,
  } = props as Readonly<typeof props & AppContextStore>;
  return (
    <>
      <Head>
        <title>Wonder</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&family=Pacifico&display=swap"
          rel="stylesheet"
        ></link>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <IsMobileContext.Provider value={isMobile}>
        <StyledComponentProvider theme={theme}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ApolloProvider client={apollo}>
              <Component
                {...pageProps}
                query={context?.query}
                user={user}
                isAuthenticated={isAuthenticated}
              />
            </ApolloProvider>
          </ThemeProvider>
        </StyledComponentProvider>
      </IsMobileContext.Provider>
    </>
  );
};

MyApp.getInitialProps = async (appContext) => {
  const { ctx } = appContext;
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  if (typeof window === "undefined") {
    // TODO: GET /user here
    const user = {
      dummy: "object",
    };

    return {
      ...appProps,
      context: {
        query: ctx.query,
      },
      isAuthenticated: true,
      user,
    };
  }

  return appProps;
};

export default MyApp;
