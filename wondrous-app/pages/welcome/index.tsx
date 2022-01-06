import React from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@apollo/client'
import { GET_ORG_INVITE_ORG_INFO } from '../../graphql/queries/org'

import { InviteWelcomeBox } from '../../components/Onboarding/welcome'
import { MainWrapper } from '../../components/Onboarding/styles'
import { UPDATE_USER } from '../../graphql/mutations'

const ContributorOnboardingPage = () => {
	const router = useRouter()
	const [updateUser] = useMutation(UPDATE_USER, {
		onCompleted: () => {
			router.replace('/build-profile')
		},
	})
	return (
		<MainWrapper>
			<InviteWelcomeBox updateUser={updateUser} />
		</MainWrapper>
	)
}

export default ContributorOnboardingPage
