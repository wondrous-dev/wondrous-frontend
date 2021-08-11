import { gql } from '@apollo/client'

export const CREATE_WAISTLIST_USER = gql`
  mutation createWaitlistUser($email: String!) {
    createWaitlistUser(email: $email) {
      success
    }
  }
`
