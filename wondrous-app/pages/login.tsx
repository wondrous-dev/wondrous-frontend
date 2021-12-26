import React, { useEffect } from 'react'
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
import { WonderWeb3 } from '../services/web3'
import { storeAuthHeader } from '../components/Auth/withAuth'
import apollo from '../services/apollo'
import { LOGIN_MUTATION } from '../graphql/mutations'

const Login = ({ csrfToken }) => {
	const wonderWeb3 = WonderWeb3()
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const router = useRouter()

	const handleSubmit = async (event) => {
		event.preventDefault()

		const {
			data: {
				emailSignin: { user, token },
			},
		} = await apollo.mutate({
			mutation: LOGIN_MUTATION,
			variables: {
				username: username,
				password: password,
			},
		})

		if (user) {
			// Set Apollo with Session
			await storeAuthHeader(token, user)
			
			// Lets go to Dashboard :)
			router.replace('/dashboard')	
		}
	}

	// This happens async, so we bind it to the
	// state of the component.
	const loginWithWallet = async (event) => {
		await wonderWeb3.onConnect()
	}

	useEffect(() => {
		if (wonderWeb3.wallet['address']) {
			// Wallet sign in
		} else {
			// Error Login Here
		}
	}, [wonderWeb3.wallet])

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
							value={username}
							onChange={(e) => setUsername(e.target.value)}
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

export default Login
