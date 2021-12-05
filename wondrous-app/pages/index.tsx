import React from 'react'
import { useRouter } from 'next/router'
import { Card } from '../components/Common/auth'
import { Button } from '../components/Common/button'
import AuthLayout from '../components/Common/Layout/Auth'
import { LoginWrapper, SmallLogo, Form, Field, LineWithText, PaddedParagraph, Line, StyledLink } from '../components/Pages/login'
import { useState } from 'react'
import Image from 'next/image'
import { CenteredFlexRow } from '../components/Common/index'

const Login = () => {
	const router = useRouter()
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const validForm = () => {
		return email.length > 0 && password.length > 0;
	}

	const handleSubmit = (event) => {
		if(validForm) {
			//store email & password
			// route to home ---- () => router.push('/home')}
		}
		else {
			//print error
		}
	}

	return (
		
		<AuthLayout>
			<LoginWrapper>
				<Card>
					<SmallLogo />
					<h1>Login</h1>
					<Form onSubmit={handleSubmit}>
						<Field type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email address" url="/images/login/email.png"/>
						<Field type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" url="/images/login/lock.png"/>
						<Button highlighted type="submit" marginTop="25px">
							Log me in
						</Button>
					</Form>
					<LineWithText>
						<PaddedParagraph padding="0 10px" color="#828282">
							or
						</PaddedParagraph>
					</LineWithText>
					<Button>
						<Image src="/images/login/metamask-logo.png" alt="" height="18" width="17"/>
						<PaddedParagraph padding="0 10px" color="white">
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
						Problems logging in?
					</CenteredFlexRow>


				</Card>
			</LoginWrapper>
		</AuthLayout>
	)
}

export default Login
