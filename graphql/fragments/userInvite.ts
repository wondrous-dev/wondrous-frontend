import { gql } from '@apollo/client'

export const UserinviteFragment = gql`
  fragment UserInviteFragment on UserInvite {
    createdAt
    userId
    inviteeEmail
    inviteePhone
    inviteLink
    status
    inviteeUserId
  }
`
