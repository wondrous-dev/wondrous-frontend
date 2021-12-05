import React from 'react'
import { useRouter } from 'next/router'
import { Card } from '../components/Common/auth'
import { Button } from '../components/Common/button'
import AuthLayout from '../components/Common/Layout/Auth'
import { LoginWrapper, SmallLogo } from '../components/Pages/login'
import { FlexRow } from '../components/Common/index'

const Login = () => {
	const router = useRouter()

	return (
		
		<AuthLayout>
			<LoginWrapper>
				<Card>
					<FlexRow>
						<SmallLogo />
					</FlexRow>
					<FlexRow>
						<h1>Login</h1>
					</FlexRow>

					<p>Login Form Here</p>

					<Button highlighted onClick={() => router.push('/home')}>
						Log me in
					</Button>
				</Card>
			</LoginWrapper>
		</AuthLayout>
	)
}

export default Login
