import { gql } from '@apollo/client'

export const WHOAMI = gql`
  query whoami {
    users {
      id
      email
      firstName
      lastName
      privacyLevel
    }
  }
`