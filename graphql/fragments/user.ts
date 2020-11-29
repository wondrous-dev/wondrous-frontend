import { gql } from '@apollo/client'

export const PublicUserFragment = gql`
  fragment PublicUser on User {
    id
    email
    profilePicture
    username
    firstName
    lastName
    privacyLevel
  }
`