import { gql } from '@apollo/client'
import { LoggedinUserFragment, ProfileUserFragment } from '../fragments/user'

export const LOGIN_MUTATION = gql`
	mutation emailSignin($email: String!, $password: String!) {
		emailSignin(input: { email: $email, password: $password }) {
			user {
				...LoggedinUser
			}
			token
		}
	}
	${LoggedinUserFragment}
`
export const LOGIN_WALLET_MUTATION = gql`
	mutation signinWithWeb3($web3Address: String!, $signedMessage: String!) {
		signinWithWeb3(
			input: { web3Address: $web3Address, signedMessage: $signedMessage }
		) {
			user {
				...LoggedinUser
			}
			token
		}
	}
	${LoggedinUserFragment}
`

export const REDEEM_ORG_INVITE_LINK = gql`
	mutation redeemOrgInviteLink($token: String!) {
		redeemOrgInviteLink(token: $token) {
			success
		}
	}
`

export const UPDATE_USER = gql`
	mutation updateUser($input: UserUpdateInput!) {
		updateUser(input: $input) {
			...UserProfile
		}
	}
	${ProfileUserFragment}
`