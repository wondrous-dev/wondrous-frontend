import { gql } from '@apollo/client'

import { PublicUserFragment } from '../fragments/user'

export const SIGNUP = gql`
  mutation Signup($input: AuthInput!) {
    signup(input: $input) {
      token
      user {
        ...PublicUser
      }
    }
  }
  ${PublicUserFragment}
`