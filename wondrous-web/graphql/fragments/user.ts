import { gql } from '@apollo/client'

export const LoggedinUserFragment = gql`
	fragment LoggedinUser on User {
		id
		country
		displayName
		email
		profilePicture
		accountType
		userType
		createdAt
	}
`

export const LoggedinWaitlistUserFragment = gql`
	fragment LoggedinWaitlistUser on WaitlistUser {
		id
		email
		phoneNumber
		invitesSent
		refCode
		tokensEarned
		phoneVerified
	}
`
