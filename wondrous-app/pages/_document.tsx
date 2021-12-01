import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import { ServerStyleSheets } from '@material-ui/styles'
import theme from '../services/theme'

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const styledComponentsSheet = new ServerStyleSheet()
		const materialSheets = new ServerStyleSheets()
		const originalRenderPage = ctx.renderPage

		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: (App) => (props) =>
						styledComponentsSheet.collectStyles(
							materialSheets.collect(<App {...props} />)
						),
				})
			const initialProps = await Document.getInitialProps(ctx)
			return {
				...initialProps,
				styles: (
					<React.Fragment>
						{initialProps.styles}
						{materialSheets.getStyleElement()}
						{styledComponentsSheet.getStyleElement()}
					</React.Fragment>
				),
			}
		} finally {
			styledComponentsSheet.seal()
		}
	}

	render() {
		return (
			<Html lang="en" dir="ltr">
				<Head>
					<script
						async
						src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
					/>
					<script
						dangerouslySetInnerHTML={{
							__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
						}}
					/>
					<meta charSet="utf-8" />
					{/* PWA primary color */}
					<meta name="theme-color" content={theme.palette.primary.main} />
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link
						rel="preconnect"
						href="https://fonts.gstatic.com"
						crossOrigin="true"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&family=Pacifico&display=swap"
						rel="stylesheet"
					></link>
				</Head>
				<body>
					<script>0</script>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
