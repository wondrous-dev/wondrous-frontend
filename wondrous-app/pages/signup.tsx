import { getCsrfToken, getSession } from 'next-auth/react'
import React from 'react'
import AuthLayout from '../components/Common/Layout/Auth'

const Signup = () => {
	return <AuthLayout>Signup Form Here</AuthLayout>
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
	const session = await getSession({ req: context.req })
	if (session) {
		return {
			redirect: {
				destination: '/dashboard',
				permanent: false,
			},
		}
	}
	return {
		props: {
			csrfToken: await getCsrfToken(context),
		},
	}
}

export default Signup
