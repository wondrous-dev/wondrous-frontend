import { gql } from '@apollo/client'
import { PodFragment } from '../fragments/pod'

export const CREATE_POD = gql`
  mutation createPod($input: PodInput) {
    createPod(input: $input) {
      ...PodFragment
    }
  }
  ${PodFragment}
`

export const CREATE_POD_INVITE_LINK = gql`
mutation createPodInviteLink($input: PodInviteLinkInput) {
    createPodInviteLink (input: $input) {
      id
      token
    }
  }
`
