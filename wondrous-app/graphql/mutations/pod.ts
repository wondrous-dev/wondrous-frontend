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

export const ARCHIVE_POD = gql`
  mutation archivePod($podId: ID!) {
    archivePod(podId: $podId) {
      success
    }
  }
`;

export const UNARCHIVE_POD = gql`
  mutation unarchivePod($podId: ID!) {
    unarchivePod(podId: $podId) {
      success
    }
  }
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

export const CREATE_JOIN_POD_REQUEST = gql`
  mutation createJoinPodRequest($podId: ID!, $message: String) {
    createJoinPodRequest(podId: $podId, message: $message) {
      success
    }
  }
`;

export const APPROVE_JOIN_POD_REQUEST = gql`
  mutation approveJoinPodRequest($userId: ID!, $podId: ID!) {
    approveJoinPodRequest(userId: $userId, podId: $podId) {
      success
    }
  }
`;

export const REJECT_JOIN_POD_REQUEST = gql`
  mutation rejectJoinPodRequest($userId: ID!, $podId: ID!) {
    rejectJoinPodRequest(userId: $userId, podId: $podId) {
      success
    }
  }
`;

export const KICK_POD_USER = gql`
  mutation kickPodUser($userId: ID!, $podId: ID!) {
    kickPodUser(userId: $userId, podId: $podId) {
      success
    }
  }
`;

export const ADD_POD_GITHUB_REPO = gql`
  mutation addPodGithubRepo($podId: ID!, $repoName: String!, $repoId: String!, $importTasks: Boolean) {
    addPodGithubRepo(podId: $podId, repoName: $repoName, repoId: $repoId, importTasks: $importTasks) {
      success
    }
  }
`;

export const DELETE_POD_GITHUB_REPO_INTEGRATION = gql`
  mutation deletePodGithubRepo($entityIntegrationId: ID!) {
    deletePodGithubRepo(entityIntegrationId: $entityIntegrationId) {
      success
    }
  }
`;
