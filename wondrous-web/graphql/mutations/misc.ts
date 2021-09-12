import { gql } from '@apollo/client'

export const CREATE_WAISTLIST_USER = gql`
	mutation createWaitlistUser($phoneNumber: String!) {
		createOrGetWaitlistUser(phoneNumber: $phoneNumber) {
			email
			phoneNumber
			invitesSent
			tokensRedeemed
			phoneVerified
		}
	}
`

export const RESEND_VERIFICATION_CODE = gql`
	mutation resendVerificationCode($phoneNumber: String!) {
		resendVerificationCode(phoneNumber: $phoneNumber) {
			success
		}
	}
`

export const VERIFY_WAITLIST_USER = gql`
	mutation verifyWaitlistUser(
		$phoneNumber: String!
		$verificationCode: String!
	) {
		verifyWaitlistUser(
			phoneNumber: $phoneNumber
			verificationCode: $verificationCode
		) {
			email
			phoneNumber
			invitesSent
			tokensRedeemed
		}
	}
`
