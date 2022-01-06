import { gql } from '@apollo/client'

export const OrgInviteFragment = gql`
	fragment OrgInviteFragment on Org {
		id
		name
		profilePicture
	}
`
