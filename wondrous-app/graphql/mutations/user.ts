import { gql } from '@apollo/client'
import { LoggedinUserFragment } from '../fragments/user'

export const LOGIN_MUTATION = gql`
  mutation Signin($username: String!, $password: String!) {
    emailSignin(input: { username: $username, password: $password }) {
      user {
				...LoggedinUser
			}
      token
    }
  }
  ${LoggedinUserFragment}
`
export const LOGIN_WALLET_MUTATION = gql`
  mutation Signin($address: String!, $signed: String!) {
    walletSignin(input: { address: $address, signed: $signed }) {
      user {
				...LoggedinUser
			}
      token
    }
  }
  ${LoggedinUserFragment}
`

