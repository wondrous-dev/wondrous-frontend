import React from 'react'
import { Main, Footer } from './styles'

const AuthLayout = ({ children }) => {
	return (
		<>
			<Main>{children}</Main>
			<Footer />
		</>
	)
}

export default AuthLayout
