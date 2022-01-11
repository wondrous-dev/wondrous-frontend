import { gql } from '@apollo/client'
import {
	LoggedinUserFragment,
	LoggedinWaitlistUserFragment,
} from '../fragments/user'

export const WHOAMI = gql`
	query whoami {
		users {
			...LoggedinUser
		}
	}
	${LoggedinUserFragment}
`

export const GET_LOGGED_IN_USER = gql`
	query {
		getLoggedinUser {
			...LoggedinUser
		}
	}
	${LoggedinUserFragment}
`

export const WHOAMI_WAITLIST = gql`
	query whoamiWaitlist {
		waitlistUsers {
			...LoggedinWaitlistUser
		}
	}
	${LoggedinWaitlistUserFragment}
`

export const GET_LOGGED_IN_WAITLIST_USER = gql`
	query {
		getLoggedinWaitlistUser {
			...LoggedinWaitlistUser
		}
	}
	${LoggedinWaitlistUserFragment}
`

export const GET_USER_SIGNING_MESSAGE = gql`
	query getUserSigningMessage($web3Address: String!, $blockchain: String!) {
		getUserSigningMessage(web3Address: $web3Address, blockchain: $blockchain) {
			userExists
			signingMessage
		}
	}
`

export const GET_USER_ID_FROM_USERNAME = gql`
	query getUserIdFromUsername($username: String!) {
		getUserIdFromUsername(username: $username) {
			userId
		}
	}
`

export const GET_USER_ORGS = gql`
	query getUserOrgs($userId: String) {
		getUserOrgs(userId: $userId) {
			id
			username
			name
			profilePicture
			thumbnailPicture
		}
	}
`

export const GET_USER_PERMISSION_CONTEXT = gql`
	query getUserPermissionContext {
		getUserPermissionContext
	}
`

export const GET_AUTOCOMPLETE_USERS = gql`
	query GetAutocompleteUsers($username: String!) {
		getAutocompleteUsers(username: $username) {
			id
			firstName
			lastName
			username
			profilePicture
		}
	}
`
