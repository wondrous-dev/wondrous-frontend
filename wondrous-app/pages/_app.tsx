import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { ThemeProvider as StyledComponentProvider } from 'styled-components'
import Head from 'next/head'
import { ApolloProvider } from '@apollo/client'
import { CssBaseline, useMediaQuery } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/core/styles'

import '../theme/stylesheets/body.css'

import apollo from '../services/apollo'
import theme from '../theme/theme'
import { IsMobileContext } from '../utils/contexts'
import { initHotjar } from '../utils/hotjar'

declare global {
    interface Window {
        gtag:any;
    }
}

type User = {
	dummy: String
}

type AppContextStore = {
	isAuthenticated: boolean
	// TODO change type of this context
	context: any
	user: User
}

const MyApp = ({
	Component,
	context,
	isAuthenticated,
	user,
	pageProps: { session, ...pageProps },
}) => {
	// Only uncomment this method if you have blocking data requirements for
	// every single page in your application. This disables the ability to
	// perform automatic static optimization, causing every page in your app to
	// be server-side rendered.
	const router = useRouter()
	const isMobile = !useMediaQuery(theme.breakpoints.up('sm'))

	useEffect(() => {
		initHotjar()
		const handleRouteChange = (url) => {
			window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
				page_path: url,
			})
		}
		router.events.on('routeChangeComplete', handleRouteChange)
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange)
		}
	}, [router.events])
	return (
		<>
			<Head>
				<title>Wonder</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
				<link rel="shortcut icon" href="/images/favicon.ico" />
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
	)
}

export default MyApp
