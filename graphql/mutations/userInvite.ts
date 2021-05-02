import { gql } from '@apollo/client'

import { UserinviteFragment } from '../fragments/userInvite'

export const CREATE_INVITE_LINK = gql`
  mutation CreateInviteLink($phoneNumber: String, $inviteeEmail: String) {
    createInviteLink(phoneNumber: $phoneNumber, inviteeEmail: $inviteeEmail) {
      link
    }
  }
`
