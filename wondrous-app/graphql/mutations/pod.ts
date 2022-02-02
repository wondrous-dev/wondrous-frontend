import { gql } from '@apollo/client';
import { PodFragment, PodRoleFragment } from '../fragments/pod';

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

export const CREATE_POD_ROLE = gql`
  mutation createPodRole($input: PodRoleCreateInput) {
    createPodRole(input: $input) {
      ...PodRoleFragment
    }
  }
  ${PodRoleFragment}
`;

export const UPDATE_POD_ROLE = gql`
  mutation updatePodRole($input: PodRoleUpdateInput) {
    updatePodRole(input: $input) {
      ...PodRoleFragment
    }
  }
  ${PodRoleFragment}
`;

export const DELETE_POD_ROLE = gql`
  mutation deletePodRole($id: ID!) {
    deletePodRole(id: $id) {
      success
    }
  }
`;

export const INVITE_USER_TO_POD = gql`
  mutation inviteUserToPod($userId: ID!, $roleId: ID!, $podId: ID!) {
    inviteUserToPod(userId: $userId, podId: $podId, roleId: $roleId) {
      user {
        id
        username
        profilePicture
        bio
      }
      role {
        permissions
        id
        name
      }
    }
  }
`;
