import { gql } from '@apollo/client'
import { LoggedinUserFragment } from '../fragments/user'

export const CREATE_WAITLIST_USER = gql`
	mutation CreateWaitlistUser($email: String!) {
		CreateWaitlistUser(email: $email) {
			success
		}
	}
	${LoggedinUserFragment}
`
