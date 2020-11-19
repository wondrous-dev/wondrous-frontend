import { gql } from '@apollo/client'

export const SIGNUP = gql`
  mutation Signup($input: AuthInput!) {
    signup(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
        privacyLevel
      }
    }
  }
`