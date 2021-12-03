import React from 'react'
import { useRouter } from 'next/router'
import { Card } from '../components/Common/auth'
import { Button } from '../components/Common/button'
import AuthLayout from '../components/Common/Layout/Auth'

const Login = () => {
	const router = useRouter()

	return (
		<AuthLayout>
			<Card>
				<p>Login Form Here</p>

				<Button highlighted onClick={() => router.push('/home')}>
					Log me in
				</Button>
			</Card>
		</AuthLayout>
	)
}

export default Login
