import { gql } from '@apollo/client'

export const CREATE_BLOCKED_USER = gql`
  mutation createBlockedUser($blockedId: ID!) {
    createBlockedUser(blockedId: $blockedId) {
      blockedId
    }
  }
`