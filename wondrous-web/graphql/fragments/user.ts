import { gql } from '@apollo/client'

export const LoggedinUserFragment = gql`
  fragment LoggedinUser on User {
    id
    country
    displayName
    email
    profilePicture
    accountType
    userType
    createdAt
  }
`
