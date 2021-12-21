import React from 'react'
import { useRouter } from 'next/router'
import { Card } from '../components/Common/auth'
import { Button } from '../components/Common/button'
import AuthLayout from '../components/Common/Layout/Auth'
import { LineWithText, Line } from '../components/Common/lines'
import { Form } from '../components/Common/form'
import { Field } from '../components/Common/field'
import { PaddedParagraph, StyledLink } from '../components/Common/text'
import { SmallLogo, LoginWrapper, TopBubble } from '../components/Pages/login'
import { useState } from 'react'
import { CenteredFlexRow } from '../components/Common/index'
import { Grey50 } from '../theme/colors'
import { Metamask } from '../components/Icons/metamask'
import { EmailIcon, LockIcon } from '../components/Icons/userpass'

import { getCsrfToken, getSession, signIn } from 'next-auth/react'

import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'

const Login = ({ csrfToken }) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const providerOptions = {
		walletconnect: {
			package: WalletConnectProvider,
			options: {
				infuraId: process.env.REACT_APP_INFURA_ID,
			},
		},
	}

	let provider = null
	let web3 = null
	let accounts = null

	const handleSubmit = (event) => {
		event.preventDefault()
		signIn('credentials', { email: email, username: email, password: password })
	}

	const loginWithWallet = async (event) => {
		if (!accounts) {
			await showWalletConnect()
		}
		signIn('credentials', { wallet: accounts[0] })
	}

	const connect = async (web3Modal) => {
		provider = await web3Modal.connect()
		return new Web3(provider)
	}

	const showWalletConnect = async () => {
		if (!provider) {
			const web3Modal = new Web3Modal({
				cacheProvider: true,
				providerOptions,
			})
			web3 = await connect(web3Modal)
		}

		if (!accounts) {
			accounts = await web3.eth.getAccounts()
		}
	}

	return (
		<AuthLayout>
			<LoginWrapper>
				<TopBubble src="/images/login/top-floater-bubble.png" alt="" />
				<Card>
					<SmallLogo />
					<h1>Login</h1>
					<Form onSubmit={handleSubmit}>
						<input name="csrfToken" type="hidden" defaultValue={csrfToken} />
						<Field
							type="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter email address"
							icon={EmailIcon}
							required
						/>
						<Field
							type="password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter password"
							icon={LockIcon}
							required
						/>
						<Button highlighted type="submit" marginTop="25px">
							Log me in
						</Button>
					</Form>
					<LineWithText>
						<PaddedParagraph padding="0 10px" color={Grey50}>
							or
						</PaddedParagraph>
					</LineWithText>
					<Button onClick={loginWithWallet}>
						<Metamask height="18" width="17" />
						<PaddedParagraph padding="0 10px">
							Log in with MetaMask
						</PaddedParagraph>
					</Button>
					<Line size="80%" />
					<CenteredFlexRow marginTop="16px">
						Don&apos;t have an account yet?&nbsp;
						<StyledLink href="/signup">Sign up for the beta.</StyledLink>
					</CenteredFlexRow>
					<CenteredFlexRow>
						{/* TODO: replace link once we build out a way to report */}
						<StyledLink href="/report">Problems logging in?</StyledLink>
					</CenteredFlexRow>
				</Card>
			</LoginWrapper>
		</AuthLayout>
	)
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
	const session = await getSession({ req: context.req })
	if (session) {
		return {
			redirect: {
				destination: '/dashboard',
				permanent: false,
			},
		}
	}
	return {
		props: {
			csrfToken: await getCsrfToken(context),
		},
	}
}

export default Login
