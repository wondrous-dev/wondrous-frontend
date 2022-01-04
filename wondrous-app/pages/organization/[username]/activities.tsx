import React from 'react'
import { withAuth } from '../../components/Auth/withAuth'
import Activities from '../../components/organization/activities/activities'

const ActivitiesPage = () => {
	return <Activities />
}

export default withAuth(ActivitiesPage)
