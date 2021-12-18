import { Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AppLayout from '../../../components/Common/Layout/App'
import { GithubButton } from '../../../components/Common/button'
import { useLazyQuery, useQuery } from '@apollo/client'
import { GET_GITHUB_ORGANIZATIONS } from '../../../graphql/queries/sourceIntegrations'

const UserGithubOrganizations = () => {
	// Select organization from a list
	const router = useRouter()
	// use query to get list of organizations from OAuth code query params
	// User selects them from check box
	// Ask to import more from Asana or CSV (Notion).
	console.log('router query', router.query)
	const [getOrgs, { data, error }] = useLazyQuery(GET_GITHUB_ORGANIZATIONS, {
		variables: {
			code: router?.query?.code,
		},
	})
	useEffect(() => {
		const code = router?.query?.code
		if (router?.query?.code) {
			getOrgs({
				variables: {
					code,
				},
			})
		}
	}, [router?.query?.code, getOrgs])
	console.log('data', data)
	console.log('error', error)
	return (
		<AppLayout>
			<></>
		</AppLayout>
	)
}

export default UserGithubOrganizations
