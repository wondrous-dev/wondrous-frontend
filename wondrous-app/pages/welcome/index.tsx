import React from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'

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
