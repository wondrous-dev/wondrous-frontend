import { gql } from '@apollo/client';
import { OrgFragment, OrgInviteFragment } from '../fragments/org';

export const GET_ORG_BY_ID = gql`
  query getOrgById($orgId: ID!) {
    getOrgById(orgId: $orgId) {
      ...OrgFragment
    }
  }
  ${OrgFragment}
`;

export const GET_ORG_FROM_USERNAME = gql`
  query getOrgFromUsername($username: String!) {
    getOrgFromUsername(username: $username) {
      ...OrgFragment
    }
  }
  ${OrgFragment}
`;

export const GET_ORG_INVITE_ORG_INFO = gql`
  query getInvitedOrgInfo($token: String!) {
    getInvitedOrgInfo(token: $token) {
      ...OrgInviteFragment
    }
  }
  ${OrgInviteFragment}
`;

export const GET_USER_ORGS = gql`
  query getUserOrgs($userId: String) {
    getUserOrgs(userId: $userId) {
      id
      username
      name
      profilePicture
      thumbnailPicture
      privacyLevel
    }
  }
`;

export const GET_ORG_USERS = gql`
  query getOrgUsers($orgId: String!, $limit: Int, $offset: Int) {
    getOrgUsers(orgId: $orgId, limit: $limit, offset: $offset) {
      user {
        id
        username
        profilePicture
        thumbnailPicture
        additionalInfo {
          podCount
        }
        firstName
        lastName
        bio
      }
      role {
        id
        permissions
        name
      }
    }
  }
`;

export const GET_ORG_ROLES = gql`
  query getOrgRoles($orgId: ID) {
    getOrgRoles(orgId: $orgId) {
      id
      name
      default
      permissions
    }
  }
`;

export const GET_ORG_ROLES_WITH_TOKEN_GATE = gql`
  query getOrgRolesWithTokenGate($orgId: ID) {
    getOrgRoles(orgId: $orgId) {
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
        accessCondition {
          contractAddress
          type
          chain
          method
          minValue
          tokenIds
        }
      }
    }
  }
`;

export const GET_ORG_REVIEWERS = gql`
  query getOrgReviewers($orgId: String!) {
    getOrgReviewers(orgId: $orgId) {
      profilePicture
      id
      username
      name
    }
  }
`;

export const GET_ORG_PODS = gql`
  query getOrgPods($orgId: String) {
    getOrgPods(orgId: $orgId) {
      id
      name
      username
      description
      privacyLevel
      headerPicture
      profilePicture
      thumbnailPicture
      createdBy
      createdAt
      orgId
      tags
      contributorCount
      tasksCompletedCount
    }
  }
`;

export const SEARCH_ORG_USERS = gql`
  query searchOrgUsers($orgId: ID!, $queryString: String!) {
    searchOrgUsers(orgId: $orgId, queryString: $queryString) {
      id
      username
      profilePicture
      thumbnailPicture
      additionalInfo {
        podCount
      }
      firstName
      lastName
      bio
    }
  }
`;
export const GET_JOIN_ORG_REQUESTS = gql`
  query getJoinOrgRequests($limit: Int, $offset: Int) {
    getJoinOrgRequests(limit: $limit, offset: $offset) {
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
    }
  }
`;

export const GET_USER_JOIN_ORG_REQUEST = gql`
  query getUserJoinOrgRequest($orgId: ID!) {
    getUserJoinOrgRequest(orgId: $orgId) {
      id
      orgId
      approvedAt
      rejectedAt
    }
  }
`;
