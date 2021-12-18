import { Typography } from '@material-ui/core'
import React from 'react'
import { GithubButton } from '../../components/Common/button'
import AppLayout from '../../components/Common/Layout/App'

const SourceIntegrations = () => {
	// Integrations for task import - Github, Asana, CSV (Notion is this category)
	const clientId = 'bc52927f6e6000e202f3'
	const OAuthurl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user,read:org,repo`
	return (
		<AppLayout>
			<a href={OAuthurl}>
				<GithubButton>
					<Typography variant="body1">Log in with Github</Typography>
				</GithubButton>
			</a>
		</AppLayout>
	)
}

export default SourceIntegrations
