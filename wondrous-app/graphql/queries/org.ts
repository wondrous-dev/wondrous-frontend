import { gql } from '@apollo/client'

export const GET_ORG_ID_FROM_USERNAME = gql`
	query getOrgIdFromUsername($username: String!) {
		getOrgIdFromUsername(username: $username) {
			orgId
		}
	}
`
