import { getSession } from 'next-auth/react'
import React from 'react'
import Activities from '../../components/organization/activities/activities'

const ActivitiesPage = () => {
	return <Activities />
}

export async function getServerSideProps(context) {
	const session = await getSession({ req: context.req })
	if (!session) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		}
	}
	return {
		props: { session },
	}
}


export default ActivitiesPage
