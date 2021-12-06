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
import Image from 'next/image'
import { CenteredFlexRow } from '../components/Common/index'

const Login = () => {
	const router = useRouter()
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (event) => {
		event.preventDefault();
		//store email & password
		// route to home ---- router.push('/home')
	}

	const loginWithWallet = (event) => {
		// do wallet login work here
	}

	return (
		
		<AuthLayout>
			<LoginWrapper>
				<TopBubble src="/images/login/top-floater-bubble.png" alt=""/>
				<Card>
					<SmallLogo />
					<h1>Login</h1>
					<Form onSubmit={handleSubmit}>
						<Field type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email address" url="/images/login/email.png" required/>
						<Field type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" url="/images/login/lock.png" required/>
						<Button highlighted type="submit" marginTop="25px">
								Log me in
						</Button>
					</Form>
					<LineWithText>
						<PaddedParagraph padding="0 10px" color="#828282">
							or
						</PaddedParagraph>
					</LineWithText>
					<Button onClick={loginWithWallet}>
						<Image src="/images/login/metamask-logo.png" alt="" height="18" width="17"/>
						<PaddedParagraph padding="0 10px">
							Log in with MetaMask
						</PaddedParagraph>
					</Button>
					<Line size="80%" />
					<CenteredFlexRow marginTop="16px">
						Don't have an account yet?&nbsp;
						<StyledLink href="/signup">
							Sign up for the beta.
						</StyledLink>
					</CenteredFlexRow>
					<CenteredFlexRow>
						{/* TODO: replace link once we build out a way to report */}
						<StyledLink href="/report">
							Problems logging in?
						</StyledLink>
					</CenteredFlexRow>


				</Card>
			</LoginWrapper>
		</AuthLayout>
	)
}

export default Login
