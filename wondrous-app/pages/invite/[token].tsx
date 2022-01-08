import React from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@apollo/client'
import { GET_ORG_INVITE_ORG_INFO } from '../../graphql/queries/org'

import { InviteWelcomeBox, Logo } from '../../components/Onboarding/signup'
import { MainWrapper } from '../../components/Onboarding/styles'
import { REDEEM_ORG_INVITE_LINK } from '../../graphql/mutations'

const ContributorOnboardingPage = () => {
	const router = useRouter()

	const { token } = router.query
	const { data, loading, error } = useQuery(GET_ORG_INVITE_ORG_INFO, {
		variables: {
			token,
		},
	})
	const [redeemOrgInviteLink] = useMutation(REDEEM_ORG_INVITE_LINK, {
		variables: {
			token,
		},
		onCompleted: (data) => {
			if (data?.redeemOrgInviteLink?.success) {
				router.replace(`/onboarding/welcome`)
			}
		},
	})
	const orgInfo = data?.getInvitedOrgInfo

	return (
		<MainWrapper>
			<Logo />
			<InviteWelcomeBox
				orgInfo={orgInfo}
				redeemOrgInviteLink={redeemOrgInviteLink}
			/>
		</MainWrapper>
	)
}

export default ContributorOnboardingPage
