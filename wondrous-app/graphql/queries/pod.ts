import { gql } from '@apollo/client'

export const GET_USER_PODS = gql`
	query getUserPods($userId: String) {
		getUserPods(userId: $userId) {
			id
			username
			name
			profilePicture
		}
	}
`

export const GET_USER_AVAILABLE_PODS = gql`
	query getAvailableUserPods($orgId: String) {
		getAvailableUserPods(orgId: $orgId) {
			id
			username
			name
			profilePicture
		}
	}
`
