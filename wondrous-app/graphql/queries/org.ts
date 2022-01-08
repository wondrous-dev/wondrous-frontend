import { gql } from '@apollo/client'
import { OrgInviteFragment } from '../fragments/org'

export const GET_ORG_ID_FROM_USERNAME = gql`
	query getOrgIdFromUsername($username: String!) {
		getOrgIdFromUsername(username: $username) {
			orgId
		}
	}
`

export const GET_ORG_INVITE_ORG_INFO = gql`
	query getInvitedOrgInfo($token: String!) {
		getInvitedOrgInfo(token: $token) {
			...OrgInviteFragment
		}
	}
	${OrgInviteFragment}
`

export const GET_USER_ORGS = gql`
	query getUserOrgs($userId: String) {
		getUserOrgs(userId: $userId) {
			id
			username
		}
	}
`
