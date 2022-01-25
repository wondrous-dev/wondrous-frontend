import { gql } from '@apollo/client';
import { PodFragment } from '../fragments/pod';

export const CREATE_POD = gql`
  mutation createPod($input: PodInput) {
    createPod(input: $input) {
      ...PodFragment
    }
  }
  ${PodFragment}
`;

export const UPDATE_POD = gql`
  mutation updatePod($podId: ID!, $input: PodInput) {
    updatePod(podId: $podId, input: $input) {
      ...PodFragment
    }
  }
  ${PodFragment}
`;

export const CREATE_POD_INVITE_LINK = gql`
  mutation createPodInviteLink($input: PodInviteLinkInput) {
    createPodInviteLink(input: $input) {
      id
      token
    }
  }
`;

export const UPDATE_USER_POD_ROLE = gql`
  mutation updateUserPodRole($input: UserPodRoleUpdateInput) {
    updateUserPodRole(input: $input) {
      success
    }
  }
`;
