import { gql } from '@apollo/client'

export const OrgInviteFragment = gql`
	fragment OrgInviteFragment on Org {
		id
		name
		profilePicture
		contributorCount
	}
`

export const OrgFragment = gql`
	fragment OrgFragment on Org {
		id
		name
		username
		description
		privacyLevel
		headerPicture
		profilePicture
		thumbnailPicture
		createdBy
		createdAt
		tags
		contributorCount
		podCount
		links {
			url
			displayName
			type
		}
	}
`
