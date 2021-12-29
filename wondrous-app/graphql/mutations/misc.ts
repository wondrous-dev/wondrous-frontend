import { gql } from '@apollo/client'
import {
	LoggedinUserFragment,
	LoggedinWaitlistUserFragment,
} from '../fragments/user'

export const CREATE_USER = gql`
	mutation emailSignup($email: String!, $password: String!) {
		emailSignup(input: { email: $email, password: $password }) {
			user {
				...LoggedinUser
			}
			token
		}
	}
	${LoggedinUserFragment}
`

export const CREATE_WALLET_USER = gql`
	mutation signupWithWeb3(
		$web3Address: String!
		$signedMessage: String!
		$blockchain: String!
		$username: String
		$firstName: String
		$lastName: String
	) {
		signupWithWeb3(
			input: {
				web3Address: $web3Address
				signedMessage: $signedMessage
				blockchain: $blockchain
				username: $username
				firstName: $firstName
				lastName: $lastName
			}
		) {
			user {
				...LoggedinUser
			}
			token
		}
	}
	${LoggedinUserFragment}
`

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
