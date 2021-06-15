import { gql } from '@apollo/client'
import { UserinviteFragment } from '../fragments/userInvite'

export const MY_USER_INVITE = gql`
  query myUserInvite {
    userInvitation {
      userInvitationId
      invitorFirstName
      invitorLastName
      groupId
    }
  }
`