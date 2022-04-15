import { gql } from '@apollo/client';
import { PodFragment, PodInviteFragment } from '../fragments/pod';

export const GET_POD_BY_ID = gql`
  query getPodById($podId: ID!) {
    getPodById(podId: $podId) {
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
export const GET_USER_PODS = gql`
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
      milestoneCount
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
    }
  }
`;

export const GET_POD_USERS = gql`
  query getPodUsers($podId: String!, $limit: Int, $offset: Int) {
    getPodUsers(podId: $podId, limit: $limit, offset: $offset) {
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

export const SEARCH_POD_USERS = gql`
  query searchPodUsers($podId: ID!, $queryString: String!) {
    searchPodUsers(podId: $podId, queryString: $queryString) {
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
  query getJoinPodRequests($limit: Int, $offset: Int) {
    getJoinPodRequests(limit: $limit, offset: $offset) {
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
    }
  }
`;
