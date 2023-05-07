import { gql } from "@apollo/client"

export const LoggedinUserFragment = gql`
	fragment LoggedinUser on User {
		id
		username
		bio
		activeEthAddress
		profilePicture
		headerPicture
		thumbnailPicture
		userInfo {
			email
			hasPassword
			discordUsername
			discordDiscriminator
			twitterUsername
			orbit1Tweet
		}
		signupCompleted
		lastCompletedGuide
		projectGuideComplete
		mainBannerClosedAt
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

export const ProfileUserFragment = gql`
	fragment UserProfile on User {
		id
		username
		bio
		headerPicture
		activeEthAddress
		profilePicture
		thumbnailPicture
		links {
			url
			displayName
			type
		}
		userInfo {
			discordUsername
			discordDiscriminator
			twitterUsername
		}
	}
`

export const SmallUserFragment = gql`
	fragment UserSmall on User {
		id
		username
		headerPicture
		activeEthAddress
		profilePicture
		thumbnailPicture
	}
`

export const CmtyUserFragment = gql`
	fragment CmtyUserFragment on CmtyUser {
		id
		createdAt
		bio
		profilePicture
		thumbnailPicture
		web3Address
		web3AddressType
		discordId
		discordUsername
		discordDiscriminator
		point
		level
		username
		twitterInfo {
			twitterUsername
		}
	}
`
