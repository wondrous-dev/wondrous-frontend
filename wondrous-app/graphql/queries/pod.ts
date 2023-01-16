import { gql } from '@apollo/client';
import { PodFragment, PodInviteFragment } from '../fragments/pod';

export const GET_POD_BY_ID = gql`
  query getPodById($podId: ID!) {
    getPodById(podId: $podId) {
      layout
      ...PodFragment
    }
  }
  ${PodFragment}
`;

export const GET_POD_INVITE_ORG_INFO = gql`
  query getInvitedPodInfo($token: String!) {
    getInvitedPodInfo(token: $token) {
      ...PodInviteFragment
    }
  }
  ${PodInviteFragment}
`;

export const GET_USER_PODS_WITH_COUNT = gql`
  query getUserPods($userId: String) {
    getUserPods(userId: $userId) {
      id
      username
      name
      profilePicture
      description
      color
      org {
        id
        name
        username
        profilePicture
      }
      tasksIncompleteCount
      contributorCount
    }
  }
`;

export const GET_USER_PODS = gql`
  query getUserPods($userId: String) {
    getUserPods(userId: $userId) {
      id
      username
      name
      profilePicture
      description
      color
    }
  }
`;

export const GET_USER_PODS_WITH_ORG_INFO = gql`
  query getUserPods($userId: String) {
    getUserPods(userId: $userId) {
      id
      username
      name
      profilePicture
      description
      color
      org {
        id
        name
        username
        profilePicture
      }
    }
  }
`;
export const GET_USER_AVAILABLE_PODS = gql`
  query getAvailableUserPods($orgId: String) {
    getAvailableUserPods(orgId: $orgId) {
      id
      username
      name
      profilePicture
      privacyLevel
      color
    }
  }
`;

export const GET_POD_USERS = gql`
  query getPodUsers($podId: String!, $limit: Int, $offset: Int, $searchString: String, $roleIds: [String]) {
    getPodUsers(podId: $podId, limit: $limit, offset: $offset, searchString: $searchString, roleIds: $roleIds) {
      user {
        id
        username
        profilePicture
        thumbnailPicture
        activeEthAddress
        firstName
        lastName
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

export const SEARCH_POD_USERS = gql`
  query searchPodUsers($podId: ID!, $searchString: String!) {
    searchPodUsers(podId: $podId, searchString: $searchString) {
      id
      username
      profilePicture
      bio
    }
  }
`;

export const GET_POD_ROLES = gql`
  query getPodRoles($podId: ID) {
    getPodRoles(podId: $podId) {
      id
      name
      permissions
      default
    }
  }
`;

export const GET_POD_ROLES_WITH_TOKEN_GATE_AND_DISCORD = gql`
  query getPodRolesWithTokenGate($podId: ID) {
    getPodRoles(podId: $podId) {
      id
      name
      permissions
      default
      tokenGatingCondition {
        id
        orgId
        podId
        name
        booleanLogic
        tokenAccessCondition {
          contractAddress
          type
          chain
          method
          minValue
          tokenIds
        }
        guildAccessCondition {
          guildId
          roleId
        }
      }
      discordRolesInfo {
        id
        name
      }
    }
  }
`;

export const GET_AUTO_CLAIMABLE_POD_ROLES = gql`
  query getAutoClaimablePodRoles($podId: ID!) {
    getAutoClaimablePodRoles(podId: $podId) {
      id
      name
      default
      permissions
      tokenGatingCondition {
        id
        orgId
        podId
        name
        booleanLogic
        tokenAccessCondition {
          contractAddress
          type
          chain
          method
          minValue
          tokenIds
        }
        guildAccessCondition {
          guildId
          roleId
        }
      }
      discordRolesInfo {
        id
        name
      }
    }
  }
`;

export const GET_USER_JOIN_POD_REQUEST = gql`
  query getUserJoinPodRequest($podId: ID!) {
    getUserJoinPodRequest(podId: $podId) {
      id
      podId
      approvedAt
      rejectedAt
    }
  }
`;

export const GET_JOIN_POD_REQUESTS = gql`
  query getJoinPodRequests($limit: Int, $offset: Int, $sortOrder: String, $orgId: ID, $podIds: [ID]) {
    getJoinPodRequests(limit: $limit, offset: $offset, sortOrder: $sortOrder, orgId: $orgId, podIds: $podIds) {
      id
      userId
      orgId
      podId
      approvedAt
      message
      rejectedAt
      userUsername
      userProfilePicture
      orgProfilePicture
      orgName
      orgUsername
      podColor
      podName
      createdAt
      checkIsGr15Contributor {
        isGr15Contributor
      }
    }
  }
`;

export const GET_POD_MEMBERSHIP_REQUEST = gql`
  query getPodMembershipRequest($podId: ID!, $limit: Int, $offset: Int, $searchString: String, $roleIds: [String]) {
    getPodMembershipRequest(
      podId: $podId
      limit: $limit
      offset: $offset
      searchString: $searchString
      roleIds: $roleIds
    ) {
      id
      userId
      orgId
      podId
      approvedAt
      message
      roleId
      roleName
      rejectedAt
      userUsername
      userProfilePicture
      orgProfilePicture
      orgName
      orgUsername
      podColor
      podName
      createdAt
      checkIsGr15Contributor {
        isGr15Contributor
      }
    }
  }
`;

export const GET_POD_GITHUB_INTEGRATIONS = gql`
  query getPodGithubRepoIntegrations($podId: ID!) {
    getPodGithubRepoIntegrations(podId: $podId) {
      id
      podId
      githubInfo {
        repoId
        repoPathname
      }
    }
  }
`;

export const GET_POD_GITHUB_PULL_REQUESTS = gql`
  query getPodGithubPullRequests($podId: ID!) {
    getPodGithubPullRequests(podId: $podId) {
      id
      title
      url
    }
  }
`;
