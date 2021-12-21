import React from 'react'
import { Logo } from '../../ci'
import { Header, Main, Footer, Container } from './styles'
import { signOut } from 'next-auth/react'

const AppLayout = ({ children }) => {
	return (
		<>
			<Header>
				<Logo />
				<button onClick={() => signOut()}>Logout</button>
			</Header>
			<Main>
				<Container>{children}</Container>
			</Main>
			<Footer />
		</>
	)
}

export default AppLayout
