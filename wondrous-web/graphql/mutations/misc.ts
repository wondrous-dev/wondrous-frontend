import { gql } from '@apollo/client'

export const CREATE_WAISTLIST_USER = gql`
	mutation createWaitlistUser($phoneNumber: String!) {
		createOrGetWaitlistUser(phoneNumber: $phoneNumber) {
			email
			phoneNumber
			invitesSent
			tokensRedeemed
		}
	}
`
