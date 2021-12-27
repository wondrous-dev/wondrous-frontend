import { gql } from '@apollo/client'
import { LoggedinUserFragment } from '../fragments/user'

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
    signinWithWeb3(input: { web3Address: $web3Address, signedMessage: $signedMessage }) {
      user {
				...LoggedinUser
			}
      token
    }
  }
  ${LoggedinUserFragment}
`

