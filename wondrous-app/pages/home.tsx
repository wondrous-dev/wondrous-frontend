import React from 'react'
import AppLayout from '../components/Common/Layout/App'
import { GmBox, WelcomeMessage } from '../components/Pages/home'

const Home = () => {
	return (
		<AppLayout>
			<WelcomeMessage>
				<GmBox>☀️gm</GmBox>
				<span>Welcome to Wonderverse!</span>
			</WelcomeMessage>
		</AppLayout>
	)
}

export default Home
