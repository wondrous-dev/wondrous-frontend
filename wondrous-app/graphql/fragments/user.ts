import { gql } from '@apollo/client'

export const LoggedinUserFragment = gql`
	fragment LoggedinUser on User {
		id
		username
		active_eth_address
		profilePicture
		thumbnailPicture
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
