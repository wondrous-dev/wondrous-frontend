import React from 'react'
import { useRouter } from 'next/router'
import { Card } from '../components/Common/auth'
import { Button } from '../components/Common/button'
import AuthLayout from '../components/Common/Layout/Auth'
import { LoginWrapper, SmallLogo, Form } from '../components/Pages/login'
import { useState } from 'react'

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
						<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
						<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
						<Button highlighted type="submit">
							Log me in
						</Button>
					</Form>

					<p>Login Form Here</p>


				</Card>
			</LoginWrapper>
		</AuthLayout>
	)
}

export default Login
