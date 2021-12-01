import { gql } from '@apollo/client'
import { LoggedinWaitlistUserFragment } from '../fragments/user'

export const CREATE_WAITLIST_USER = gql`
	mutation createWaitlistUser($phoneNumber: String!, $inviteRefCode: String) {
		createOrGetWaitlistUser(
			phoneNumber: $phoneNumber
			inviteRefCode: $inviteRefCode
		) {
			token
			waitlistUser {
				...LoggedinWaitlistUser
			}
		}
	}
	${LoggedinWaitlistUserFragment}
`

export const RESEND_VERIFICATION_CODE = gql`
	mutation resendVerificationCode($phoneNumber: String!) {
		resendVerificationCode(phoneNumber: $phoneNumber) {
			success
		}
	}
`

export const VERIFY_WAITLIST_USER = gql`
	mutation VerifyWaitlistUser(
		$phoneNumber: String!
		$verificationCode: String!
	) {
		verifyWaitlistUser(
			phoneNumber: $phoneNumber
			verificationCode: $verificationCode
		) {
			token
			waitlistUser {
				...LoggedinWaitlistUser
			}
		}
	}
	${LoggedinWaitlistUserFragment}
`
