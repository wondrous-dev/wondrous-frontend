import React from 'react'
import { Logo } from '../../ci'
import { Header, Main, Footer, Container } from './styles'

const AppLayout = ({ children }) => {
	return (
		<>
			<Header>
				<Logo />
			</Header>
			<Main>
				<Container>{children}</Container>
			</Main>
			<Footer />
		</>
	)
}

export default AppLayout
